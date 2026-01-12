<template>
  <q-card class="product-card">
    <q-card-section>
      <div class="text-h6">{{ product.name }}</div>
      <div class="text-subtitle2 text-grey">R$ {{ product.price.toFixed(2) }}</div>
    </q-card-section>

    <q-card-section>
      {{ product.description }}
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn flat color="primary" label="Adicionar" @click="handleBuy" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import type { Product } from 'src/types';
import { useCartStore } from 'src/stores/cart-store';

const props = defineProps<{
  product: Product;
}>();

const cartStore = useCartStore();

const handleBuy = () => {
  cartStore.addToCart(props.product);
  console.log('Adicionado ao carrinho. Total:', cartStore.totalItems);
};
</script>

<style lang="scss" scoped>
.product-card {
  width: 100%;
  max-width: 250px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow:
      0 10px 20px rgba(0, 0, 0, 0.19),
      0 6px 6px rgba(0, 0, 0, 0.23);

    .text-h6 {
      color: $primary;
    }
  }
}
</style>
