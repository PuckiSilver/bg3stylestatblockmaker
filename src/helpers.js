import { DamageTypes } from '@/enums';
import slashingIcon from '@/assets/damage_types/slashing.webp';
import piercingIcon from '@/assets/damage_types/piercing.webp';
import bludgeoningIcon from '@/assets/damage_types/bludgeoning.webp';
import acidIcon from '@/assets/damage_types/acid.webp';
import thunderIcon from '@/assets/damage_types/thunder.webp';
import necroticIcon from '@/assets/damage_types/necrotic.webp';
import fireIcon from '@/assets/damage_types/fire.webp';
import lightningIcon from '@/assets/damage_types/lightning.webp';
import coldIcon from '@/assets/damage_types/cold.webp';
import psychicIcon from '@/assets/damage_types/psychic.webp';
import poisonIcon from '@/assets/damage_types/poison.webp';
import forceIcon from '@/assets/damage_types/force.webp';
import radiantIcon from '@/assets/damage_types/radiant.webp';

export const damageTypeToImage = (dmgType) => {
  switch (dmgType) {
    case DamageTypes.Slashing: return slashingIcon
    case DamageTypes.Piercing: return piercingIcon
    case DamageTypes.Bludgeoning: return bludgeoningIcon
    case DamageTypes.Acid: return acidIcon
    case DamageTypes.Thunder: return thunderIcon
    case DamageTypes.Necrotic: return necroticIcon
    case DamageTypes.Fire: return fireIcon
    case DamageTypes.Lightning: return lightningIcon
    case DamageTypes.Cold: return coldIcon
    case DamageTypes.Psychic: return psychicIcon
    case DamageTypes.Poison: return poisonIcon
    case DamageTypes.Force: return forceIcon
    case DamageTypes.Radiant: return radiantIcon
    default: return ''
  }
}
