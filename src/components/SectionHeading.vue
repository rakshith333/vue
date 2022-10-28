<template>
  <Gutter class="">
    <div class="flex flex-col flex-wrap relative w-full xl:py-12 pt-6 justify-center content-center items-center text-gray-200 dark:text-gray-200 lg:text-5xl md:text-4xl text-3xl leading-normal tracking-wide text-center font-bold">
      <div class="">
        <p class="animate__animated animate__heartBeat animate__delay-2s animate__slow animate__repeat-infinite ">
          {{ sectionTitle }}
        </p>

        <p class="w-full text-gray-100 my-2 md:my-4 font-light lg:text-xl md:text-lg text-lg dark:text-gray-200">
          {{ description }}
        </p>
      </div>
      <!-- <hr class="lg:w-1/4 md:w-2/5 w-3/4 my-2 border border-gray-200"> -->
    </div>
  </Gutter>
</template>

<script lang=ts>
export default {
  props: {
    sectionTitle: {
      type: String,
      required: true,
      default: ' ',
    },
    description: {
      type: String,
      required: false,
      default: ' ',
    },
  },
  data() {
    return {
    }
  },
}
</script>

<style scoped>
  .break {
  flex-basis: 100%;
  height: 0;
}
</style>
