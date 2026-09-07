export class Role {
    public name: string;
    public description: string | null;

    public constructor(name: string, description: string | null) {
        this.name = name;
        this.description = description;
    }
}
