import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Roles } from 'src/utils/common/users-role.enum';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async accessToken(user: string, id: number, role: Roles[]) {
    return await this.jwtService.signAsync({ email: user, id: id, role: role });
  }
}
