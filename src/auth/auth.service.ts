import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserSignInDto } from 'src/Users/dto/user-signin.dto';
import { UserEntity } from 'src/Users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}


    async accessToken(user: string, id: number) {
        return await this.jwtService.signAsync({ email: user, id: id});
    }
}
