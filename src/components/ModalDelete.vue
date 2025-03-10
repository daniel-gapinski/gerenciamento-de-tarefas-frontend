<script setup lang="ts">

import { setupAPIClient } from '@/utils/api';
import { ref } from 'vue';

const api = setupAPIClient();

interface CategoryProps {
  id: string;
  name: string;
}

const categories = ref<CategoryProps[]>([]);

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  id: {
    type: [String, null],
    required: true,
  },
  onConfirm: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits(["update:isOpen", "updateTasks"]);


const closeModal = () => {
  emit("update:isOpen", false);
};

const fetchTasks = async () => {
  try {
    const response = await api.get("/list-tasks");
    categories.value = response.data;
  } catch (err) {
  }
}

const confirmAction = async () => {
  try {
    const response = await api.delete(`/delete-task?id=${props.id}`);
    props.onConfirm(props.id);
    emit("updateTasks");
    await fetchTasks();
    closeModal();
  } catch (error) {
  }
};

</script>

<template>
  <div v-if="isOpen" class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                <svg class="size-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" aria-hidden="true" data-slot="icon">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-base font-semibold text-gray-900" id="modal-title">Finalizar Tarefa</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">Deseja finalizar esta tarefa? A ação realizada não pode ser desfeita!</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button @click="confirmAction" type="button"
              class="cursor-pointer inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto">Confirmar</button>
            <button @click="closeModal" type="button"
              class="cursor-pointer mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
