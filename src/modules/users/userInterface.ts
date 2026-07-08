import { Role } from "../../../generated/prisma/enums"

export interface IUSER{
    name: string
    email:string
    password:string
    role :Extract<Role,"TENANT" | "LANDLORD">

}