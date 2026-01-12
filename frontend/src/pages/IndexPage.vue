<template>
  <q-page class="row items-start justify-center q-pa-md">
    <div class="col-12 text-center q-mb-lg">
      <h1 class="text-h4">Cardápio do Dia</h1>
    </div>

    <div v-if="loading">Carregando delícias...</div>

    <div v-else class="row q-gutter-md justify-center">
      <product-card v-for="item in products" :key="item._id" :product="item" @buy="placeOrder" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import type { Product } from 'src/types';
import ProductCard from 'src/components/ProductCard.vue';

const products = ref<Product[]>([]);
const loading = ref(true);
const placeOrder = async (product: Product) => {
  try {
    console.log('Comprando:', product.name);
    // Envia apenas o nome para simplificar
    await api.post('http://localhost:3000/orders', {
      productName: product.name,
      price: product.price,
    });
    alert('Pedido realizado! Verifique o console do Backend.');
  } catch (error) {
    console.error('Erro na compra:', error);
  }
};
const fetchProducts = async () => {
  try {
    // Faz a chamada para o Backend
    const response = await api.get('http://localhost:3000/products');
    products.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  } finally {
    loading.value = false;
  }
};

// Lifecycle Hook: Executa assim que a tela monta
onMounted(() => {
  void fetchProducts();
});
</script>
