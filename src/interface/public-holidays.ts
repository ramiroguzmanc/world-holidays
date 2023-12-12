export interface PublicHolidays {
    date:        string;
    localName:   string;
    name:        string;
    countryCode: string;
    fixed:       boolean;
    global:      boolean;
    counties:    string[] | null;
    launchYear:  number | null;
    types:       Type[];
}

export enum Type {
    Optional = "Optional",
    Public = "Public",
}
