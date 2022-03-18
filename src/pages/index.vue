<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const name = ref('')

const router = useRouter()
const go = () => {
  if (name.value) router.push(`/hi/${encodeURIComponent(name.value)}`)
}

const { t } = useI18n()

const props = defineProps({
  message: String,
})
</script>

<template>
  <HeroFinal />
  <SectionHeading section-title="The Complete Architectural Visualization Toolkit" description="3D Modeling,  Realtime Rendering,  Virtual Reality" class="lg:pb-32 sm:pb-24 pb-16" />
  
  <CTA1 />

  <SectionHeading section-title="Workflow" description="" class="" />
  <TimelineUI />

  
  <SectionHeading section-title="Product Suite" description="" class="pt-32 -mt-20 sm:-mt-0" />
  <Studio1 id="StudioSection" />
  <Stitch id="StitchSection" />
  <Spaces2 id="SpacesSection" />

   <SectionHeading section-title="Usecases" class="md:pt-32 pt-16" description="" />
  <UseCases1 />
  <SectionHeading id="Showcase" section-title="Showcase" class="" description="" />
  <Showcase />

  <SectionHeading section-title="Technology" class="" description="Built with the power of Unreal Engine. Made faster with NVIDIA's Deep Learning Super Sampling (DLSS)." />
  <Technology1 />

  <CTA2 />

  <SectionHeading id="FAQ" section-title="Frequently Asked Questions" description="" />
  <FAQ />
</template>

<route lang="yaml">
name: home
meta:
  layout: home
</route>
