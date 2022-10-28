<template>
  <Gutter class="">
    <div id="Stitch" class="py-12 xl:py-24 grid grid-cols-8 items-center">
      <div class="w-full shadow-2xl col-span-8 lg:col-span-5 px-0 ">
        <img class="w-full lazyload" src="../../public/showcasepics/Stitch.webp" alt="" srcset="" />
      </div>
      <div class="grid w-full h-full self-center content-center col-span-8 lg:col-span-3">
        <div class="border-black lg:(py-8 px-8) py-4">
          <p class="lg:text-4xl md:text-3xl text-2xl text-center text-gray-200 dark:text-gray-200">
            RENDERPUB <span class="font-bold text-our-blue">STITCH</span>
          </p>
          <p class="md:text-md xl:text-lg text-base md:pt-4 pt-2 text-center text-gray-200 dark:text-gray-200">
            Use renders from any third party rendering application to create interactive VR walkthroughs and publish them on the Renderpub Spaces platform.
          </p>
          <!-- <router-link to="/Stitch" @click="scrollToTop"> -->
            <div class="flex mb-6 md:mb-8 md:mb-0 mt-4">
              <button id="StitchPageButton" class="mx-auto w-1/2 focus:outline-none hover:ring-2 hover:ring-our-blue bg-our-blue rounded text-gray-200 px-4 py-2 xl:px-4 xl:py-4 font-bold text-base md:text-lg">
              Coming Soon
              </button>
            </div>
          <!-- </router-link> -->
        </div>
      </div>
      
    </div>
  </Gutter>
</template>

<script lang=ts>
export default {
  name: 'Stitch',
  components: { },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style scoped>
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: rgb(235, 228, 228);
  color: rgb(34, 34, 34);
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  
  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  top: -5px;
  right: 105%;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>