export interface Reservation {
    users_email: string;
    vehicles_number_plate: string;
    lease_type: string;
    start_date: Date;
    end_date: Date;
    created_at: Date;
}
