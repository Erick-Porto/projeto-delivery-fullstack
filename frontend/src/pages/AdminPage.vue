<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <h1 class="text-h4 no-margin">Painel de Pedidos</h1>
      <q-space />
      <q-btn icon="refresh" round flat @click="fetchOrders" />
    </div>

    <q-table :rows="orders" :columns="columns" row-key="_id" :loading="loading">
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <div :class="['status-badge', getStatusClass(props.value)]">
            {{ props.value }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn-dropdown size="sm" color="primary" label="Mudar Status">
            <q-list>
              <q-item clickable v-close-popup @click="changeStatus(props.row._id, 'Em Preparo')">
                <q-item-section>👨‍🍳 Em Preparo</q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                @click="changeStatus(props.row._id, 'Saiu para Entrega')"
              >
                <q-item-section>🛵 Saiu para Entrega</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="changeStatus(props.row._id, 'Entregue')">
                <q-item-section>✅ Entregue</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import { useQuasar, type QTableColumn } from 'quasar';

const $q = useQuasar();
const orders = ref([]);
const loading = ref(false);

const columns: QTableColumn[] = [
  { name: 'customer', label: 'Cliente', field: 'customerName', align: 'left' },
  { name: 'total', label: 'Total (R$)', field: 'total', format: (val: number) => val.toFixed(2) },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  {
    name: 'date',
    label: 'Data',
    field: 'createdAt',
    format: (val: string) => new Date(val).toLocaleString(),
  },
  { name: 'actions', label: 'Ações', field: 'actions' },
];

const fetchOrders = async () => {
  loading.value = true;
  try {
    const response = await api.get('http://localhost:3000/orders');
    orders.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const changeStatus = async (id: string, newStatus: string) => {
  try {
    await api.patch(`http://localhost:3000/orders/${id}/status`, { status: newStatus });
    $q.notify({ type: 'positive', message: 'Status atualizado!' });

    await fetchOrders();
  } catch (error) {
    console.error('Erro ao mudar status:', error);
    $q.notify({ type: 'negative', message: 'Erro ao atualizar' });
  }
};

const getStatusClass = (status: string) => {
  if (status === 'Pendente') return 'status-pending';
  if (status === 'Em Preparo') return 'status-cooking';
  if (status === 'Saiu para Entrega') return 'status-delivery';
  if (status === 'Entregue') return 'status-done';
  return '';
};

onMounted(() => {
  void fetchOrders();
});
</script>

<style lang="scss" scoped>
.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 0.85rem;
  display: inline-block;
  color: white;

  &.status-pending {
    background-color: #f39c12;
  }

  &.status-cooking {
    background-color: #3498db;
    animation: pulse 2s infinite;
  }

  &.status-delivery {
    background-color: #9b59b6;
  }

  &.status-done {
    background-color: #27ae60;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>
