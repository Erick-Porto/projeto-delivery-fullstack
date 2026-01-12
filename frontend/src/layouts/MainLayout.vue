<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> Delivery App </q-toolbar-title>

        <q-btn flat round icon="shopping_cart" @click="toggleRightDrawer">
          <q-badge color="red" floating v-if="cartStore.totalItems > 0">
            {{ cartStore.totalItems }}
          </q-badge>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-drawer v-model="rightDrawerOpen" side="right" overlay bordered>
      <div class="column full-height">
        <q-toolbar>
          <q-toolbar-title>Seu Pedido</q-toolbar-title>
          <q-btn flat round dense icon="close" @click="toggleRightDrawer" />
        </q-toolbar>

        <q-separator />

        <q-scroll-area class="col q-pa-md">
          <div v-if="cartStore.totalItems === 0" class="text-grey text-center q-mt-xl">
            Seu carrinho está vazio :(
          </div>

          <q-list separator v-else>
            <q-item v-for="(item, index) in cartStore.items" :key="index">
              <q-item-section>
                <q-item-label>{{ item.name }}</q-item-label>
                <q-item-label caption>R$ {{ item.price.toFixed(2) }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <div class="q-pa-md bg-grey-2">
          <div class="row justify-between text-h6 q-mb-md">
            <span>Total:</span>
            <span class="text-primary">R$ {{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
          <q-btn
            color="green-7"
            class="full-width"
            label="Finalizar Pedido"
            :disable="cartStore.totalItems === 0"
            @click="checkout"
          />
        </div>
      </div>
    </q-drawer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from 'src/stores/cart-store';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const cartStore = useCartStore();
const rightDrawerOpen = ref(false);

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}

async function checkout() {
  if (cartStore.totalItems === 0) return;

  try {
    const orderPayload = {
      customerName: 'Cliente Teste', // Hardcoded por enquanto
      items: cartStore.items,
      total: cartStore.totalPrice,
    };

    await api.post('http://localhost:3000/orders', orderPayload);

    // Sucesso
    $q.notify({ type: 'positive', message: 'Pedido enviado para a cozinha!' });
    cartStore.clearCart(); // Limpa o carrinho
    rightDrawerOpen.value = false; // Fecha a gaveta
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Erro ao processar pedido' });
    console.error(error);
  }
}
</script>
