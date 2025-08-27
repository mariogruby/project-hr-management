import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
// import { User } from '../../auth/schemas/user.schema';

// Define un tipo para el documento con _id como Types.ObjectId
export type CompanyDocument = Company & Document<Types.ObjectId>;

@Schema({ timestamps: true })
export class Company {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId; // Cambiado de User a Types.ObjectId

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  employees: Types.ObjectId[]; // Cambiado de User[] a Types.ObjectId[]
}

export const CompanySchema = SchemaFactory.createForClass(Company);
