<script setup lang="ts">
import { useHead } from '@vueuse/head'

const title = 'Renderpub'
const description
  = 'Renderpub - Architecting the Metaverse'

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    {
      property: 'og:image',
      content:
        'https://storage.googleapis.com/spaces.renderpub.com/RenderpubOG.jpg',
    },
  ],
})
</script>

<template>
  <router-view />
</template>
