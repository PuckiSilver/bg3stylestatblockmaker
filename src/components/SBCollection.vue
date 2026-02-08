<script setup>

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

</script>

<template>
  <div class="feature_container" v-if="collection && collection.length > 0 && collection.some(e => e.name || e.desc)">
    <div v-for="trait in collection.filter(t => t.name || t.desc)" class="has-tooltip">
      <img :class="{
        'thumbnail-square': isSquare,
        'thumbnail': !isSquare,
      }" :src="defaultImage">
      <div class="name-and-desc">
        <span>{{ trait.name?.replace(/\.$/,'') }}</span>
        <span>{{ trait.desc }}</span>
      </div>
      <div class="tooltip">
        <div class="bg3-action-tooltip">
          <span class="name">{{ trait.name?.replace(/\.$/,'') }}</span>
          <span class="sub-name">{{ title }}</span>
          <span class="desc">{{ trait.desc }}</span>
          <img class="icon" :src="defaultImage">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
div {
  display: flex;
  gap: .5rem;
  align-items: center;
  justify-content: center;
}

.feature_container {
  background-color: rgb(var(--gradient-dark));
  display: flex;
  flex-direction: column;
  gap: .25rem;
  align-items: baseline;
  padding: .5rem 1rem;
  border-radius: .5rem;

  div {
    width: 100%;
    border-radius: .5rem;

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
}
</style>
