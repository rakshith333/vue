<template>
  <Gutter class="">
    <div id="Studio" class="pb-12 xl:pb-24 pb-8 xl:pt-16  sm:my-0 my-6 grid grid-cols-8 items-center">
      <div class="w-full shadow-2xl col-span-8 lg:col-span-5 px-0 order-first lg:order-last">
        <img class="w-full lazyload" src="../../public/showcasepics/StudioUI.webp" alt="" srcset="" />
      </div>
      <div class="grid w-full h-full self-center content-center col-span-8 lg:col-span-3">
        <div class="border-black lg:(py-8 px-8) py-4">
          <p class="lg:text-4xl md:text-3xl text-2xl text-center text-gray-200 dark:text-gray-200">
            RENDERPUB <span class="font-bold text-our-blue">STUDIO</span>
          </p>
          <p class="md:text-md xl:text-lg text-base md:pt-4 pt-2 text-center text-gray-200 dark:text-gray-200">
            <span class="font-bold ">Realtime ray traced renderer </span> with an extensive library of render ready objects, materials, decals, visual effects and all the tools you need to create high fidelity visuals quickly.
          </p>
          <!-- <router-link to="/Studio" @click="scrollToTop"> -->
            <div class="flex mb-6 md:mb-8 md:mb-0 mt-4">
              <button id="StudioPageButton" class="mx-auto w-1/2 focus:outline-none hover:ring-2 hover:ring-our-blue bg-our-blue rounded text-gray-200 px-4 py-2 xl:px-4 xl:py-4 font-bold text-base md:text-lg">
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
  left: 105%;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>