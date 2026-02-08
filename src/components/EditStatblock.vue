<script setup>
import { computed, ref } from 'vue';
import { DamageTypes } from '@/enums/enums';

const statblock = defineModel()

const resistances = computed(() => {
  return Object.values(DamageTypes).map(t => {return {
    id: t,
    name: t[0].toUpperCase() + t.slice(1),
    image: `/src/assets/damage_types/${t}.webp`,
    vulnerable: statblock.value.damage_vulnerabilities?.toLowerCase().includes(t),
    resistant: statblock.value.damage_resistances?.toLowerCase().includes(t),
    immune: statblock.value.damage_immunities?.toLowerCase().includes(t),
  }})
})

const toggelDamageType = (damageType) => {
  const re = new RegExp(String.raw`,? ?${damageType}`, 'ig')
  if (statblock.value.damage_vulnerabilities?.toLowerCase().includes(damageType)) {
    statblock.value.damage_vulnerabilities && (statblock.value.damage_vulnerabilities = statblock.value.damage_vulnerabilities.replace(re, ''))
    statblock.value.damage_resistances = statblock.value.damage_resistances ? `${statblock.value.damage_resistances}, ${damageType}` : damageType
    statblock.value.damage_immunities && (statblock.value.damage_immunities = statblock.value.damage_immunities.replace(re, ''))
  } else if (statblock.value.damage_resistances?.toLowerCase().includes(damageType)) {
    statblock.value.damage_resistances && (statblock.value.damage_resistances = statblock.value.damage_resistances.replace(re, ''))
    statblock.value.damage_immunities = statblock.value.damage_immunities ? `${statblock.value.damage_immunities}, ${damageType}` : damageType
  } else if (statblock.value.damage_immunities?.toLowerCase().includes(damageType)) {
    statblock.value.damage_immunities && (statblock.value.damage_immunities = statblock.value.damage_immunities.replace(re, ''))
  } else {
    statblock.value.damage_vulnerabilities = statblock.value.damage_vulnerabilities ? `${statblock.value.damage_vulnerabilities}, ${damageType}` : damageType
  }
}

const moveItem = (arr, from, to) => {
  if (to >= arr.length || to < 0) {
    return
  }
  const e = arr.splice(from, 1)[0]
  arr.splice(to, 0, e)
}

const editingActionIndex = ref()
const editingAction = ref({
  name: undefined,
  desc: undefined,
})

const createNewAction = () => {
  const last = editingActionIndex.value
  editingActionIndex.value = statblock.value?.actions?.length ?? 0
  if (editingActionIndex.value !== last) {
    editingAction.value = {
      name: undefined,
      desc: undefined,
    }
  }
}

const stopEditingAction = () => {
  editingActionIndex.value = undefined
}

const confirmEditingAction = () => {
  if (editingActionIndex.value >= (statblock.value.actions?.length ?? 0)) {
    statblock.value.actions = [...(statblock.value.actions || []), {}]
  }
  statblock.value.actions[editingActionIndex.value].name = editingAction.value.name
  statblock.value.actions[editingActionIndex.value].desc = editingAction.value.desc
  statblock.value.actions = statblock.value.actions.filter(a => a.name || a.desc)
  editingActionIndex.value = undefined
}

const startEditingAction = idx => {
  const last = editingActionIndex.value
  editingActionIndex.value = idx
  if (editingActionIndex.value !== last) {
    editingAction.value = {
      name: statblock.value.actions[idx].name,
      desc: statblock.value.actions[idx].desc,
    }
  }
}

const editingFeatureIndex = ref()
const editingFeature = ref({
  name: undefined,
  desc: undefined,
})

const createNewFeature = () => {
  const last = editingFeatureIndex.value
  editingFeatureIndex.value = statblock.value?.traits?.length ?? 0
  if (editingFeatureIndex.value !== last) {
    editingFeature.value = {
      name: undefined,
      desc: undefined,
    }
  }
}

const stopEditingFeature = () => {
  editingFeatureIndex.value = undefined
}

const confirmEditingFeature = () => {
  if (editingFeatureIndex.value >= (statblock.value.traits?.length ?? 0)) {
    statblock.value.traits = [...(statblock.value.traits || []), {}]
  }
  statblock.value.traits[editingFeatureIndex.value].name = editingFeature.value.name
  statblock.value.traits[editingFeatureIndex.value].desc = editingFeature.value.desc
  statblock.value.traits = statblock.value.traits.filter(t => t.name || t.desc)
  editingFeatureIndex.value = undefined
}

const startEditingFeature = idx => {
  const last = editingFeatureIndex.value
  editingFeatureIndex.value = idx
  if (editingFeatureIndex.value !== last) {
    editingFeature.value = {
      name: statblock.value.traits[idx].name,
      desc: statblock.value.traits[idx].desc,
    }
  }
}
</script>

<template>
  <div class="statblock">
    <div class="headline">
      <label class="text-input-label">
        <span>CR</span>
        <input v-model="statblock.cr" id="cr" type="text"/>
      </label>
      <label class="text-input-label">
        <span>Size</span>
        <input v-model="statblock.size" id="size" type="text"/>
      </label>
      <label class="text-input-label">
        <span>Type</span>
        <input v-model="statblock.type" id="type" type="text"/>
      </label>
      <label class="text-input-label">
        <span>Subtype</span>
        <input v-model="statblock.subtype" id="subtype" type="text"/>
      </label>
      <label class="text-input-label">
        <span>Alignment</span>
        <input v-model="statblock.alignment" id="alignment" type="text"/>
      </label>
    </div>
    <div>
      <div class="other-info">
        <div>
          <label class="text-input-label">
            <span>Senses</span>
            <input v-model="statblock.senses" type="text" id="senses"/>
            <img src="@/assets/sneak_64_64.webp">
          </label>
        </div>
        <div>
          <label class="text-input-label">
            <span>Languages</span>
            <input v-model="statblock.languages" type="text" id="languages"/>
            <img src="@/assets/race_h.webp">
          </label>
        </div>
        <div>
          <label class="text-input-label">
            <span>Speed</span>
            <input v-model="statblock.speed" type="text" id="speed"/>
            <img src="@/assets/speed_64_64.webp">
          </label>
        </div>
      </div>
      <div class="portrait">
        <div class="image_wrapper">
          <img :src="statblock.image" :style="{
            'transform': `translate(${statblock.image_modifications?.x ?? 0}%, ${statblock.image_modifications?.y ?? 0}%) scale(${statblock.image_modifications?.scale ?? 1})`,
            'filter': `hue-rotate(${statblock.image_modifications?.hue ?? 0}deg)`,
          }">
        </div>
      </div>
      <div class="main-info">
        <div>
          <label class="text-input-label">
            <span>HP</span>
            <input v-model="statblock.hp" type="text" id="hp"/>
            <img src="@/assets/levelUp_hp_h2.webp">
          </label>
        </div>
        <div>
          <label class="text-input-label">
            <span>AC</span>
            <input v-model="statblock.ac" type="text" id="ac"/>
            <img src="@/assets/ac.webp">
          </label>
        </div>
        <label class="text-input-label">
          <span>Image Link</span>
          <input v-model="statblock.image" type="text" id="image"/>
        </label>
        <label class="text-input-label">
          <span>Hue</span>
          <input v-model="statblock.image_modifications.hue" type="number" id="hue"/>
        </label>
        <label class="text-input-label">
          <span>X Offset</span>
          <input v-model="statblock.image_modifications.x" type="number" id="y"/>
        </label>
        <label class="text-input-label">
          <span>Y Offset</span>
          <input v-model="statblock.image_modifications.y" type="number" id="x"/>
        </label>
        <label class="text-input-label">
          <span>Scale</span>
          <input v-model="statblock.image_modifications.scale" type="number" id="scale"/>
        </label>
      </div>
    </div>
    <div>
      <label class="text-input-label">
        <span>Name</span>
        <input v-model="statblock.name" type="text" id="name" class="name-input"/>
      </label>
    </div>
    <div class="ability-scores">
      <label class="text-input-label">
        <span>STR</span>
        <input v-model="statblock.stats[0]" type="text" id="str"/>
      </label>
      <label class="text-input-label">
        <span>DEX</span>
        <input v-model="statblock.stats[1]" type="text" id="dex"/>
      </label>
      <label class="text-input-label">
        <span>CON</span>
        <input v-model="statblock.stats[2]" type="text" id="con"/>
      </label>
      <label class="text-input-label">
        <span>INT</span>
        <input v-model="statblock.stats[3]" type="text" id="int"/>
      </label>
      <label class="text-input-label">
        <span>WIS</span>
        <input v-model="statblock.stats[4]" type="text" id="wis"/>
      </label>
      <label class="text-input-label">
        <span>CHA</span>
        <input v-model="statblock.stats[5]" type="text" id="cha"/>
      </label>
    </div>
    <div>
      <span class="header">Resistances</span>
    </div>
    <div class="resistance-container">
      <button class="resistance has-tooltip" v-for="res in resistances" @click="() => toggelDamageType(res.id)">
        <img :src="res.image">
        <img v-if="res.immune" src="@/assets/immune.webp" class="immune">
        <img v-if="res.resistant" src="@/assets/resistant.webp" class="resistant">
        <img v-if="res.vulnerable" src="@/assets/vulnerable.webp" class="vulnerable">
        <div class="tooltip text-tooltip">{{
          res.name +
          (res.immune ? ' (Immune)' : '') +
          (res.resistant ? ' (Resistant)' : '') +
          (res.vulnerable ? ' (Vulnerable)' : '')
        }}</div>
      </button>
    </div>
    <div>
      <span class="header">Notable Features</span>
    </div>
    <div v-if="editingFeatureIndex !== undefined" class="edit-container">
      <div class="edit-name">
        <label class="text-input-label">
          <span>Name</span>
          <input v-model="editingFeature.name" type="text" id="edit-feature-name"/>
        </label>
        <img src="@/assets/features/generic_buff.webp">
      </div>
      <label class="text-input-label edit-desc">
        <span>Description</span>
        <textarea v-model="editingFeature.desc" id="edit-feature-desc"/>
      </label>
      <button @click="confirmEditingFeature" class="confirm-button">Confirm</button>
      <button @click="stopEditingFeature" class="close-button"/>
    </div>
    <div>
      <div class="list-container">
        <button
          v-for="(trait, idx) in statblock.traits?.filter(t => t.name || t.desc)"
          class="has-tooltip feature-row"
          @click="() => startEditingFeature(idx)"
        >
          <img class="thumbnail" src="@/assets/features/generic_buff.webp">
          <div class="name-and-desc">
            <span>{{ trait.name?.replace(/\.$/,'') }}</span>
            <span>{{ trait.desc }}</span>
          </div>
          <div class="tooltip">
            <div class="bg3-action-tooltip">
              <span class="name">{{ trait.name?.replace(/\.$/,'') }}</span>
              <span class="sub-name">Feature</span>
              <span class="desc">{{ trait.desc }}</span>
              <img class="icon" src="@/assets/features/generic_buff.webp">
            </div>
          </div>
        </button>
        <button class="add-new" @click="createNewFeature"/>
      </div>
    </div>
    <div>
      <span class="header">Actions</span>
    </div>
    <div v-if="editingActionIndex !== undefined" class="edit-container">
      <div class="edit-name">
        <label class="text-input-label">
          <span>Name</span>
          <input v-model="editingAction.name" type="text" id="edit-action-name"/>
        </label>
        <img src="@/assets/actions/generic_action.webp">
      </div>
      <label class="text-input-label edit-desc">
        <span>Description</span>
        <textarea v-model="editingAction.desc" id="edit-action-desc"/>
      </label>
      <button @click="confirmEditingAction" class="confirm-button">Confirm</button>
      <button @click="stopEditingAction" class="close-button"/>
    </div>
    <div>
      <div class="list-container">
        <button
          v-for="(action, idx) in statblock.actions?.filter(t => t.name || t.desc)"
          class="has-tooltip feature-row"
          @click="() => startEditingAction(idx)"
        >
          <img class="thumbnail-square" src="@/assets/actions/generic_action.webp">
          <div class="name-and-desc">
            <span>{{ action.name.replace(/\.$/,'') }}</span>
            <span>{{ action.desc }}</span>
          </div>
          <div class="tooltip">
            <div class="bg3-action-tooltip">
              <span class="name">{{ action.name.replace(/\.$/,'') }}</span>
              <span class="sub-name">Action</span>
              <span class="desc">{{ action.desc }}</span>
              <img class="icon" src="@/assets/actions/generic_action.webp">
            </div>
          </div>
        </button>
        <button class="add-new" @click="createNewAction"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.statblock {
  border-radius: .5rem;
  border: .25rem solid rgb(var(--border-color));
  background-image: linear-gradient(0deg, rgb(var(--gradient-dark)) 0%, rgb(var(--gradient-bright)) 100%);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: fit-content;

  div {
    display: flex;
    gap: .5rem;
    align-items: center;
    justify-content: center;

    &.resistance-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0;
    }

    .other-info {
      width: 20rem;
      display: flex;
      flex-direction: column;
      gap: .25rem;

      div {
        background-color: rgb(var(--gradient-bright));
        border-radius: .5rem;
        gap: 0;
        width: 100%;

        label {
          width: 100%;

          input {
            width: 100%;
          }
        }
      }
    }

    .portrait {
      position: relative;

      .image_wrapper {
        height: 8rem;
        width: 8rem;
        border-radius: 50%;
        border: .25rem solid rgb(var(--border-color));
        overflow: hidden;
        box-shadow: 0 0 .5rem rgb(var(--shadow-color));

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          overflow: visible;
        }
      }
    }

    .main-info {
      width: 20rem;
      display: flex;
      flex-wrap: wrap;
      gap: .25rem;

      div {
        background-color: rgb(var(--gradient-bright));
        border-radius: .5rem;
        gap: 0;
        width: calc(50% - .125rem);

        label {
          width: 100%;

          input {
            width: 100%;
          }
        }

        &:nth-child(1) {
          width: calc(2 * ((100% - .5rem) / 3));
        }

        &:nth-child(2) {
          width: calc((100% - .5rem) / 3);
        }
      }

      &>label {
        box-sizing: border-box;
        width: calc((100% - .5rem) / 3);

        &:nth-child(3) {
          width: calc(2 * ((100% - .5rem) / 3));

          input {
            width: 100%;
          }
        }
      }
    }

    input.name-input {
      font-size: 1.5rem;
      field-sizing: content;
      width: unset;
      min-width: 4rem;
    }

    &.ability-scores {
      label {
        width: 3.5rem;

        input {
          font-size: 1.5rem;
          text-align: center;
        }
      }
    }

    div.buffer {
      width: calc(52rem * 0.04);
    }

    .swap-ability-display {
      border: 0;
      background-color: transparent;
      padding: 0;
      align-self: center;

      img {
        width: calc(52rem * 0.04);
        height: calc(60rem * 0.04);
        border-radius: .5rem;
      }

      &:hover {
        img {
          background-color: rgb(var(--gradient-bright));
        }
      }
    }

    .resistance {
      width: calc(80rem * 0.025);
      height: calc(104rem * 0.025);
      position: relative;
      border-radius: .5rem;
      padding: .125rem;
      margin: .25rem .125rem 0 .125rem;
      background-color: transparent;
      border: 0;
      color: rgb(var(--text-color));
      font-size: 1rem;
      box-sizing: unset;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background-color: rgb(var(--gradient-bright));
      }

      img {
        width: 100%;
        height: 100%;
      }

      .immune {
        width: calc(96rem * 0.025);
        height: calc(124rem * 0.025);
        position: absolute;
      }

      .resistant {
        width: calc(68rem * 0.025);
        height: calc(60rem * 0.025);
        position: absolute;
        top: -1rem;
      }

      .vulnerable {
        width: calc(68rem * 0.025);
        height: calc(60rem * 0.025);
        position: absolute;
        top: -1rem;
      }
    }

    &.edit-container {
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
      width: 100%;

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

    &.headline label:first-child {
      width: 5rem;
    }

    .header {
      font-size: 1rem;

      &::after {
        margin-left: 1rem;
        content: '';
        display: inline-block;
        background: url('@/assets/decor_header.webp');
        background-size: 100%;
        height: calc(20rem * 0.035);
        width: calc(84rem * 0.035);
        transform: scale(-1, 1);
      }

      &::before {
        margin-right: 1rem;
        content: '';
        display: inline-block;
        background: url('@/assets/decor_header.webp');
        background-size: 100%;
        height: calc(20rem * 0.035);
        width: calc(84rem * 0.035);
      }
    }
  }
}
</style>
