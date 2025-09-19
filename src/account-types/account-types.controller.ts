import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AccountTypesService } from './account-types.service';
import { CreateAccountTypeDto } from './dto/create-account-type.dto';
import { UpdateAccountTypeDto } from './dto/update-account-type.dto';
import { JwtAuthGuard } from '../login/jwt-auth.guard';

@ApiTags('account-types')
@Controller('account-types')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AccountTypesController {
  constructor(private readonly accountTypesService: AccountTypesService) {}

  @Post()
  create(@Body() createAccountTypeDto: CreateAccountTypeDto) {
    return this.accountTypesService.create(createAccountTypeDto);
  }

  @Get()
  findAll() {
    return this.accountTypesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.accountTypesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateAccountTypeDto: UpdateAccountTypeDto,
  ) {
    return this.accountTypesService.update(+id, updateAccountTypeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.accountTypesService.remove(+id);
  }
}
