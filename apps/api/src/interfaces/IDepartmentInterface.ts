import { Department } from "@api/models/Department";

export interface IDepartmentInterface {
    getAllDepartments(): Promise<Department[]>;
    getDepartmentByName(name: string): Promise<Department>;
    createDepartment(dept: Department): Promise<Department>;
    updateDepartment(name: string, dept: Department): Promise<Department>;
    deleteDepartment(name: string): Promise<boolean>;
}
