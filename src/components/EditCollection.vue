<script setup>
import { ref } from 'vue';

const collection = defineModel()

const { square: isSquare, defaultImage, title } = defineProps({
  square: {
    type: Boolean,
    default: false,
  },
  defaultImage: {
    required: true,
  },
  title: {
    type: String,
    required: true,
  }
})

const editingIndex = ref()
const editingElement = ref({
  name: undefined,
  desc: undefined,
})

const createNew = () => {
  const last = editingIndex.value
  editingIndex.value = collection.value?.length ?? 0
  if (editingIndex.value !== last) {
    editingElement.value = {
      name: undefined,
      desc: undefined,
    }
  }
}

const stopEditing = () => {
  editingIndex.value = undefined
}

const confirmEditing = () => {
  const currentCollection = collection.value ?? []
  if (editingIndex.value >= (collection.value?.length ?? 0)) {
    currentCollection.push({})
  }
  currentCollection[editingIndex.value].name = editingElement.value.name
  currentCollection[editingIndex.value].desc = editingElement.value.desc
  collection.value = currentCollection.filter(a => a.name || a.desc)
  editingIndex.value = undefined
}

const startEditing = idx => {
  const last = editingIndex.value
  editingIndex.value = idx
  if (editingIndex.value !== last) {
    editingElement.value = {
      name: collection.value[idx].name,
      desc: collection.value[idx].desc,
    }
  }
}
</script>

<template>
  <div v-if="editingIndex !== undefined" class="edit-container">
    <div class="edit-name">
      <label class="text-input-label">
        <span>Name</span>
        <input v-model="editingElement.name" type="text" :id="`edit-${title.toLocaleLowerCase().replace(' ', '-')}-name`"/>
      </label>
      <img :src="defaultImage">
    </div>
    <label class="text-input-label edit-desc">
      <span>Description</span>
      <textarea v-model="editingElement.desc" :id="`edit-${title.toLocaleLowerCase().replace(' ', '-')}-desc`"/>
    </label>
    <button @click="confirmEditing" class="confirm-button">Confirm</button>
    <button @click="stopEditing" class="close-button"/>
  </div>
  <div class="list-container">
    <button
      v-for="(e, idx) in collection?.filter(e => e.name || e.desc)"
      class="has-tooltip feature-row"
      @click="() => startEditing(idx)"
    >
      <img :class="{
        'thumbnail-square': isSquare,
        'thumbnail': !isSquare,
      }" :src="defaultImage">
      <div class="name-and-desc">
        <span>{{ e.name?.replace(/\.$/,'') }}</span>
        <span>{{ e.desc }}</span>
      </div>
      <div class="tooltip">
        <div class="bg3-action-tooltip">
          <span class="name">{{ e.name?.replace(/\.$/,'') }}</span>
          <span class="sub-name">{{ title }}</span>
          <span class="desc">{{ e.desc }}</span>
          <img class="icon" :src="defaultImage">
        </div>
      </div>
    </button>
    <button class="add-new" @click="createNew"/>
  </div>
</template>

<style scoped>
div {
  display: flex;
  gap: .5rem;
  align-items: center;
  justify-content: center;
}

.edit-container {
  background-color: rgb(var(--gradient-dark));
  border: .25rem solid rgb(var(--border-color));
  border-radius: .5rem;
  position: relative;
  margin-bottom: .75rem;
  width: inherit;
  margin: 0 auto;
  padding: .5rem 3rem 1.5rem 3rem;
  display: flex;
  flex-direction: column;

  .edit-name {
    label {
      width: 20rem;

      input {
        font-size: 1.25rem;
      }
    }

    img {
      width: 3rem;
      height: 3rem;
      background-color: rgb(var(--gradient-bright));
      border-radius: .5rem;
      border: .125rem solid rgb(var(--border-color));
    }
  }

  .edit-desc {
    width: 100%;
  }

  .confirm-button {
    background-color: rgb(var(--color-confirm));
    border: .125rem solid rgb(var(--border-color));
    border-radius: .5rem;
    color: rgb(var(--text-color));
    font-size: 1rem;
    padding: .25rem .5rem;
    min-width: 7.5rem;
    position: absolute;
    bottom: 0;
    right: 50%;
    transform: translate(50%, 50%);

    &:hover {
      background-color: rgb(var(--color-confirm-hover));
    }
  }

  .close-button {
    background-color: rgb(var(--gradient-dark));
    background-size: 1.5rem;
    background-repeat: no-repeat;
    background-position: 50%;
    background-image: url('@/assets/close_d.webp');
    position: absolute;
    top: .25rem;
    right: .25rem;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: .125rem solid rgb(var(--border-color));

    &:hover {
      border-color: rgb(var(--text-color-secondary));
      background-image: url('@/assets/close_h.webp');
      background-color: rgb(var(--gradient-bright));
    }
  }
}

.list-container {
  background-color: rgb(var(--gradient-dark));
  display: flex;
  flex-direction: column;
  gap: .25rem;
  align-items: baseline;
  padding: .5rem 1rem;
  border-radius: .5rem;

  button.feature-row {
    width: 100%;
    border-radius: .5rem;
    display: flex;
    gap: .5rem;
    align-items: center;
    justify-content: center;
    color: rgb(var(--text-color));
    border: 0;
    background-color: transparent;
    font-size: 1rem;

    &:hover {
      background-color: rgb(var(--gradient-bright));
    }

    img.thumbnail {
      width: 2rem;
      height: 2rem;
      background-color: rgb(var(--gradient-bright));
      border-radius: 50%;
      border: .125rem solid rgb(var(--border-color));
    }

    img.thumbnail-square {
      width: 2rem;
      height: 2rem;
      background-color: rgb(var(--gradient-bright));
      border-radius: .125rem;
      border: .125rem solid rgb(var(--border-color));
    }
    div.name-and-desc {
      position: relative;
      width: 100%;
      height: 2.5rem;

      span:first-child {
        color: rgb(var(--text-color-secondary));
        margin-right: auto;
        margin-bottom: auto;
      }

      span:nth-child(2) {
        color: rgba(var(--text-color-secondary), .5);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        position: absolute;
        width: 100%;
        height: 100%;
        margin-right: auto;
        margin-top: 2.5rem;
        font-size: .875rem;
        text-align: left;
      }
    }
  }

  button.add-new {
    width: 100%;
    height: 2.5rem;
    padding: 0;
    background-color: transparent;
    border-radius: .5rem;
    border: 0;
    color: rgb(var(--border-color));
    position: relative;

    &:hover {
      background-color: rgb(var(--gradient-bright));
      color: rgb(var(--text-color-secondary));
    }

    &::after {
      content: '+';
      font-size: 2.5rem;
      position: absolute;
      top: calc(50% - .125rem);
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>