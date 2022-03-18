<template>

    <!-- <div id="Spaces" class="py-12 xl:py-24 sm:mt-0 mt-10 grid grid-cols-12 items-center">
      <div id="test" class="w-full shadow-2xl col-span-12 px-0"> -->
        <!-- <img class="w-full lazyload" src="../../public/StitchShot.jpg" alt="" srcset="" /> -->
        <ClientOnly>
          <SpacesSection id="Spaces"/>
        </ClientOnly>
      <!-- </div>
    </div> -->
    
</template>

<script lang=ts>
export default {
  name: 'Spaces',
  components: { },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style scoped>
@media (max-width: 1024px) {
  #test{
    --targetwidth: 100vw;
    height: calc( ( (var(--targetwidth) / 12 * 10) * 0.5625) );
    width:100%;

  }
}

@media (min-width: 1024px){
  #test{
    --targetwidth: 100vw;
    height: calc( ( (var(--targetwidth) / 12 * 6.25) * 0.5625) );
    width:100%;
  }
}
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
