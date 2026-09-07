import { Entity, PrimaryColumn, Column } from "typeorm";

/**
 * Represents a contact message in the application.
 */
export interface Contact {
    /** Email address of the user */
    email: string;

    /** The contact message content */
    description: string;

    /** The name of the user */
    name: string;

    /** The timestamp when the contact message was sent */
    created_at: Date;
}

/**
 * ORM entity representing the contact table in the database.
 */
@Entity({ name: "contact" })
export class ContactORM {
    /** The timestamp when the contact message was sent, used as primary key */
    @PrimaryColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    public created_at!: Date;

    /** Email address of the user */
    @Column({ type: "varchar" })
    public email!: string;

    /** The contact message content */
    @Column({ type: "varchar" })
    public description!: string;

    /** The name of the user */
    @Column({ type: "varchar" })
    public name!: string;
}
