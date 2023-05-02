export interface IUsers {
    id: number;
    displayName: string;
    roleName: string;
    email: string;
    address: Address;
}

export interface Address {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
}