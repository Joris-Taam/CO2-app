import { FaqService } from "../services/FaqService";
import { Faq } from "../interfaces/Faq";
import "@web/components/NavigationComponent";

const faqService: FaqService = new FaqService();
const container: HTMLElement = document.getElementById("faqContainer") as HTMLElement;

async function init(): Promise<void> {
    const faqs: Faq[] = await faqService.getAllFaqs();

    const grouped: Record<string, Faq[]> = groupByCategory(faqs);

    renderFaqs(grouped);
}

function groupByCategory(faqs: Faq[]): Record<string, Faq[]> {
    const map: Record<string, Faq[] | undefined> = {};

    faqs.forEach((faq: Faq) => {
        if (map[faq.categoryName] === undefined) {
            map[faq.categoryName] = [];
        }

        map[faq.categoryName]!.push(faq);
    });

    return map as Record<string, Faq[]>;
}

function renderFaqs(groupedFaqs: Record<string, Faq[]>): void {
    Object.entries(groupedFaqs).forEach(([category, faqs]: [string, Faq[]]) => {
        const categoryDiv: HTMLDivElement = document.createElement("div");
        categoryDiv.className = "faq-category";

        const categoryBtn: HTMLButtonElement = document.createElement("button");
        categoryBtn.className = "faq-category-btn";
        categoryBtn.innerHTML = `${category} <span>+</span>`;

        const questionContainer: HTMLDivElement = document.createElement("div");
        questionContainer.className = "faq-questions";

        faqs.forEach((faq: Faq) => {
            const questionDiv: HTMLDivElement = document.createElement("div");
            questionDiv.className = "faq-question";

            const questionBtn: HTMLButtonElement = document.createElement("button");
            questionBtn.className = "faq-question-btn";
            questionBtn.innerHTML = `${faq.question} <span>+</span>`;

            const answerDiv: HTMLDivElement = document.createElement("div");
            answerDiv.className = "faq-answer";
            answerDiv.textContent = faq.description ?? "";

            questionBtn.addEventListener("click", () => {
                answerDiv.classList.toggle("show");
            });

            questionDiv.appendChild(questionBtn);
            questionDiv.appendChild(answerDiv);

            questionContainer.appendChild(questionDiv);
        });

        categoryBtn.addEventListener("click", () => {
            questionContainer.classList.toggle("show");
        });

        categoryDiv.appendChild(categoryBtn);
        categoryDiv.appendChild(questionContainer);

        container.appendChild(categoryDiv);
    });
}

void init();
