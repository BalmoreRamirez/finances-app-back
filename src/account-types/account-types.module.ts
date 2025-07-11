import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountTypesService } from './account-types.service';
import { AccountTypesController } from './account-types.controller';
import { AccountType } from './entities/account-type.entity';
import { LoginModule } from '../login/login.module';

@Module({
  imports: [TypeOrmModule.forFeature([AccountType]), LoginModule],
  controllers: [AccountTypesController],
  providers: [AccountTypesService],
})
export class AccountTypesModule {}
