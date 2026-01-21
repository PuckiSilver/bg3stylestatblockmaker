<script setup>
import { computed, ref } from 'vue';
import yaml from 'js-yaml';

/*const statblock_data = ref({
  "name": "Verletzte Runendurchzogene Seeschlange",
  "image": "VerletzteRunendurchzogeneSeeschlange.png",
  "size": "Gargantuan (20x20)",
  "ac": 13,
  "hp": "166 (12d10 + 100) (112-220)",
  "speed": "10ft., swim 40 ft., fly 30ft.",
  "stats": [
    20,
    14,
    17,
    11,
    13,
    10
  ],
  "senses": "darkvision 60 ft., passive Perception 11",
  "bestiary": true,
  "damage_vulnerabilities": "bludgeoning",
  "damage_resistances": "radiant",
  "damage_immunities": "poison",
  "traits": [
    {
      "name": "Verletzt.",
      "desc": "Die Kreatur hat Disadvantage auf DEX und STR Saving Throws."
    },
    {
      "name": "Amphibisch.",
      "desc": "Die Kreatur Luft und Wasser atmen."
    }
  ],
  "actions": [
    {
      "name": "Sturmstrahl (Vorbereitet).",
      "desc": "Die Kreatur stößt einen Strahl aus (15ft. breit, 90ft. lang). Die Ziele müssen einen DC 16 DEX Saving Throw machen und nehmen 21 (6d6) Bludgeoning, halbiert bei erfolgreichem Save."
    },
    {
      "name": "Tantrum (Vorbereitet).",
      "desc": "Die Kreatur schlägt und beißt um sich und greift alles in 10ft. Reichweite an. Angriffswurf: +6 to hit, Reichweite 25ft. (von Mitte), alle Ziele. Hit: 12 (2d8 + 3) Bludgeoning und 7 (1d8 + 2) Piercing"
    },
    {
      "name": "Punktstürme (Vorbereitet).",
      "desc": "Die Kreatur wählt 5 Orte in 120ft., wo Wirbelstürme (5ft. Radius) entstehen. Alle Ziele in einem Wirbelsturm müssen einen DC 16 DEX Saving Throw machen und nehmen 21 (6d6) Bludgeoning, halbiert bei erfolgreichem Save."
    },
    {
      "name": "Biss.",
      "desc": "Melee Waffenangriff: +6 to hit, Reichweite 5ft., ein Ziel. Hit: 13 (2d8 + 2) Piercing"
    },
    {
      "name": "Schweifschlag.",
      "desc": "Die Kreatur schlägt in einem Strahl (10ft. breit, 30ft. lang). Die Ziele müssen einen DC 16 DEX Saving Throw machen und nehmen 11 (2d8 + 2) Bludgeoning, halbiert bei erfolgreichem Save."
    }
  ]
})*/

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

const headline = computed(() => {
  const line = [];
  statblockData.value.cr && line.push(`CR ${statblockData.value.cr}`)
  statblockData.value.size && line.push(statblockData.value.size)
  statblockData.value.type && line.push(statblockData.value.type)
  statblockData.value.subtype && line.push(statblockData.value.subtype)
  statblockData.value.alignment && line.push(statblockData.value.alignment)
  return (line && line.length > 0) && line.reduce((a, b) => `${a}, ${b}`) || ''
})

const damageTypes = ['slashing', 'piercing', 'bludgeoning', 'acid', 'thunder', 'necrotic', 'fire', 'lightning', 'cold', 'psychic', 'poison', 'force', 'radiant']
const resistances = computed(() => {
  return damageTypes.map(t => {return {
    name: t[0].toUpperCase() + t.slice(1),
    image: `/src/assets/damage_types/${t}.webp`,
    vulnerable: statblockData.value.damage_vulnerabilities?.toLowerCase().includes(t),
    resistant: statblockData.value.damage_resistances?.toLowerCase().includes(t),
    immune: statblockData.value.damage_immunities?.toLowerCase().includes(t),
  }}).filter(t => t.vulnerable || t.resistant || t.immune)
})

const showAbilities = ref(false)

const abilityNumber = (value) => {
  if (showAbilities.value) {
    return statblockData.value.stats[value]
  } else {
    const bonus = Math.floor((statblockData.value.stats[value] - 10) / 2)
    return bonus > 0 ? `+${bonus}` : bonus
  }
}

</script>

<template>
  <main>
    <h1>BG3 Style Stat Block Maker</h1>
    <textarea v-model="message" placeholder="Paste a yml statblock here in order to display it..." rows="5" cols="65"></textarea>
    <div class="statblock">
      <div>
        <span>{{ headline }}</span>
      </div>
      <div>
        <div class="other-info">
          <div class="has-tooltip">
            <img src="@/assets/sneak_64_64.webp">
            <div class="tooltip text-tooltip">Senses: {{ statblockData.senses }}</div>
          </div>
          <div class="has-tooltip">
            <img src="@/assets/race_h.webp">
            <div class="tooltip text-tooltip">Languages: {{ statblockData.languages }}</div>
          </div>
          <div class="has-tooltip">
            <img src="@/assets/speed_64_64.webp">
            <div class="tooltip text-tooltip">Speed: {{ statblockData.speed }}</div>
          </div>
        </div>
        <div class="portrait">
          <div class="image_wrapper">
            <img src="https://bg3.wiki/w/images/e/e8/Portrait_Death_Shepherd.png">
          </div>
          <span>{{ statblockData.hp }}</span>
        </div>
        <div class="acdisplay">
          <img src="@/assets/ac_background.webp">
          <span>AC</span>
          <span>{{ statblockData.ac }}</span>
        </div>
      </div>
      <div>
        <h1>{{ statblockData.name }}</h1>
      </div>
      <div v-if="statblockData.stats && statblockData.stats.length === 6">
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
      <div v-if="statblockData.traits && statblockData.traits.length > 0">
        <span class="header">Notable Features</span>
      </div>
      <div v-if="statblockData.traits && statblockData.traits.length > 0">
        <div class="feature_container">
          <div v-for="trait in statblockData.traits" class="has-tooltip">
            <img class="thumbnail" src="@/assets/features/generic_buff.webp">
            <div class="name-and-desc">
              <span>{{ trait.name.replace(/\.$/,'') }}</span>
              <span>{{ trait.desc }}</span>
            </div>
            <div class="tooltip">
              <div class="bg3-action-tooltip">
                <span class="name">{{ trait.name.replace(/\.$/,'') }}</span>
                <span class="sub-name">Feature</span>
                <span class="desc">{{ trait.desc }}</span>
                <img class="icon" src="@/assets/features/generic_buff.webp">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="statblockData.actions && statblockData.actions.length > 0">
        <span class="header">Actions</span>
      </div>
      <div v-if="statblockData.actions && statblockData.actions.length > 0">
        <div class="action_container">
          <div class="has-tooltip" v-for="action in statblockData.actions">
            <img class="thumbnail" src="@/assets/actions/generic_action.webp">
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
          </div>
        </div>
      </div>
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
    border: .25rem solid rgb(var(--border-color));
    padding: .5rem;
    font-size: 1rem;
  }
}

.has-tooltip {
  position: relative;

  .tooltip {
    background: rgb(var(--gradient-bright));
    position: absolute;
    visibility: hidden;
    bottom: calc(100% + .25rem);
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 1;
    border-radius: .5rem;
    border: .25rem solid rgb(var(--border-color));
    padding: .5rem;
  }

  &:hover {
    background-color: rgb(var(--gradient-bright));

    .tooltip {
      visibility: visible;
    }
  }
}

.bg3-action-tooltip {
  display: flex;
  flex-direction: column;
  align-items: baseline !important;
  gap: 0 !important;
  position: relative;

  .name {
    font-size: 1.25rem;
    margin-right: 2rem;
  }

  .sub-name {
    color: rgb(var(--text-color-secondary));
    margin-bottom: 1rem;
    margin-right: 2rem;
  }

  .icon {
    position: absolute;
    background: transparent;
    width: 5rem;
    height: 5rem;
    right: -1.5rem;
    top: -1.5rem;
  }
}

.text-tooltip {
  width: max-content;
  max-width: 14rem;
  text-align: left;
  display: flex;
  justify-content: flex-start !important;
}

.statblock {
  border-radius: .5rem;
  border: .25rem solid rgb(var(--border-color));
  background-image: linear-gradient(0deg, rgb(var(--gradient-dark)) 0%, rgb(var(--gradient-bright)) 100%);
  padding: 2rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: fit-content;
  margin: auto;

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
      cursor: pointer;

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
        content: '-------';
        height: .25rem;
        width: 5rem;
        color: rgb(var(--border-color));
      }

      &::before {
        margin-right: 1rem;
        content: '-------';
        height: .25rem;
        width: 5rem;
        color: rgb(var(--border-color));
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

    .feature_container {
      background-color: rgb(var(--gradient-dark));
      display: flex;
      flex-direction: column;
      gap: .25rem;
      align-items: baseline;
      padding: .5rem 1rem;
      border-radius: .5rem;
      width: 100%;

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
          }
        }
      }
    }

    .action_container {
      background-color: rgb(var(--gradient-dark));
      display: flex;
      flex-direction: column;
      gap: .25rem;
      align-items: baseline;
      padding: .5rem 1rem;
      border-radius: .5rem;
      width: 100%;

      div {
        width: 100%;
        border-radius: .5rem;

        img.thumbnail {
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
          }
        }
      }
    }
  }
}
</style>
