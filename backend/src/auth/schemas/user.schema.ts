import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Define un tipo para el documento con _id como Types.ObjectId
export type UserDocument = User & Document<Types.ObjectId>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: string;

  @Prop({ type: Types.ObjectId, ref: 'Company' }) // Cambiar a ObjectId con referencia a Company
  companyId?: Types.ObjectId; // Opcional
}

export const UserSchema = SchemaFactory.createForClass(User);
