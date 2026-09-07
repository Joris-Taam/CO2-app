import "reflect-metadata";
import { DataSource, ObjectLiteral, Repository } from "typeorm";
import { UserORM } from "@api/models/User";
import { TripORM } from "@api/models/Trip";
import { ContactORM } from "@api/models/Contact";

/**
 * Service that provides a TypeORM DataSource and repository access.
 * Implemented as a Singleton to ensure only one DataSource exists.
 */
export class ORMService {
    private static _instance: ORMService | undefined;
    private _dataSource: DataSource | undefined;

    /**
     * Private constructor to prevent direct instantiation.
     */
    private constructor() {
    }

    /**
     * Returns the single shared instance of ORMService.
     *
     * @returns The singleton ORMService instance
     */
    public static getInstance(): ORMService {
        if (!ORMService._instance) {
            ORMService._instance = new ORMService();
        }

        return ORMService._instance;
    }

    /**
     * Returns the DataSource, creating it lazily so environment variables are loaded first.
     *
     * @returns The TypeORM DataSource instance
     */
    private getDataSource(): DataSource {
        if (!this._dataSource) {
            this._dataSource = new DataSource({
                type: "mysql",
                host: process.env.DB_HOST,
                port: Number.parseInt(process.env.DB_PORT),
                database: process.env.DB_DATABASE,
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                synchronize: false,
                entities: [UserORM, TripORM, ContactORM],
            });
        }

        return this._dataSource;
    }

    /**
     * Initializes the DataSource connection.
     *
     * @returns Promise that resolves when the connection is established
     */
    public async initialize(): Promise<void> {
        await this.getDataSource().initialize();
    }

    /**
     * Returns a TypeORM repository for the given entity.
     *
     * @param entity - The entity class to get the repository for
     * @returns Repository for the given entity
     */
    public getRepository<T extends ObjectLiteral>(entity: new () => T): Repository<T> {
        return this.getDataSource().getRepository(entity);
    }
}
