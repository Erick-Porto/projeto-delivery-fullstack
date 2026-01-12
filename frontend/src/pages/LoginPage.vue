<template>
  <div
    class="window-height window-width row justify-center items-center"
    style="background: linear-gradient(#8274c5, #5a4a9f)"
  >
    <div class="column q-pa-lg">
      <div class="row">
        <q-card square class="shadow-24" style="width: 300px; height: 485px">
          <q-card-section class="bg-deep-purple-7">
            <h4 class="text-h5 text-white q-my-md">Login Delivery</h4>
          </q-card-section>

          <q-card-section>
            <q-form class="q-px-sm q-pt-xl">
              <q-input square clearable v-model="username" type="text" label="Usuário">
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>

              <q-input
                square
                clearable
                v-model="password"
                type="password"
                label="Senha"
                class="q-mt-md"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
            </q-form>
          </q-card-section>

          <q-card-actions class="q-px-lg">
            <q-btn
              unelevated
              size="lg"
              color="deep-purple-4"
              class="full-width text-white"
              label="Entrar"
              @click="handleLogin"
            />
          </q-card-actions>

          <q-card-section class="text-center q-pa-sm">
            <p class="text-grey-6">Dica: admin / 123456</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from 'stores/auth-store';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const password = ref('');

const handleLogin = async () => {
  try {
    await authStore.login(username.value, password.value);
    $q.notify({ type: 'positive', message: 'Bem-vindo Chef!' });

    await router.push('/admin');
  } catch (error) {
    console.error('Falha no login:', error);
    $q.notify({ type: 'negative', message: 'Senha incorreta' });
  }
};
</script>
