<script setup>
import { computed, ref } from 'vue';
import { DamageTypes } from '@/enums/enums';
import EditCollection from './EditCollection.vue';
import genericAction from '@/assets/actions/generic_action.webp';
import genericBuff from '@/assets/features/generic_buff.webp';

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
    <EditCollection
      v-model="statblock.traits"
      title="Feature"
      :default-image="genericBuff"
    />
    <div>
      <span class="header">Actions</span>
    </div>
    <EditCollection
      v-model="statblock.actions"
      title="Action"
      square
      :default-image="genericAction"
    />
    <div>
      <span class="header">Bonus Actions</span>
    </div>
    <EditCollection
      v-model="statblock.bonus_actions"
      title="Bonus Action"
      square
      :default-image="genericAction"
    />
    <div>
      <span class="header">Reactions</span>
    </div>
    <EditCollection
      v-model="statblock.reactions"
      title="Reaction"
      :default-image="genericBuff"
    />
    <div>
      <span class="header">Legendary Actions</span>
    </div>
    <EditCollection
      v-model="statblock.legendary_actions"
      title="Legendary Action"
      square
      :default-image="genericAction"
    />
    <div>
      <span class="header">Lair Actions</span>
    </div>
    <EditCollection
      v-model="statblock.lair_actions"
      title="Lair Action"
      square
      :default-image="genericAction"
    />
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
