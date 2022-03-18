<template>
  <svg style="" height="200" width="200">
    <circle cx="50%" cy="50%" r="50%" fill="{{color}}" />
    <circle cx="50%" cy="50%" r="48%" fill="white" />
    <circle cx="50%" cy="50%" r="44%" fill="{{color}}" />
    <circle cx="50%" cy="50%" r="32%" fill="white" />
    <image
      x="40%"
      y="25%"
      width="18%"
      height="50%"
      style="filter:invert(0.2)"
      href="{{ iconImage }}"
    />
  </svg>
</template>

<script>
import { Tags } from './tags'

export default {
  props: {
    color: {
      type: String,
      required: true,
      default: ' ',
    },
    iconImage: {
      type: String,
      required: true,
      default: ' ',
    },
  },
  data() {
    return {
    }
  },
}
</script>
