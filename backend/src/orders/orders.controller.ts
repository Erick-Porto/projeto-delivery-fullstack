import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject('ORDER_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post()
  placeOrder(@Body() orderData: CreateOrderDto) {
    console.log('1. HTTP: Enviando para a fila...');
    this.client.emit('order_created', orderData);
    return { message: 'Processando...' };
  }

  @EventPattern('order_created')
  async handleOrderCreated(@Payload() data: CreateOrderDto) {
    console.log('2. RABBIT: Recebi da fila. Gravando no banco...');

    const savedOrder = await this.ordersService.create(data);

    console.log(`3. SUCESSO: Pedido salvo com ID:`, savedOrder);
  }

  @UseGuards(AuthGuard('jwt')) // <--- O Cadeado Mágico
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    console.log(`Atualizando pedido ${id} para ${status}`);
    return this.ordersService.updateStatus(id, status);
  }
}
