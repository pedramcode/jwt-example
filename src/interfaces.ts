export interface IUser {
    username: string,
    password: string,
    email: string,
    firstname?: string,
    lastname?: string,
}

export interface ILoginRequest {
    username: string,
    password: string,
}