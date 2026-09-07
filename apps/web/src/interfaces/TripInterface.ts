export type SoortRit = "zakelijk" | "prive" | "woon-werk";
export type SoortVoertuig = "auto" | "motor" | "fiets";
export type Brandstof = "benzine" | "diesel" | "elektrisch" | "hybride";

export interface Rit {
    userEmail: string;
    createdAt: string;
    adres1: string;
    adres2: string;
    kilometers: number;
    soortRit: SoortRit;
    soortVoertuig: SoortVoertuig;
    brandstof: Brandstof;
}

export type RitInput = Omit<Rit, "userEmail">;
