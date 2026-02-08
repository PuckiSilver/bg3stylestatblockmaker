<script setup>
import { computed, ref } from 'vue';
import { DamageTypes } from '@/enums/enums';
import SBCollection from './SBCollection.vue';
import genericAction from '@/assets/actions/generic_action.webp';
import genericBuff from '@/assets/features/generic_buff.webp';

const { statblock } = defineProps({
  statblock: {
    type: Object,
    required: true,
  }
})

const headline = computed(() => {
  const line = [];
  statblock.cr && line.push(`CR ${statblock.cr}`)
  statblock.size && line.push(statblock.size)
  statblock.type && line.push(statblock.type)
  statblock.subtype && line.push(statblock.subtype)
  statblock.alignment && line.push(statblock.alignment)
  return (line && line.length > 0) && line.reduce((a, b) => `${a}, ${b}`) || ''
})

const resistances = computed(() => {
  return Object.values(DamageTypes).map(t => {return {
    name: t[0].toUpperCase() + t.slice(1),
    image: `/src/assets/damage_types/${t}.webp`,
    vulnerable: statblock.damage_vulnerabilities?.toLowerCase().includes(t),
    resistant: statblock.damage_resistances?.toLowerCase().includes(t),
    immune: statblock.damage_immunities?.toLowerCase().includes(t),
  }}).filter(t => t.vulnerable || t.resistant || t.immune)
})

const showAbilities = ref(true)

const abilityNumber = (value) => {
  if (showAbilities.value) {
    return statblock.stats[value]
  } else {
    const bonus = Math.floor((statblock.stats[value] - 10) / 2)
    return bonus > 0 ? `+${bonus}` : bonus === 0 ? '+0' : bonus
  }
}
</script>

<template>
  <div class="statblock">
    <div>
      <span>{{ headline }}</span>
    </div>
    <div>
      <div class="other-info">
        <div v-if="statblock.senses" class="has-tooltip">
          <img src="@/assets/sneak_64_64.webp">
          <div class="tooltip text-tooltip">Senses: {{ statblock.senses }}</div>
        </div>
        <div v-if="statblock.languages" class="has-tooltip">
          <img src="@/assets/race_h.webp">
          <div class="tooltip text-tooltip">Languages: {{ statblock.languages }}</div>
        </div>
        <div v-if="statblock.speed" class="has-tooltip">
          <img src="@/assets/speed_64_64.webp">
          <div class="tooltip text-tooltip">Speed: {{ statblock.speed }}</div>
        </div>
      </div>
      <div class="portrait">
        <div class="image_wrapper">
          <img :src="statblock.image" :style="{
            'transform': `translate(${statblock.image_modifications?.x ?? 0}%, ${statblock.image_modifications?.y ?? 0}%) scale(${statblock.image_modifications?.scale ?? 1})`,
            'filter': `hue-rotate(${statblock.image_modifications?.hue ?? 0}deg)`,
          }">
        </div>
        <span>{{ statblock.hp }}</span>
      </div>
      <div class="acdisplay">
        <img src="@/assets/ac_background.webp">
        <span>AC</span>
        <span>{{ statblock.ac }}</span>
      </div>
    </div>
    <div>
      <h1>{{ statblock.name }}</h1>
    </div>
    <div v-if="statblock.stats && statblock.stats.length === 6">
      <div class="buffer"></div>
      <div class="abilityscore">
        <span>STR</span>
        <span>{{ abilityNumber(0) }}</span>
      </div>
      <div class="abilityscore">
        <span>DEX</span>
        <span>{{ abilityNumber(1) }}</span>
      </div>
      <div class="abilityscore">
        <span>CON</span>
        <span>{{ abilityNumber(2) }}</span>
      </div>
      <div class="abilityscore">
        <span>INT</span>
        <span>{{ abilityNumber(3) }}</span>
      </div>
      <div class="abilityscore">
        <span>WIS</span>
        <span>{{ abilityNumber(4) }}</span>
      </div>
      <div class="abilityscore">
        <span>CHA</span>
        <span>{{ abilityNumber(5) }}</span>
      </div>
      <button class="swap-ability-display" @click="() => showAbilities = !showAbilities">
        <img src="@/assets/recharge.webp">
      </button>
    </div>
    <div v-if="resistances && resistances.length > 0">
      <span class="header">Resistances</span>
    </div>
    <div v-if="resistances && resistances.length > 0" class="resistance-container">
      <div class="resistance has-tooltip" v-for="res in resistances">
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
      </div>
    </div>
    <div v-if="statblock.traits && statblock.traits.length > 0 && statblock.traits.some(t => t.name || t.desc)">
      <span class="header">Notable Features</span>
    </div>
    <SBCollection
      v-model="statblock.traits"
      :default-image="genericBuff"
      title="Feature"
    />
    <div v-if="statblock.actions && statblock.actions.length > 0">
      <span class="header">Actions</span>
    </div>
    <SBCollection
      v-model="statblock.actions"
      :default-image="genericAction"
      title="Action"
      square
    />
    <div v-if="statblock.bonus_actions && statblock.bonus_actions.length > 0">
      <span class="header">Bonus Actions</span>
    </div>
    <SBCollection
      v-model="statblock.bonus_actions"
      :default-image="genericAction"
      title="Bonus Action"
      square
    />
    <div v-if="statblock.reactions && statblock.reactions.length > 0">
      <span class="header">Reactions</span>
    </div>
    <SBCollection
      v-model="statblock.reactions"
      :default-image="genericBuff"
      title="Reaction"
    />
    <div v-if="statblock.legendary_actions && statblock.legendary_actions.length > 0">
      <span class="header">Legendary Actions</span>
    </div>
    <SBCollection
      v-model="statblock.legendary_actions"
      :default-image="genericAction"
      title="Legendary Action"
      square
    />
    <div v-if="statblock.lair_actions && statblock.lair_actions.length > 0">
      <span class="header">Lair Actions</span>
    </div>
    <SBCollection
      v-model="statblock.lair_actions"
      :default-image="genericAction"
      title="Lair Action"
      square
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
      width: calc(112rem * 0.035);
      display: flex;
      flex-direction: column;
      gap: 0;

      div {
        border-radius: .5rem;

        img {
          width: calc(64rem * 0.035);
          height: calc(64rem * 0.035);
          border-radius: .5rem;
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

      span {
        background-color: rgba(var(--gradient-dark), .5);
        border-radius: .5rem;
        padding: .125rem .25rem;
        position: absolute;
        left: 50%;
        bottom: .25rem;
        transform: translate(-50%, 0);
        text-shadow: rgb(var(--shadow-color)) 0 0 .5rem;
        white-space: nowrap;
      }
    }

    .acdisplay {
      width: calc(112rem * 0.035);
      height: calc(136rem * 0.035);
      position: relative;

      img {
        width: 100%;
        height: 100%;
      }

      span:nth-child(2) {
        position: absolute;
        top: calc(50% - 1rem);
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 1rem;
        text-shadow: rgb(var(--shadow-color)) 0 0 .5rem;
      }

      span:nth-child(3) {
        position: absolute;
        top: calc(50% + .25rem);
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 1.75rem;
        text-shadow: rgb(var(--shadow-color)) 0 0 .5rem;
        white-space: nowrap;
      }
    }

    h1 {
      padding: 0;
      margin: 0;
      font-size: 1.5rem;
      text-align: center;
    }

    .abilityscore {
      display: flex;
      flex-direction: column;
      gap: .25rem;
      margin: 0 .25rem;

      span:first-child {
        color: rgb(var(--text-color-secondary));
      }

      span:nth-child(2) {
        font-size: 1.5rem;
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

    .resistance {
      width: calc(80rem * 0.025);
      height: calc(104rem * 0.025);
      position: relative;
      border-radius: .5rem;
      padding: .125rem;
      margin: .25rem .125rem 0 .125rem;

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
  }
}
</style>
