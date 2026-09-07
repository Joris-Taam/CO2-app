import { Department } from "../Models/Department";
import { IDepartmentInterface } from "../interfaces/IDepartmentInterface";
import { DepartmentRepository } from "../repositories/DepartmentRepository";

export class DepartmentService implements IDepartmentInterface {
    private readonly repository: DepartmentRepository;

    public constructor(repository?: DepartmentRepository) {
        this.repository = repository ?? new DepartmentRepository();
    }

    public async getAllDepartments(): Promise<Department[]> {
        return this.repository.findAll();
    }
}
