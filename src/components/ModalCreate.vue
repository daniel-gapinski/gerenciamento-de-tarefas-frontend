<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { setupAPIClient } from '@/utils/api';

interface CategoryProps {
  id: string;
  name: string;
}

const categories = ref<CategoryProps[]>([]);

const api = setupAPIClient();

const newTaskCreate = ref({
  title: '',
  description: '',
  category_id: '',
  status: '',
  priority: '',
});

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },

});

const emit = defineEmits(["update:isOpen"]);

const closeModal = () => {
  emit("update:isOpen", false);
  resetForm();
};

const resetForm = () => {
  newTaskCreate.value = {
    title: '',
    description: '',
    category_id: '' as string,
    status: '',
    priority: '',
  };
};

const fetchCategory = async () => {
  try {
    const response = await api.get("/list-categories");
    categories.value = response.data;
  } catch (err) {
    console.log(err)
  }
}

onMounted(fetchCategory);

const addNewTask = async () => {

  if (!newTaskCreate.value.title.trim() || !newTaskCreate.value.description.trim() || !newTaskCreate.value.category_id || !newTaskCreate.value.status || !newTaskCreate.value.priority) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  const taskData = {
    title: newTaskCreate.value.title,
    description: newTaskCreate.value.description,
    category_id: newTaskCreate.value.category_id,
    status: newTaskCreate.value.status,
    priority: newTaskCreate.value.priority,
  };

  try {
    const response = await api.post("/register-task", taskData);
    console.log(response);
    console.log("Tarefa add com sucesso!")
    closeModal();
  } catch (err) {
    console.error("Erro ao adicionar tarefa:", err);
  }
};

</script>

<template>
  <div v-if="isOpen" class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-base font-semibold text-gray-900" id="modal-title">Criar nova tarefa</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">Preencha as informações para criar uma nova tarefa</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-4 py-3 sm:px-6">
            <form>
              <div class="space-y-4">
                <div>
                  <label for="title" class="block text-sm font-medium text-gray-700">Título</label>
                  <input id="title" v-model="newTaskCreate.title" type="text" required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Título da tarefa" />
                </div>

                <div>
                  <label for="description" class="block text-sm font-medium text-gray-700">Descrição</label>
                  <textarea id="description" v-model="newTaskCreate.description" required rows="4"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Descrição da tarefa"></textarea>
                </div>

                <div>
                  <label for="category" class="block text-sm font-medium text-gray-700">Categoria</label>
                  <select id="category" v-model="newTaskCreate.category_id" required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm">
                    <option value="" disabled selected>Selecione uma categoria</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}
                    </option>
                  </select>

                </div>

                <div>
                  <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                  <select id="status" v-model="newTaskCreate.status" required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm">
                    <option value="" disabled selected>Selecione um status</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Em Progresso">Em Progresso</option>
                    <option value="Concluída">Concluída</option>
                  </select>
                </div>

                <div>
                  <label for="priority" class="block text-sm font-medium text-gray-700">Prioridade</label>
                  <select id="priority" v-model="newTaskCreate.priority" required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-indigo-500 sm:text-sm">
                    <option value="" disabled selected>Selecione a prioridade</option>
                    <option value="Alta">Alta</option>
                    <option value="Média">Média</option>
                    <option value="Baixa">Baixa</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button @click="addNewTask" type="button"
              class="cursor-pointer inline-flex w-full justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-purple-500 sm:ml-3 sm:w-auto">Confirmar</button>
            <button @click="closeModal" type="button"
              class="cursor-pointer mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
