export interface User {
    name: string;
    email: string | null;
    password: string;
    department_name: string | null;
    role_name: string | null;
    location_address: string;
    location_city: string;
    schedule: string;
}
