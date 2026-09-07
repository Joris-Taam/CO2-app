import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { IRoleRepository } from "@api/interfaces/IRoleInterface";
import { Role } from "@api/models/Role";
import { DatabaseService } from "@api/services/DatabaseService";

export class RoleRepository implements IRoleRepository {
    public constructor(private readonly db: DatabaseService) {
    }

    public async findAll(): Promise<Role[]> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            const [rows] = await connection.query<RowDataPacket[]>(
                "SELECT name, description FROM role"
            );

            return rows.map((row: RowDataPacket) => new Role(
                row["name"] as string,
                row["description"] as string | null
            ));
        }
        finally {
            connection.release();
        }
    }

    public async findByName(name: string): Promise<Role | null> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            const [rows] = await connection.query<RowDataPacket[]>(
                "SELECT name, description FROM role WHERE name = ?",
                [name]
            );

            if (rows.length === 0) {
                return null;
            }

            const row: RowDataPacket = rows[0];

            return new Role(
                row["name"] as string,
                row["description"] as string | null
            );
        }
        finally {
            connection.release();
        }
    }

    public async create(name: string, description: string | null): Promise<Role> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            await connection.query<ResultSetHeader>(
                "INSERT INTO role (name, description) VALUES (?, ?)",
                [name, description]
            );

            return new Role(name, description);
        }
        finally {
            connection.release();
        }
    }

    public async update(oldName: string, newName: string, description: string | null): Promise<Role | null> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            const [result] = await connection.query<ResultSetHeader>(
                "UPDATE role SET name = ?, description = ? WHERE name = ?",
                [newName, description, oldName]
            );

            if (result.affectedRows === 0) {
                return null;
            }

            return new Role(newName, description);
        }
        finally {
            connection.release();
        }
    }

    public async delete(name: string): Promise<boolean> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            const [result] = await connection.query<ResultSetHeader>(
                "DELETE FROM role WHERE name = ?",
                [name]
            );

            return result.affectedRows > 0;
        }
        finally {
            connection.release();
        }
    }
}
