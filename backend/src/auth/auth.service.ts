import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(username: string, pass: string): Promise<any> {
    if (username !== 'admin' || pass !== '123456') {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const payload = { sub: 1, username: username, role: 'admin' };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
