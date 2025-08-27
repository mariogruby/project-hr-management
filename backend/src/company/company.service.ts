import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { AuthService } from '../auth/auth.service';
import { Types } from 'mongoose';
// import { User } from '../auth/schemas/user.schema';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    private authService: AuthService,
  ) {}

  async createCompany(dto: CreateCompanyDto, userId: string): Promise<Company> {
    const user = await this.authService.validateUser(userId);
    if (!user || user.role !== 'admin') {
      throw new UnauthorizedException('Only admins can create companies');
    }

    const existingCompany = await this.companyModel.findOne({ name: dto.name });
    if (existingCompany) {
      throw new BadRequestException('Company name already exists');
    }

    const company = await this.companyModel.create({
      ...dto,
      createdBy: new Types.ObjectId(userId),
      employees: [],
    });

    await this.authService.updateUserCompany(userId, company._id);

    return company;
  }
}
