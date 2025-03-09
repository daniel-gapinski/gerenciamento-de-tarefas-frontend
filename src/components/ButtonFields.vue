<template>
  <button
    @click="handleClick"
    class="w-full p-2 rounded-lg font-semibold bg-purple-500 cursor-pointer text-white hover:bg-purple-700"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['click']);

const handleClick = (event: Event) => {};
</script>
