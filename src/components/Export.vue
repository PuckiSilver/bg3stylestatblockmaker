<script setup>
import { ref } from 'vue';
import Overlay from './Overlay.vue';
import { statblockToInlineHtml } from '@/html-export';
import yaml from 'js-yaml';

const statblock = defineModel()
const isOpen = ref(false)

const exportAs = ref('json')

const outputText = ref(JSON.stringify(statblock.value, null, 2))

const generateOutputText = () => {
  switch (exportAs.value) {
    case 'yaml':
      outputText.value = yaml.dump(statblock.value)
      break
    case 'html':
      outputText.value = statblockToInlineHtml(statblock.value)
      break
    default:
      outputText.value = JSON.stringify(statblock.value, null, 2)
      break
  }
}

const copyOutputText = () => {
  navigator.clipboard.writeText(outputText.value).then(() => alert('Copied!'))
}
</script>

<template>
  <button class="export-button" @click="() => isOpen = true">
    Export
  </button>
  <Overlay v-model="isOpen">
    <div class="container">
      <h1>Export</h1>
      <div class="input-container">
        <label class="select-input-label">
          <span>Source:</span>
          <select v-model="exportAs" name="export-as" @change="generateOutputText">
            <option value="json">JSON</option>
            <option value="yaml">Yaml</option>
            <option value="html">HTML</option>
          </select>
        </label>
        <div class="descriptions">
          <span v-if="exportAs === 'json'">
            Raw json output of this editor.
          </span>
          <span v-if="exportAs === 'yaml'">
            yml for Fantasy Statblocks or to be human readable.
          </span>
          <span v-if="exportAs === 'html'">
            HTML with inline styles.
          </span>
        </div>
      </div>
      <div class="copyable-textarea">
        <label class="text-input-label">
          <span>Export:</span>
          <textarea v-model="outputText" disabled name="output-text"/>
        </label>
        <button class="copy" @click="copyOutputText"/>
      </div>
    </div>
  </Overlay>
</template>

<style scoped>
button.export-button {
  border: 0;
  border-bottom: .125rem solid rgb(var(--border-color));
  border-radius: .5rem .5rem 0 0;
  box-sizing: border-box;
  height: 100%;
  background-color: transparent;
  font-size: 1.5rem;
  padding: 0 1rem;
  color: rgb(var(--text-color-secondary));

  &:hover {
    background-color: rgb(var(--gradient-bright));
  }
}

div.container {
  border-radius: .5rem;
  border: .25rem solid rgb(var(--border-color));
  background-image: linear-gradient(0deg, rgb(var(--gradient-dark)) 0%, rgb(var(--gradient-bright)) 100%);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: fit-content;

  h1 {
    margin: 0;
  }

  div.input-container {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: flex-start;

    div.descriptions {
      width: 80rem;
      height: fit-content;
      background-color: rgb(var(--gradient-bright));
      box-sizing: border-box;
      padding: .5rem;
      margin-top: 1rem;
      border-radius: .5rem;
    }
  }
}

.copyable-textarea {
  display: flex;
  position: relative;
  width: 100%;

  label {
    width: 100%;

    textarea {
      max-height: 55rem;
    }
  }

  button.copy {
    background: none;
    border: none;
    position: absolute;
    right: .5rem;
    top: .5rem;
    padding: 0;
    width: 2rem;
    height: 2rem;

    background-size: 1.5rem;
    background-repeat: no-repeat;
    background-position: 50%;
    background-image: url('@/assets/ico_copy_d.webp');
    background-color: rgb(var(--gradient-dark));
    border-radius: .5rem;

    &:hover {
      background-image: url('@/assets/ico_copy_h.webp');
      background-color: rgb(var(--gradient-bright));
    }
  }
}
</style>
