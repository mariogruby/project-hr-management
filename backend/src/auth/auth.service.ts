import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ token: string }> {
    const { email, password, role } = registerDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    const token = this.jwtService.sign({
      userId: newUser._id,
      role: newUser.role,
    });
    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ userId: user._id, role: user.role });
    return { token };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
