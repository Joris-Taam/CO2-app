import { RowDataPacket, ResultSetHeader, PoolConnection } from "mysql2/promise";
import { Faq } from "@api/models/Faq";
import { DatabaseService } from "@api/services/DatabaseService";
import { IFaqInterface } from "@api/interfaces/IFaqInterface";

interface FaqRow extends RowDataPacket {
    question: string;
    description: string | null;
    categoryName: string;
}

export class FaqRepository implements IFaqInterface {
    public constructor(private readonly db: DatabaseService) {
    }

    // Fetch all FAQs
    public async findAll(): Promise<Faq[]> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            const [rows] = await connection.query<FaqRow[]>(
                `SELECT 
                    question, 
                    description, 
                    FAQ_categories_name AS categoryName 
                 FROM faq`
            );

            return rows.map((row: FaqRow) => ({
                question: row.question,
                description: row.description,
                categoryName: row.categoryName,
            }));
        }
        finally {
            connection.release();
        }
    }

    // Fetch one FAQ by question
    public async findByQuestion(question: string): Promise<Faq | null> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            const [rows] = await connection.query<FaqRow[]>(
                `SELECT 
                    question, 
                    description, 
                    FAQ_categories_name AS categoryName 
                 FROM faq 
                 WHERE question = ?`,
                [question]
            );

            if (rows.length === 0) {
                return null;
            }

            const row: FaqRow = rows[0];

            return {
                question: row.question,
                description: row.description,
                categoryName: row.categoryName,
            };
        }
        finally {
            connection.release();
        }
    }

    // Create new FAQ
    public async create(faq: Faq): Promise<Faq> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            await connection.query<ResultSetHeader>(
                "INSERT INTO faq (question, description, FAQ_categories_name) VALUES (?, ?, ?)",
                [faq.question, faq.description, faq.categoryName]
            );

            return faq;
        }
        finally {
            connection.release();
        }
    }

    // Update FAQ
    public async update(originalQuestion: string, faq: Faq): Promise<boolean> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            const [result] = await connection.query<ResultSetHeader>(
                `UPDATE faq 
                 SET question = ?, description = ?, FAQ_categories_name = ? 
                 WHERE question = ?`,
                [faq.question, faq.description, faq.categoryName, originalQuestion]
            );

            return result.affectedRows > 0;
        }
        finally {
            connection.release();
        }
    }

    // Delete FAQ
    public async delete(question: string): Promise<boolean> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            const [result] = await connection.query<ResultSetHeader>(
                "DELETE FROM faq WHERE question = ?",
                [question]
            );

            return result.affectedRows > 0;
        }
        finally {
            connection.release();
        }
    }
}
