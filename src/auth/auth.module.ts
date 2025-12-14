import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthGuard } from './guard';

@Module({
  imports: [UserModule],
  providers: [AuthService, AuthGuard],
  exports: [AuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}