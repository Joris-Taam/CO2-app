import "@web/components/AdminSidebarComponent";
import { AdminReportsService } from "@web/services/AdminReportsService";
import { DepartmentService } from "@web/services/DepartmentService";
import { Chart, LinearScaleOptions, registerables } from "chart.js";
import { AdminReports, AdminReportsPeriod, chartSettings } from "@web/interfaces/AdminReports";
import { Department } from "@web/Models/Department";
import { AuthService } from "@web/services/AuthService";

await new AuthService().checkAdminAccess();

Chart.register(...registerables);

const service: AdminReportsService = new AdminReportsService();
const departmentService: DepartmentService = new DepartmentService();

let myChart: Chart;
let totalRow: AdminReports | undefined;
let chartData: AdminReports[] = [];
let activePeriod: AdminReportsPeriod | undefined;

const totalValue: HTMLElement | null = document.getElementById("totalValue");
const totalTitle: HTMLElement | null = document.getElementById("totalTitle");
const barChart: HTMLCanvasElement = document.getElementById("barChart") as HTMLCanvasElement;
const chartDropdown: HTMLSelectElement = document.getElementById("charts") as HTMLSelectElement;
const startDateInput: HTMLInputElement = document.getElementById("startDate") as HTMLInputElement;
const endDateInput: HTMLInputElement = document.getElementById("endDate") as HTMLInputElement;
const filterBtn: HTMLElement | null = document.getElementById("filterBtn");
const exportBtn: HTMLElement | null = document.getElementById("exportBtn");
const departmentFilter: HTMLSelectElement = document.getElementById("departmentFilter") as HTMLSelectElement;
const loadingIndicator: HTMLElement | null = document.getElementById("loadingIndicator");
const periodButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll<HTMLButtonElement>(".btn-period");

const chartText: Record<string, chartSettings> = {
    kilometers: {
        label: "Totaal aantal Kilometers",
        yAxis: "Kilometers (totaal)",
        title: "Totaal aantal kilometers",
        unit: "km",
        chartType: "totalKilometers",
    },
    totalTrips: {
        label: "Totaal aantal Ritten",
        yAxis: "Ritten (totaal)",
        title: "Totaal aantal ritten",
        unit: "ritten",
        chartType: "totalTrips",
    },
    co2: {
        label: "CO2 Uitstoot (kg)",
        yAxis: "Uitstoot (totaal)",
        title: "Totaal aantal CO2 uitstoot",
        unit: "kg CO2",
        chartType: "totalCo2",
    },
};

function setLoading(active: boolean): void {
    if (loadingIndicator) {
        loadingIndicator.style.display = active ? "block" : "none";
    }
}

function showNoData(): void {
    if (totalValue) {
        totalValue.innerText = "Geen data beschikbaar";
    }

    if (totalTitle) {
        totalTitle.innerText = "Geen resultaten";
    }
}

function showError(): void {
    if (totalValue) {
        totalValue.innerText = "Fout bij het laden van data";
    }

    if (totalTitle) {
        totalTitle.innerText = "Er is iets misgegaan";
    }
}

function getFilterValues(): { startDate: string | undefined; endDate: string | undefined; department: string | undefined } {
    const selected: string[] = Array.from(departmentFilter.selectedOptions)
        .map(opt => opt.value)
        .filter(Boolean);

    return {
        startDate: startDateInput.value || undefined,
        endDate: endDateInput.value || undefined,
        department: selected.length > 0 ? selected.join(",") : undefined,
    };
}

function setActivePeriodButton(period: string): void {
    periodButtons.forEach(btn => {
        btn.classList.toggle("active", btn.dataset["period"] === period);
    });
}

async function loadDepartments(): Promise<void> {
    try {
        const departments: Department[] = await departmentService.getAllDepartments();

        departments.forEach(department => {
            const option: HTMLOptionElement = document.createElement("option");
            option.value = department.name;
            option.innerText = department.name;
            departmentFilter.appendChild(option);
        });
    }
    catch (error) {
        console.error("Fout bij het laden van afdelingen:", error);
    }
}

function initChart(labels: string[]): void {
    myChart = new Chart(barChart, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "",
                    data: [],
                    backgroundColor: "darkcyan",
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "",
                    },
                },
            },
        },
    });
}

function sortChartDataByCo2(): void {
    chartData.sort((a, b) => b.totalCo2 - a.totalCo2);
}

function processReports(reports: AdminReports[]): void {
    totalRow = reports.find(report => report.vehicle_name === "TOTAL");
    chartData = reports.filter(report => report.vehicle_name !== "TOTAL");
    sortChartDataByCo2();
}

function clearChart(): void {
    myChart.data.labels = [];
    myChart.data.datasets[0].data = [];
    myChart.update();
}

function updateReport(viewType: string): void {
    const config: (typeof chartText)[keyof typeof chartText] = chartText[viewType];

    if (!totalRow) {
        return;
    }

    myChart.data.datasets[0].data = chartData.map(r => Number(r[config.chartType]));
    myChart.data.datasets[0].label = config.label;

    const yAxis: LinearScaleOptions = myChart.options.scales?.y as LinearScaleOptions;
    yAxis.title.text = config.yAxis;

    if (totalTitle && totalValue) {
        totalTitle.innerText = config.title;

        const rawValue: number = Number(totalRow[config.chartType]);
        const isRides: boolean = config.chartType === "totalTrips";

        totalValue.innerText = isRides
            ? `${rawValue} ${config.unit}`
            : `${rawValue.toFixed(2)} ${config.unit}`;
    }

    myChart.update();
}

async function renderChart(): Promise<void> {
    try {
        setLoading(true);

        const reports: AdminReports[] = await service.getAllAdminReports();

        processReports(reports);
        initChart(chartData.map(report => report.vehicle_name));

        chartDropdown.addEventListener("change", () => updateReport(chartDropdown.value));

        if (chartData.length === 0) {
            showNoData();

            return;
        }

        updateReport("co2");
    }
    catch (error) {
        console.error("Fout bij het laden van de data:", error);
        showError();
    }
    finally {
        setLoading(false);
    }
}

async function loadData(startDate?: string, endDate?: string, department?: string, period?: AdminReportsPeriod): Promise<void> {
    try {
        setLoading(true);

        const reports: AdminReports[] = await service.getAllAdminReports(startDate, endDate, department, period);

        processReports(reports);

        if (chartData.length === 0) {
            showNoData();
            clearChart();

            return;
        }

        myChart.data.labels = chartData.map(report => report.vehicle_name);
        updateReport(chartDropdown.value);
    }
    catch (error) {
        console.error("Fout bij het laden van de data:", error);
        showError();
    }
    finally {
        setLoading(false);
    }
}

periodButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
        const value: string = btn.dataset["period"] ?? "";
        activePeriod = value !== "" ? value as AdminReportsPeriod : undefined;

        setActivePeriodButton(value);

        if (activePeriod !== undefined) {
            startDateInput.value = "";
            endDateInput.value = "";
        }

        const { department } = getFilterValues();

        await loadData(undefined, undefined, department, activePeriod);
    });
});

filterBtn?.addEventListener("click", async () => {
    activePeriod = undefined;
    setActivePeriodButton("");

    const { startDate, endDate, department } = getFilterValues();

    await loadData(startDate, endDate, department);
});

exportBtn?.addEventListener("click", async () => {
    const { startDate, endDate, department } = getFilterValues();

    try {
        await service.exportCsv(startDate, endDate, department, activePeriod);
    }
    catch (error) {
        console.error("Fout bij het exporteren:", error);
    }
});

await loadDepartments();
await renderChart();
