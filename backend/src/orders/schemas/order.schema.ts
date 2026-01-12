import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  total: number;

  @Prop({ default: 'Pendente' })
  status: string;

  @Prop([
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ])
  items: Record<string, any>[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
