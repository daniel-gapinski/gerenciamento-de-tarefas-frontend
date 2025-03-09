<script setup lang="ts">
import Container from '@/components/Container.vue';
import ModalCategory from '@/components/ModalCategory.vue';
import ModalCreate from '@/components/ModalCreate.vue';
import ModalDelete from '@/components/ModalDelete.vue';
import ModalEdit from '@/components/ModalEdit.vue';
import Sidebar from '@/components/Sidebar.vue';
import { setupAPIClient } from '@/utils/api';
import { formatDate } from '@/utils/functions';
import { onMounted, ref, watchEffect } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

interface TaskProps {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  Comments: {
    id: string;
    content: string;
    createdAt: string;
    user: {
      name: string;
    };
  }[];
  category: {
    name: string;
  };
  category_id: string;
}

const tasks = ref<TaskProps[]>([]);
const taskToEdit = ref<TaskProps>({
  id: "",
  title: "",
  description: "",
  status: "",
  priority: "",
  Comments: [],
  category: { name: "" },
  category_id: ""
});
const taskToDeleteId = ref<string | null>(null);
const taskToDelete = ref<string | null>(null);
const newComments = ref<{ [key: string]: string }>({});

const isModalOpen = ref(false);
const isModalCreateOpen = ref(false);
const isModalEditOpen = ref(false);
const isModalCategoryOpen = ref(false);

const api = setupAPIClient();

const fetchTasks = async () => {
  try {
    const response = await api.get("/list-tasks");
    tasks.value = response.data;
  } catch (err) {
  }
};

const fetchComments = async (taskId: string) => {
  try {
    const response = await api.get(`/comments/${taskId}`);
    const task = tasks.value.find((task) => task.id === taskId);
    if (task) task.Comments = response.data;
  } catch (err) {
  }
};

const createComment = async (taskId: string) => {
  const comment = newComments.value[taskId]?.trim();
  if (!comment) {
    toast.warning("O comentário não pode estar vazio.");
    return;
  }

  try {
    await api.post("/comment", { content: comment, task_id: taskId });
    newComments.value[taskId] = "";
    await fetchComments(taskId);
  } catch (error) {
  }
};

const deleteTask = () => {
};

const openModal = (taskId: string) => {
  taskToDeleteId.value = taskId;
  isModalOpen.value = true;
};

const openModalCreate = () => (isModalCreateOpen.value = true);
const openModalEdit = (task: TaskProps) => {
  taskToEdit.value = task;
  isModalEditOpen.value = true;
};
const openModalCategory = () => (isModalCategoryOpen.value = true);

onMounted(fetchTasks);

watchEffect(() => {
  if (taskToEdit.value.id) fetchComments(taskToEdit.value.id);
});
</script>

<template>
  <Sidebar />
  <Container>
    <div class="w-full flex gap-5 justify-center py-4 px-3">
      <button @click="openModalCreate" class="cursor-pointer bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-md text-white font-semibold shadow-lg transition duration-300">Nova Tarefa</button>
      <button @click="openModalCategory" class="cursor-pointer bg-teal-600 hover:bg-teal-700 px-6 py-2 rounded-md text-white font-semibold shadow-lg transition duration-300">Nova Categoria</button>
    </div>

    <div class="w-full flex justify-center items-center mt-12">
      <h2 class="text-3xl text-teal-700 font-bold">Todas as tarefas</h2>
    </div>

    <div class="flex flex-col w-full mt-5 px-5 space-y-6 pb-10">
      <div v-for="task in tasks" :key="task.id" class="w-full border border-gray-300 p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition duration-300">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-semibold text-teal-800">{{ task.title }}</h3>
          <div class="flex gap-3">
            <button @click="openModal(task.id)" class="bg-red-600 hover:bg-red-700 cursor-pointer text-white text-sm px-4 py-2 rounded-md transition duration-300">Finalizar</button>
            <button @click="openModalEdit(task)" class="bg-yellow-600 hover:bg-yellow-700 cursor-pointer text-white text-sm px-4 py-2 rounded-md transition duration-300">Editar</button>
          </div>
        </div>

        <p class="text-gray-700 mt-3">{{ task.description }}</p>

        <div class="flex flex-col mt-4">
          <div class="mb-2">
            <span class="text-sm text-gray-600">Categoria: <strong>{{ task.category.name }}</strong></span>
          </div>
          <span class="text-sm text-gray-600">Status: <strong>{{ task.status }}</strong></span>
          <span class="text-sm text-gray-600">Prioridade: <strong>{{ task.priority }}</strong></span>
        </div>

        <div class="mt-4">
          <h4 class="text-sm font-semibold text-teal-700">Comentários:</h4>
          <ul class="mt-1 text-sm text-gray-600">
            <li v-for="(comment, index) in task.Comments" :key="index" class="py-2">
              <small>({{ formatDate(comment.createdAt) }})</small> - {{ comment.user?.name }}: {{ comment.content }}
            </li>
          </ul>
        </div>

        <div class="mt-5">
          <textarea v-model="newComments[task.id]" class="w-full border border-gray-300 rounded-md p-3 outline-0 shadow-sm focus:ring-2 focus:ring-teal-500" placeholder="Adicione um comentário"></textarea>
          <button @click="createComment(task.id)" class="mt-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md transition duration-300">Enviar</button>
        </div>
      </div>
    </div>

    <ModalDelete v-model:isOpen="isModalOpen" :id="taskToDeleteId" :onConfirm="deleteTask" @updateTasks="fetchTasks" />
    <ModalCreate v-model:isOpen="isModalCreateOpen" @updateTasks="fetchTasks" />
    <ModalEdit v-model:isOpen="isModalEditOpen" :task="taskToEdit" @updateTasks="fetchTasks" />
    <ModalCategory v-model:isOpen="isModalCategoryOpen" @updateTasks="fetchTasks" />
  </Container>
</template>
