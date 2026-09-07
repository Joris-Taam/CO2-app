export class Reservation {
    private _users_email: string;
    private _vehicles_number_plate: string;
    private _leaseType: "short-term" | "long-term";
    private _start_date: Date;
    private _end_date: Date;
    private _created_at: Date;

    public constructor(
        users_email: string,
        vehicles_number_plate: string,
        lease_type: "short-term" | "long-term",
        start_date: Date,
        end_date: Date,
        created_at: Date
    ) {
        this._users_email = users_email;
        this._vehicles_number_plate = vehicles_number_plate;
        this._leaseType = lease_type;
        this._start_date = start_date;
        this._end_date = end_date;
        this._created_at = created_at;
    }

    public get lease_type(): "short-term" | "long-term" {
        return this._leaseType;
    }

    public get users_email(): string {
        return this._users_email;
    }

    public get vehicles_number_plate(): string {
        return this._vehicles_number_plate;
    }

    public get start_date(): Date {
        return this._start_date;
    }

    public get end_date(): Date {
        return this._end_date;
    }

    public get created_at(): Date {
        return this._created_at;
    }

    public toJSON(): object {
        return {
            users_email: this._users_email,
            vehicles_number_plate: this._vehicles_number_plate,
            lease_type: this._leaseType,
            start_date: this._start_date,
            end_date: this._end_date,
            created_at: this._created_at,
        };
    }
}
