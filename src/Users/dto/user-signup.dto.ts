import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"
import { UserSignInDto } from "./user-signin.dto"

export class UserSignupDto extends UserSignInDto {
    @IsString()
    @IsNotEmpty({message: "Name is required"})
    name: string
}