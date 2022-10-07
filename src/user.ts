
import { IUser } from "./interfaces"



class User implements IUser {
    username: string
    password: string
    email: string
    firstname?: string
    lastname?: string

    constructor(user: IUser){
        this.username = user.username
        this.password = user.password
        this.email = user.email
        this.firstname = user.firstname
        this.lastname = user.lastname
    }
}

export default User
