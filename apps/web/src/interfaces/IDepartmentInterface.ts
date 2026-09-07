import { Department } from "@web/Models/Department";

export interface IDepartmentInterface {
    getAllDepartments(): Promise<Department[]>;
}
