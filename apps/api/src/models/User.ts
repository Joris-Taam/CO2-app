import { Entity, PrimaryColumn, Column } from "typeorm";
import { Role } from "@api/../../shared/enums";

/**
 * Represents a user in the application.
 */
export interface User {
    /** Email address of the user */
    email: string | null;

    /** Full name of the user */
    name: string;

    /** Password of the user, empty string when omitted */
    password?: string;

    /** Department the user belongs to */
    department_name: string | null;

    /** Role assigned to the user */
    role_name: Role | null;

    /** Street address of the user's location */
    location_address: string;

    /** City of the user's location */
    location_city: string;

    /** Work schedule of the user */
    schedule: string;
}

/**
 * ORM entity representing the users table in the database.
 */
@Entity({ name: "users" })
export class UserORM {
    /** Email address of the user, used as primary key */
    @PrimaryColumn({ type: "varchar" })
    public email!: string;

    /** Full name of the user */
    @Column({ type: "varchar" })
    public name!: string;

    /** Hashed password of the user */
    @Column({ type: "varchar", select: false })
    public password!: string;

    /** Department the user belongs to */
    @Column({ type: "varchar", nullable: true })
    public department_name!: string | null;

    /** Role assigned to the user */
    @Column({ type: "varchar", nullable: true })
    public role_name!: Role | null;

    /** Street address of the user's location */
    @Column({ type: "varchar" })
    public location_address!: string;

    /** City of the user's location */
    @Column({ type: "varchar" })
    public location_city!: string;

    /** Work schedule of the user */
    @Column({ type: "varchar" })
    public schedule!: string;
}
