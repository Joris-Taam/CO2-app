import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { Department } from "@api/models/Department";
import { DatabaseService } from "@api/services/DatabaseService";

export class DepartmentRepository {
    public constructor(private readonly db: DatabaseService) {
    }

    public async findAll(): Promise<Department[]> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            const [rows] = await connection.query(
                "SELECT name, location_address, location_city FROM department"
            );

            return rows as Department[];
        }
        finally {
            connection.release();
        }
    }

    public async findByName(name: string): Promise<Department | null> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            const [rows] = await connection.query(
                `SELECT name, location_address, location_city
                 FROM department
                 WHERE name = ?`,
                [name]
            );

            const departments: Department[] = rows as Department[];

            if (departments.length === 0) {
                return null;
            }

            return departments[0];
        }
        finally {
            connection.release();
        }
    }

    public async create(department: Department): Promise<Department> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            await connection.query<ResultSetHeader>(
                `INSERT INTO department (name, location_address, location_city)
                 VALUES (?, ?, ?)`,
                [department.name, department.location_address, department.location_city]
            );

            return department;
        }
        finally {
            connection.release();
        }
    }

    public async update(name: string, department: Department): Promise<Department | null> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            const [result] = await connection.query<ResultSetHeader>(
                `UPDATE department
                 SET location_address = ?, location_city = ?
                 WHERE name = ?`,
                [department.location_address, department.location_city, name]
            );

            if (result.affectedRows === 0) {
                return null;
            }

            return {
                name,
                location_address: department.location_address,
                location_city: department.location_city,
            };
        }
        finally {
            connection.release();
        }
    }

    public async delete(name: string): Promise<boolean> {
        const connection: PoolConnection = await this.db.openConnection();

        try {
            const [result] = await connection.query<ResultSetHeader>(
                "DELETE FROM department WHERE name = ?",
                [name]
            );

            return result.affectedRows > 0;
        }
        finally {
            connection.release();
        }
    }
}
