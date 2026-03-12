<script setup>
import { ref } from 'vue';
import Overlay from './Overlay.vue';
import yaml from 'js-yaml';

const statblock = defineModel()
const isOpen = ref(false)

const importSource = ref('this')

const importText = ref()

const eToolsSizeLookupTable = {
  'M': 'Medium',
  'L': 'Large',
}

const processImport = () => {
  switch (importSource.value) {
    case '5etools':
      const i = JSON.parse(importText.value)
      statblock.value = {
        name: i.name,
        size: eToolsSizeLookupTable[i.size],
        type: i.type,
        ac: i.ac?.reduce((a, b) => a + (b.ac ?? b), 0),
        hp: `${i.hp.average} ${i.hp.formula}`,
        cr: i.cr,
        senses: [
          i.passive ? `Passive Perception ${i.passive}` : undefined,
          ...(i.senses ? i.senses : [])
        ].filter(e => e).reduce((a, b) => a + ', ' + b),
        languages: i.languages?.reduce((a, b) => a + ', ' + b),
        speed: [
          i.speed?.walk ? `Walking Speed: ${i.speed.walk}ft.` : undefined,
          i.speed?.swim ? `Swimming Speed: ${i.speed.swim}ft.` : undefined,
          i.speed?.fly ? `Flying Speed: ${i.speed.fly}ft.` : undefined,
          i.speed?.burrow ? `Burrowing Speed: ${i.speed.burrow}ft.` : undefined,
        ].filter(e => e).reduce((a, b) => a + ', ' + b),
        stats:[i.str,i.dex,i.con,i.int,i.wis,i.cha],
        image: i.hasToken
        ? `https://5e.tools/img/bestiary/tokens/${i.source}/${encodeURI(i.name)}.webp`
        : undefined,
        image_modifications:{},
        actions: i.action?.map(e => ({name: e.name, desc: e.entries.reduce((a, b) => a + '\n\n' + b)})),
        bonus_actions: i.bonus?.map(e => ({name: e.name, desc: e.entries.reduce((a, b) => a + '\n\n' + b)})),
        traits: i.trait?.map(e => ({name: e.name, desc: e.entries.reduce((a, b) => a + '\n\n' + b)})),
      }
      break;
    case 'yml':
      statblock.value = yaml.load(importText.value)
      break;
    default:
      statblock.value = JSON.parse(importText.value)
      break;
  }
  isOpen.value = false
}
</script>

<template>
  <button class="import-button" @click="() => isOpen = true">
    Import
  </button>
  <Overlay v-model="isOpen">
    <div class="container">
      <h1>Import</h1>
      <div class="input-container">
        <label class="select-input-label">
          <span>Source:</span>
          <select v-model="importSource" name="import-source">
            <option value="this">Stat Block Maker</option>
            <option value="5etools">5e.tools</option>
            <option value="yml">Yaml</option>
          </select>
        </label>
        <label class="text-input-label">
          <span>Text:</span>
          <textarea class="tiny-text-area" v-model="importText"/>
        </label>
      </div>
      <div class="descriptions">
        <span v-if="importSource === 'this'">
          Paste any JSON exported using this Stat Block maker in the field above and click 'Import' below to import it into the editor.
        </span>
        <span v-if="importSource === '5etools'">
          Go to <a href="https://5e.tools/bestiary.html" target="_blank">https://5e.tools/bestiary.html</a> and click on the stat block you want to import.<br>
          <br>
          Once open, hold shift and click on the 'Popout Window' button in the top right of the stat block.<br>
          <br>
          Next click 'Copy Code' on the top left, switch back to this tab and paste the copied text in the field above.<br>
          <br>
          Then click 'Import' below to import the stat block into the editor.
        </span>
        <span v-if="importSource === 'yml'">
          Paste YAML in the format of a <a href="https://plugins.javalent.com/statblock/layouts/integrated/dnd5e" target="_blank">Fantasy Statblock</a> in the field above and click 'Import' below to import it into the editor.
        </span>
      </div>
      <div class="actions">
        <button @click="processImport">Import!</button>
      </div>
    </div>
  </Overlay>
</template>

<style scoped>
button.import-button {
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

    textarea.tiny-text-area {
      height: 2rem;
    }
  }

  div.descriptions {
    width: 0;
    max-width: 100%;
    min-width: 100%;
    background-color: rgb(var(--gradient-bright));
    box-sizing: border-box;
    padding: .5rem;
    border-radius: .5rem;
  }

  div.actions {
    display: flex;
    gap: .5rem;
    justify-content: center;
    flex-wrap: wrap;

    button {
      background-color: rgb(var(--color-confirm));
      border: .125rem solid rgb(var(--border-color));
      border-radius: .5rem;
      color: rgb(var(--text-color));
      font-size: 1rem;
      padding: .25rem .5rem;
      min-width: 7.5rem;

      &:hover {
        background-color: rgb(var(--color-confirm-hover));
      }
    }
  }
}
</style>
