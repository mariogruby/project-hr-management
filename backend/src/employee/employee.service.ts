import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { Company, CompanyDocument } from '../company/schemas/company.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    private authService: AuthService,
  ) {}

  async createEmployee(
    dto: CreateEmployeeDto,
    adminId: string,
  ): Promise<UserDocument> {
    const { email, password, companyId } = dto;

    const admin = await this.authService.validateUser(adminId);
    if (!admin || admin.role !== 'admin') {
      throw new UnauthorizedException('Only admins can create employees');
    }

    // Check if the company exists
    const company = await this.companyModel.findById(companyId);
    if (!company) {
      throw new BadRequestException('Company not found');
    }

    // Check if the email is already in use
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the employee user
    const newEmployee = new this.userModel({
      email,
      password: hashedPassword,
      role: 'employee',
      companyId: new Types.ObjectId(companyId),
    });

    await newEmployee.save();

    await this.companyModel.findByIdAndUpdate(
      companyId,
      { $push: { employees: newEmployee._id } },
      { new: true },
    );

    return newEmployee;
  }
}
