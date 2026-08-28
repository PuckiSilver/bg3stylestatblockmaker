<script setup>
import { useTemplateRef } from 'vue';

const isOpen = defineModel()
const background = useTemplateRef('overlay-background')

const onClick = e => {
  e.target === background.value && (isOpen.value = false)
}
</script>

<template>
  <div v-if="isOpen" class="overlay" @click="onClick" ref="overlay-background">
    <slot/>
  </div>
</template>

<style scoped>
div.overlay {
  border: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  width: 100vw;
  height: 100vh;
  background-color: rgba(var(--background-color), .5);
  overflow-y: auto;
  display: flex;
  justify-content: safe center;
  align-items: safe center;
}
</style>
