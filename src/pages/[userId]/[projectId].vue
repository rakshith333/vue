<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  message: String,
  userId: {
    type: String,
    required: true,
  },
  projectId: {
    type: String,
    required: true,
  },
})

const router = useRouter()
const { t } = useI18n()
</script>

<template>
<Gutter>
  <div class="">
    <!-- <p class="text-white my-20">
      Hello there,  {{ props.userId }} and ur project is {{ props.projectId}}.
    </p> -->
    <div id="test1" class="content-center my-20 aspect-video">
        <ClientOnly id="test1">
            <!-- <Webviewer user-id=user1 project-id=project1 start-scene="0" start-hotspot="h0"/> -->
            <Webviewer v-bind="{ 'user-id':props.userId, 'project-id': props.projectId, 'start-scene':'0', 'start-hotspot':'Hotspot0'  }"/>
            
        </ClientOnly>
    </div>
  </div>
</Gutter>
</template>

<style scoped>
  #test1{
    --targetwidth: 100vw;
    height: calc( ( (var(--targetwidth) / 12 * 10) * 0.5625) );
    width:100%;
  }
</style>

<route lang="yaml">
name: userId
meta:
  layout: home
</route>