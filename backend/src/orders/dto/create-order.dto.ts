export class CreateOrderDto {
  customerName: string;
  items: Array<{
    name: string;
    price: number;
  }>;
  total: number;
}
