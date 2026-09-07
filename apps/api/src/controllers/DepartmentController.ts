import { Request, Response } from "express";
import { DepartmentService } from "@api/services/DepartmentService";
import { Department } from "@api/models/Department";

export class DepartmentController {
    public constructor(private readonly departmentService: DepartmentService) {
    }

    public getAll = async (_req: Request, res: Response): Promise<void> => {
        try {
            const departments: Department[] = await this.departmentService.getAllDepartments();

            res.json(departments);
        }
        catch {
            res.status(500).json({ message: "Failed to retrieve departments" });
        }
    };

    public getByName = async (req: Request, res: Response): Promise<void> => {
        try {
            const name: string = String(req.params.name);
            const department: Department = await this.departmentService.getDepartmentByName(name);

            res.json(department);
        }
        catch {
            res.status(404).json({ message: "Department not found" });
        }
    };

    public create = async (req: Request, res: Response): Promise<void> => {
        try {
            const department: Department = req.body as Department;

            await this.departmentService.createDepartment(department);

            res.status(201).json({ message: "Department created" });
        }
        catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create department" });
        }
    };

    public update = async (req: Request, res: Response): Promise<void> => {
        try {
            const name: string = String(req.params.name);
            const department: Department = req.body as Department;

            await this.departmentService.updateDepartment(name, department);

            res.json({ message: "Department updated" });
        }
        catch (error) {
            res.status(404).json({ message: error instanceof Error ? error.message : "Failed to update department" });
        }
    };

    public delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const name: string = String(req.params.name);

            await this.departmentService.deleteDepartment(name);

            res.json({ message: "Department deleted" });
        }
        catch (error) {
            res.status(404).json({ message: error instanceof Error ? error.message : "Failed to delete department" });
        }
    };
}
