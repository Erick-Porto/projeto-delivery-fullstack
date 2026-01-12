import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Product } from 'src/types';

export const useCartStore = defineStore('cart', () => {
  const items = ref<Product[]>([]);

  const totalItems = computed(() => items.value.length);

  const totalPrice = computed(() => items.value.reduce((sum, item) => sum + item.price, 0));

  function addToCart(product: Product) {
    items.value.push(product);
  }

  function clearCart() {
    items.value = [];
  }

  return { items, totalItems, totalPrice, addToCart, clearCart };
});
