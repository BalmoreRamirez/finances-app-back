import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const user = await this.usersService.findByEmail(loginDto.email);
      if (!user) {
        return { message: 'Usuario no encontrado' };
      }
      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      );
      if (!isPasswordValid) {
        return { message: 'Contraseña incorrecta' };
      }
      const payload = { sub: user.id, email: user.email };
      const token = this.jwtService.sign(payload);
      return { accessToken: token };
    } catch (e) {
      console.error('Error during login:', e);
      return { message: 'Error al iniciar sesión' };
    }
  }
}
