import { Department } from "@api/models/Department";
import { IDepartmentInterface } from "@api/interfaces/IDepartmentInterface";
import { DepartmentRepository } from "@api/repositories/DepartmentRepository";

export class DepartmentService implements IDepartmentInterface {
    public constructor(private readonly repository: DepartmentRepository) {
    }

    public async getAllDepartments(): Promise<Department[]> {
        return this.repository.findAll();
    }

    public async getDepartmentByName(name: string): Promise<Department> {
        const department: Department | null =
            await this.repository.findByName(name);

        if (!department) {
            throw new Error(`Department '${name}' not found`);
        }

        return department;
    }

    public async createDepartment(dept: Department): Promise<Department> {
        if (!dept.name || dept.name.trim() === "") {
            throw new Error("Department name is required");
        }

        const existing: Department | null =
            await this.repository.findByName(dept.name);

        if (existing) {
            throw new Error(`Department '${dept.name}' already exists`);
        }

        return this.repository.create({
            ...dept,
            name: dept.name.trim(),
        });
    }

    public async updateDepartment(name: string, dept: Department): Promise<Department> {
        if (!dept.name || dept.name.trim() === "") {
            throw new Error("New department name is required");
        }

        const updated: Department | null =
            await this.repository.update(name, {
                ...dept,
                name: dept.name.trim(),
            });

        if (!updated) {
            throw new Error(`Department '${name}' not found`);
        }

        return updated;
    }

    public async deleteDepartment(name: string): Promise<boolean> {
        const deleted: boolean = await this.repository.delete(name);

        if (!deleted) {
            throw new Error(`Department '${name}' not found`);
        }

        return true;
    }
}
