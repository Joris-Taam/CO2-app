import { Request, Response } from "express";
import { FaqService } from "@api/services/faqService";
import { Faq } from "@api/models/Faq";

export class FaqController {
    public constructor(private readonly faqService: FaqService) {
    }

    public getAll = async (_req: Request, res: Response): Promise<void> => {
        try {
            const faqs: Faq[] = await this.faqService.getAllFaqs();

            res.status(200).json(faqs);
        }
        catch (error: unknown) {
            const message: string =
                error instanceof Error ? error.message : "Kan geen FAQ's laden";

            res.status(500).json({ message });
        }
    };

    public getByQuestion = async (
        req: Request<{ question: string }>,
        res: Response
    ): Promise<void> => {
        try {
            const question: string = decodeURIComponent(req.params.question);
            const faq: Faq | null = await this.faqService.getFaqByQuestion(question);

            if (!faq) {
                res.status(404).json({ message: "Geen FAQ gevonden" });

                return;
            }

            res.status(200).json(faq);
        }
        catch (error: unknown) {
            const message: string =
                error instanceof Error ? error.message : "Ongeldige aanvraag";

            res.status(400).json({ message });
        }
    };

    public create = async (
        req: Request<object, object, Faq>,
        res: Response
    ): Promise<void> => {
        try {
            const faq: Faq = req.body;
            const createdFaq: Faq = await this.faqService.createFaq(faq);

            res.status(201).json(createdFaq);
        }
        catch (error: unknown) {
            const message: string =
                error instanceof Error ? error.message : "Kan FAQ niet aanmaken";

            res.status(400).json({ message });
        }
    };

    public update = async (
        req: Request<{ question: string }, object, Faq>,
        res: Response
    ): Promise<void> => {
        try {
            const question: string = decodeURIComponent(req.params.question);
            const updatedFaq: Faq = req.body;

            const updated: boolean = await this.faqService.updateFaq(
                question,
                updatedFaq
            );

            if (!updated) {
                res.status(404).json({ message: "FAQ niet gevonden" });

                return;
            }

            res.status(200).json({ message: "FAQ aangepast" });
        }
        catch (error: unknown) {
            const message: string =
                error instanceof Error ? error.message : "Kan FAQ niet aanpassen";

            res.status(400).json({ message });
        }
    };

    public delete = async (
        req: Request<{ question: string }>,
        res: Response
    ): Promise<void> => {
        try {
            const question: string = decodeURIComponent(req.params.question);
            const deleted: boolean = await this.faqService.deleteFaq(question);

            if (!deleted) {
                res.status(404).json({ message: "Geen FAQ gevonden" });

                return;
            }

            res.status(200).json({ message: "FAQ verwijderd" });
        }
        catch (error: unknown) {
            const message: string =
                error instanceof Error ? error.message : "Kan FAQ niet verwijderen";

            res.status(500).json({ message });
        }
    };
}
