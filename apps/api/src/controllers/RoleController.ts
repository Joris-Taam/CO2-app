import { Request, Response } from "express";
import { RoleService } from "@api/services/RoleService";
import { Role } from "@api/models/Role";

export class RoleController {
    public constructor(private readonly roleService: RoleService) {
    }

    public getAll = async (_req: Request, res: Response): Promise<void> => {
        try {
            const roles: Role[] = await this.roleService.getAllRoles();

            res.status(200).json(roles);
        }
        catch (error: unknown) {
            const message: string =
                error instanceof Error ? error.message : "Failed to fetch roles";

            res.status(500).json({ message });
        }
    };

    public getByName = async (
        req: Request<{ name: string }>,
        res: Response
    ): Promise<void> => {
        try {
            const role: Role = await this.roleService.getRoleByName(req.params.name);

            res.status(200).json(role);
        }
        catch (error: unknown) {
            const message: string =
                error instanceof Error ? error.message : "Failed to fetch role";
            const status: number =
                error instanceof Error && error.message.includes("not found") ? 404 : 500;

            res.status(status).json({ message });
        }
    };

    public create = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, description } = req.body as { name: string; description?: string | null };
            const role: Role = await this.roleService.createRole(name, description ?? null);

            res.status(201).json(role);
        }
        catch (error: unknown) {
            const message: string =
                error instanceof Error ? error.message : "Failed to create role";
            const status: number =
                error instanceof Error && error.message.includes("already exists") ? 409 : 400;

            res.status(status).json({ message });
        }
    };

    public update = async (
        req: Request<{ name: string }>,
        res: Response
    ): Promise<void> => {
        try {
            const { name } = req.params;
            const { name: newName, description } = req.body as { name: string; description?: string | null };
            const role: Role = await this.roleService.updateRole(name, newName, description ?? null);

            res.status(200).json(role);
        }
        catch (error: unknown) {
            const message: string =
                error instanceof Error ? error.message : "Failed to update role";
            const status: number =
                error instanceof Error && error.message.includes("not found") ? 404 : 400;

            res.status(status).json({ message });
        }
    };

    public delete = async (
        req: Request<{ name: string }>,
        res: Response
    ): Promise<void> => {
        try {
            await this.roleService.deleteRole(req.params.name);
            res.status(204).send();
        }
        catch (error: unknown) {
            const message: string =
                error instanceof Error ? error.message : "Failed to delete role";
            const status: number =
                error instanceof Error && error.message.includes("not found") ? 404 : 500;

            res.status(status).json({ message });
        }
    };
}
