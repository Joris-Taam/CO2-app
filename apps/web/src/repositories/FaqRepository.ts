import { Faq } from "../interfaces/Faq";

const API_URL: string = "http://localhost:3001/faq";

export class FaqRepository {
    public async getAll(): Promise<Faq[]> {
        const response: Response = await fetch(API_URL, { method: "GET" });

        if (!response.ok) {
            throw new Error("Failed to fetch FAQs");
        }

        return (await response.json()) as Faq[];
    }

    public async getByQuestion(question: string): Promise<Faq> {
        const response: Response = await fetch(
            `${API_URL}/${encodeURIComponent(question)}`,
            { method: "GET" }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch FAQ");
        }

        return (await response.json()) as Faq;
    }

    public async create(faq: Faq): Promise<Faq> {
        const response: Response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(faq),
        });

        if (!response.ok) {
            throw new Error("Failed to create FAQ");
        }

        return (await response.json()) as Faq;
    }

    public async update(question: string, faq: Faq): Promise<Faq> {
        const response: Response = await fetch(
            `${API_URL}/${encodeURIComponent(question)}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(faq),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update FAQ");
        }

        return (await response.json()) as Faq;
    }

    public async delete(question: string): Promise<void> {
        const url: string = `${API_URL}/${encodeURIComponent(question)}`;
        const response: Response = await fetch(url, { method: "DELETE" });

        if (!response.ok) {
            throw new Error("Failed to delete FAQ");
        }
    }
}
