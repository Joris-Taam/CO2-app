import { FaqService } from "../services/FaqService";
import { FaqRepository } from "../repositories/FaqRepository";
import { Faq } from "../interfaces/Faq";
import "@web/components/AdminSidebarComponent";
import { AuthService } from "../services/AuthService";

void new AuthService().checkAdminAccess();

const faqService: FaqService = new FaqService(new FaqRepository());
const container: HTMLElement = document.getElementById("faq-container") as HTMLElement;

const modal: HTMLDivElement = document.getElementById("faq-modal") as HTMLDivElement;
const openBtn: HTMLButtonElement = document.getElementById("open-create") as HTMLButtonElement;
const closeBtn: HTMLButtonElement = document.getElementById("close-modal") as HTMLButtonElement;

const form: HTMLFormElement = document.getElementById("create-faq-form") as HTMLFormElement;
const questionInput: HTMLInputElement = document.getElementById("faq-question") as HTMLInputElement;
const descriptionInput: HTMLTextAreaElement = document.getElementById("faq-description") as HTMLTextAreaElement;
const categoryInput: HTMLInputElement = document.getElementById("faq-category") as HTMLInputElement;

let editMode: boolean = false;
let currentQuestion: string = "";

// load faq
async function loadFaqs(): Promise<void> {
    try {
        const faqs: Faq[] = await faqService.getAllFaqs();

        if (faqs.length === 0) {
            container.innerHTML = `
        <tr>
          <td colspan="5">No FAQs found</td>
        </tr>
      `;

            return;
        }

        container.innerHTML = "";

        faqs.forEach((faq: Faq) => {
            const row: HTMLTableRowElement = document.createElement("tr");

            row.innerHTML = `
            <td>${faq.question}</td>
            <td>${faq.categoryName}</td>
            <td>
                <button class="btn btn-primary btn-sm edit-btn" data-question="${faq.question}">
                Wijzigen
                </button>
                <button class="btn btn-danger btn-sm delete-btn" data-question="${faq.question}">
                Verwijderen
                </button>
            </td>
            `;

            container.appendChild(row);
        });

        attachEditListeners();
        attachDeleteListeners();
    }
    catch (error) {
        container.innerHTML = `
      <tr>
        <td colspan="5" style="color:red;">Error loading FAQs</td>
      </tr>
    `;
        console.error(error);
    }
}

// popup
function openModal(): void {
    modal.classList.add("show");
    modal.classList.remove("hidden");
}

function closeModal(): void {
    modal.classList.remove("show");
    setTimeout(() => modal.classList.add("hidden"), 300);
}

// create / update
async function handleCreateFaq(event: Event): Promise<void> {
    event.preventDefault();

    const faq: Faq = {
        question: questionInput.value.trim(),
        description: descriptionInput.value.trim() || null,
        categoryName: categoryInput.value.trim(),
    };

    try {
        if (editMode) {
            await faqService.updateFaq(currentQuestion, faq);
            editMode = false;
            currentQuestion = "";
        }
        else {
            await faqService.createFaq(faq);
        }

        form.reset();
        (modal.querySelector("h2") as HTMLHeadingElement).textContent = "FAQ toevoegen";
        (form.querySelector("button[type='submit']") as HTMLButtonElement).textContent = "Opslaan";
        closeModal();

        void loadFaqs();
    }
    catch (error) {
        console.error("Failed to save FAQ:", error);
    }
}

// edit function
function attachEditListeners(): void {
    const editButtons: NodeListOf<Element> = document.querySelectorAll(".edit-btn");
    editButtons.forEach((btn: Element) => {
        btn.addEventListener("click", async () => {
            const question: string = (btn as HTMLButtonElement).dataset["question"]!;
            currentQuestion = question;
            editMode = true;

            const faq: Faq | null = await faqService.getFaq(question);

            if (!faq) {
                return;
            }

            questionInput.value = faq.question;
            descriptionInput.value = faq.description ?? "";
            categoryInput.value = faq.categoryName;

            (modal.querySelector("h2") as HTMLHeadingElement).textContent = "FAQ aanpassen";
            (form.querySelector("button[type='submit']") as HTMLButtonElement).textContent = "Bijwerken";

            openModal();
        });
    });
}

// delete function
function attachDeleteListeners(): void {
    const deleteButtons: NodeListOf<Element> = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((btn: Element) => {
        btn.addEventListener("click", async () => {
            const question: string = (btn as HTMLButtonElement).dataset["question"]!;
            const confirmed: boolean = window.confirm(`Weet je zeker dat je "${question}" wilt verwijderen?`);

            if (!confirmed) {
                return;
            }

            try {
                await faqService.deleteFaq(question);
                void loadFaqs();
            }
            catch (error) {
                console.error("Failed to delete FAQ:", error);
            }
        });
    });
}

// dom loading
document.addEventListener("DOMContentLoaded", () => {
    void loadFaqs();

    openBtn.addEventListener("click", () => {
        editMode = false;
        currentQuestion = "";
        form.reset();
        questionInput.disabled = false;
        (modal.querySelector("h2") as HTMLHeadingElement).textContent = "FAQ toevoegen";
        (form.querySelector("button[type='submit']") as HTMLButtonElement).textContent = "Opslaan";
        openModal();
    });

    closeBtn.addEventListener("click", closeModal);
    form.addEventListener("submit", handleCreateFaq);
});
