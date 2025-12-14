import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/singUpDto';
import { SignUpDto } from './dto/singInDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto.login, dto.password);
  }
  @Post('signup')
  @HttpCode(201)
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto.login, dto.password);
  }
}
