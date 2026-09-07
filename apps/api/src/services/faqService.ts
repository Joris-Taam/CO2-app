import { Faq } from "@api/models/Faq";
import { IFaqInterface } from "@api/interfaces/IFaqInterface";

export class FaqService {
    public constructor(private readonly faqRepository: IFaqInterface) {
    }

    public async getAllFaqs(): Promise<Faq[]> {
        return this.faqRepository.findAll();
    }

    public async getFaqByQuestion(question: string): Promise<Faq | null> {
        if (!question || question.trim().length === 0) {
            throw new Error("Invalid FAQ question");
        }

        return this.faqRepository.findByQuestion(question);
    }

    public async createFaq(faq: Faq): Promise<Faq> {
        if (!faq.question || !faq.categoryName) {
            throw new Error("Question and category are required");
        }

        return this.faqRepository.create(faq);
    }

    public async updateFaq(question: string, faq: Faq): Promise<boolean> {
        return this.faqRepository.update(question, faq);
    }

    public async deleteFaq(question: string): Promise<boolean> {
        return this.faqRepository.delete(question);
    }
}
