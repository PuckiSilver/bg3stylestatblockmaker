<script setup>
import { computed, ref } from 'vue';
import Statblock from './components/Statblock.vue';
import EditStatblock from './components/EditStatblock.vue';
import yaml from 'js-yaml';

const message = ref('');

const statblockData = computed(old => {
  try {
    const o = yaml.load(message.value)
    if (o) return o
  } catch {}
  try {
    const o = JSON.parse(message.value)
    if (o) return o
  } catch {}
  return old || {}
})

const a = ref({image_modifications:{},stats:[10,10,10,10,10,10]})
</script>

<template>
  <main>
    <h1>BG3 Style Stat Block Maker</h1>
    <textarea v-model="message" placeholder="Paste a yml statblock here in order to display it..." rows="5" cols="65"></textarea>
    {{ a }}
    <div class="row">
      <EditStatblock v-model="a"/>
      <Statblock :statblock="a" />
    </div>
  </main>
</template>

<style scoped>
main {
  --background-color: 0, 0, 0;
  --gradient-dark: 24, 20, 17;
  --gradient-bright: 46, 38, 29;
  --border-color: 110, 80, 54;
  --text-color-secondary: 153, 124, 97;
  --text-color: 255, 255, 255;
  --shadow-color: 0, 0, 0;
  --color-confirm: 52, 72, 53;
  --color-confirm-hover: 81, 99, 64;

  background: rgb(var(--background-color));
  color: rgb(var(--text-color));
  font-family: "Aldine 721 Bold BT";
  height: 100vh;
  overflow-y: auto;
  padding: 1rem;

  textarea {
    background-color: rgb(var(--gradient-dark));
    color: rgb(var(--text-color));
    border-radius: .5rem;
    border: .125rem solid rgb(var(--border-color));
    padding: .5rem;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: rgb(var(--text-color-secondary));
    }
  }

  div.row {
    display: flex;
    gap: 1rem;
  }
}
</style>
