<template>
  <div id="container">
    <slot></slot>

    <transition name="fade">
      <div v-show="scY > 100" id="pagetop" class="fixed block bg-transparent z-30 right-4 bottom-12 svg-container rounded-full border-2 border-white" @click="toTop">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          stroke-width="1.5"
          stroke-linecap="square"
          stroke-linejoin="arcs"
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </div>
    </transition>
  </div>
</template>
<script>
export default ({
  el: '#app',
  data() {
    return {
      scTimer: 0,
      scY: 0,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      if (this.scTimer) return
      this.scTimer = setTimeout(() => {
        this.scY = window.scrollY
        clearTimeout(this.scTimer)
        this.scTimer = 0
      }, 100)
    },
    toTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
  },
})
</script>
<style scoped>
#pagetop:hover {
  cursor: pointer;
}
.svg-container {
  width: 1.7em;
  @media (min-width: 640px) {
    width: 2.25em
  }
   @media (min-width: 1024px) {
    width: 2.6em
  }
}
</style>
