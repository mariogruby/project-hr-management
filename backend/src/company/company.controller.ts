import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async createCompany(
    @Body() createCompanyDto: CreateCompanyDto,
    @Req() req: { user: { _id: string } },
  ) {
    return this.companyService.createCompany(
      createCompanyDto,
      req.user._id.toString(),
    );
  }
}
