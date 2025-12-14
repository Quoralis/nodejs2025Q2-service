import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refreshTokenDto';
import { SignUpDto } from './dto/singUpDto';
import { SignInDto } from './dto/singInDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto.login, dto.password);
  }

  @Post('signup')
  @HttpCode(201)
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto.login, dto.password);
  }

  @Post('refresh')
  @HttpCode(200)
  refresh(@Body() dto: RefreshTokenDto) {
    if (!dto?.refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.refresh(dto.refreshToken);
  }
}
