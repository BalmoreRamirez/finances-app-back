import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { Account } from './entities/account.entity';
import { AccountType } from '../account-types/entities/account-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, AccountType])],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
