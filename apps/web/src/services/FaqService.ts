import { FaqRepository } from "../repositories/FaqRepository";
import { Faq } from "../interfaces/Faq";

export class FaqService {
    private repository: FaqRepository;

    public constructor(repository?: FaqRepository) {
        this.repository = repository || new FaqRepository();
    }

    // Get all FAQs
    public async getAllFaqs(): Promise<Faq[]> {
        try {
            return await this.repository.getAll();
        }
        catch (error: unknown) {
            throw new Error(`Failed to fetch FAQs: ${(error as Error).message}`);
        }
    }

    // Get a single FAQ by question
    public async getFaq(question: string): Promise<Faq | null> {
        try {
            return await this.repository.getByQuestion(question);
        }
        catch (error: unknown) {
            if (isHttpError(error) && error.status === 404) {
                return null;
            }

            throw new Error(`Failed to fetch FAQ: ${(error as Error).message}`);
        }
    }

    // Create a new FAQ
    public async createFaq(faq: Faq): Promise<Faq> {
        try {
            return await this.repository.create(faq);
        }
        catch (error: unknown) {
            throw new Error(`Failed to create FAQ: ${(error as Error).message}`);
        }
    }

    // Update an existing FAQ
    public async updateFaq(question: string, faq: Faq): Promise<Faq> {
        try {
            return await this.repository.update(question, faq);
        }
        catch (error: unknown) {
            throw new Error(`Failed to update FAQ: ${(error as Error).message}`);
        }
    }

    // Delete an FAQ
    public async deleteFaq(question: string): Promise<void> {
        try {
            await this.repository.delete(question);
        }
        catch (error: unknown) {
            throw new Error(`Failed to delete FAQ: ${(error as Error).message}`);
        }
    }
}

// Type guard for HTTP errors
function isHttpError(error: unknown): error is { status: number } {
    return (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        "status" in (error as object) && typeof (error as Record<string, unknown>)["status"] === "number"
    );
}
