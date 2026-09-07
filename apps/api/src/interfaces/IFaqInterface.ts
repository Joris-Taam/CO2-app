import { Faq } from "@api/models/Faq";

@Interface
export abstract class IFaqInterface {
    public abstract findAll(): Promise<Faq[]>;
    public abstract findByQuestion(question: string): Promise<Faq | null>;
    public abstract create(faq: Faq): Promise<Faq>;
    public abstract update(question: string, faq: Faq): Promise<boolean>;
    public abstract delete(question: string): Promise<boolean>;
}
