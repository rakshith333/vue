<template>
  <Gutter class=""  @click="closer()">
    <div id="inlargeScreen" class="xl:pb-24 pb-12 relative">
      <div id="showcaseholder" class="showcasecontainer grid grid-rows-4 grid-flow-col justify-around border-black" style="z-index:0">
        <img
          data-aos="fade-up"
          data-aos-anchor-placement="center-bottom"
          src="../../public/showcase/CV.webp"
          class="border-red-500 lazyload w-full h-full hover:cursor-pointer"
          style="width:30vw; height:15vw; padding:4px; "
          alt="showcase image"
          srcset=""
          @click="popover($event)"
          @mouseover="mouseover($event)"
          @mouseleave="mouseleave($event)"
        />
        <img
          data-aos="fade-up"
          data-aos-anchor-placement="center-bottom"
          src="../../public/NEWRENDERS/tables.0085.webp"
          class="border-red-500 lazyload hover:cursor-pointer"
          style="width:30vw; height:15vw; padding:4px;"
          alt="showcase image"
          srcset=""
          @click="popover($event)"
          @mouseover="mouseover($event)"
          @mouseleave="mouseleave($event)"
        />
        <img
          data-aos="fade-up"
          data-aos-anchor-placement="center-bottom"
          src="../../public/NEWRENDERS/DORM555.webp"
          class="row-span-2 border-blue-500 lazyload object-cover hover:cursor-pointer"
          style="width:30vw; height:30vw; padding:4px;"
          alt="showcase image"
          srcset=""
          @click="popover($event)"
          @mouseover="mouseover($event)"
          @mouseleave="mouseleave($event)"
        />
        <img
          data-aos="fade-up"
          data-aos-anchor-placement="center-bottom"
          src="../../public/NEWRENDERS/housesketchup.0085.webp"
          class="border-red-500 h-full w-full lazyload hover:cursor-pointer"
          style="width:30vw; height:15vw; padding:4px;"
          alt="showcase image"
          srcset=""
          @click="popover($event)"
          @mouseover="mouseover($event)"
          @mouseleave="mouseleave($event)"
        />
        <img
          data-aos="fade-up"
          data-aos-anchor-placement="center-bottom"
          src="../../public/showcase/Glass_B_2.webp"
          class="border-red-500 h-full w-full lazyload hover:cursor-pointer"
          style="width:30vw; height:15vw; padding:4px;"
          alt="showcase image"
          srcset=""
          @click="popover($event)"
          @mouseover="mouseover($event)"
          @mouseleave="mouseleave($event)"
        />
        <img
          data-aos="fade-up"
          data-aos-anchor-placement="center-bottom"
          src="../../public/NEWRENDERS/highresscreenshot00128.webp"
          class="border-red-500 lazyload hover:cursor-pointer"
          style="width:30vw; height:15vw; padding:4px;"
          alt="showcase image"
          srcset=""
          @click="popover($event)"
          @mouseover="mouseover($event)"
          @mouseleave="mouseleave($event)"
        />
        <img
          data-aos="fade-up"
          data-aos-anchor-placement="center-bottom"
          src="../../public/NEWRENDERS/room.0087.2.webp"
          class="border-red-500 lazyload hover:cursor-pointer"
          style="width:30vw; height:15vw; padding:4px;"
          alt="showcase image"
          srcset=""
          @click="popover($event)"
          @mouseover="mouseover($event)"
          @mouseleave="mouseleave($event)"
        />
        <img
          data-aos="fade-up"
          data-aos-anchor-placement="center-bottom"
          src="../../public/NEWRENDERS/singlesofas.0085.webp"
          class="row-span-2 border-blue-500 w-full h-full lazyload object-cover hover:cursor-pointer"
          style="width:30vw; height:30vw; padding:4px;"
          alt="showcase image"
          srcset=""
          @click="popover($event)"
          @mouseover="mouseover($event)"
          @mouseleave="mouseleave($event)"
        />
        <img
          data-aos="fade-up"
          data-aos-anchor-placement="center-bottom"
          src="../../public/NEWRENDERS/cs_modern_living_room_sequence.0002.webp"
          class="border-red-500 lazyload hover:cursor-pointer"
          style="width:30vw; height:15vw; padding:4px;"
          alt="showcase image"
          srcset=""
          @click="popover($event)"
          @mouseover="mouseover($event)"
          @mouseleave="mouseleave($event)"
        />
        <img
          data-aos="fade-up"
          data-aos-anchor-placement="center-bottom"
          src="../../public/showcase/MV.webp"
          class="border-red-500 lazyload hover:cursor-pointer"
          style="width:30vw; height:15vw; padding:4px;"
          alt="showcase image"
          srcset=""
          @click="popover($event)"
          @mouseover="mouseover($event)"
          @mouseleave="mouseleave($event)"
        />
      </div>
      <div id="showcasepopup" class="">
        <!-- <div class="button cursor-pointer float-right pb-2" @click="closer()">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#FFFFFF" stroke-width="5" d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" /></svg>
        </div> -->
        <img class="object-contain" :src="image" alt="">
      </div>
    </div>
  </Gutter>
  <div id="insmallScreen" @scroll="changeOp()">
    <div id="showcaseholder2" class="showcasecontainer justify-around border-black pt-6 pb-12" style="z-index:0">
      <img
        src="../../public/showcase/CV.webp"
        class="pic w-full h-full py-1 lazyload"
        style=""
        alt="showcase image"
        srcset=""
        @click="popovermobile($event)"
      />
      <img
        src="../../public/NEWRENDERS/tables.0085.webp"
        class="pic w-full h-full py-1 lazyload"
        style=""
        alt="showcase image"
        srcset=""
        @click="popovermobile($event)"
      />
      <img
        src="../../public/NEWRENDERS/DORM555.webp"
        class="pic w-full h-full py-1 lazyload"
        style=""
        alt="showcase image"
        srcset=""
        @click="popovermobile($event)"
      />
      <img
        src="../../public/NEWRENDERS/housesketchup.0085.webp"
        class="pic w-full h-full py-1 lazyload"
        style=""
        alt="showcase image"
        srcset=""
        @click="popovermobile($event)"
      />
      <img
        src="../../public/showcase/Glass_B_2.webp"
        class="pic w-full h-full py-1 lazyload"
        style=""
        alt="showcase image"
        srcset=""
        @click="popovermobile($event)"
      />
      <img
        src="../../public/NEWRENDERS/highresscreenshot00128.webp"
        class="pic w-full h-full py-1 lazyload"
        style=""
        alt="showcase image"
        srcset=""
        @click="popovermobile($event)"
      />
      <img
        src="../../public/NEWRENDERS/room.0087.2.webp"
        class="pic w-full h-full py-1 lazyload"
        style=""
        alt="showcase image"
        srcset=""
        @click="popovermobile($event)"
      />
      <img
        src="../../public/NEWRENDERS/singlesofas.0085.webp"
        class="pic w-full h-full py-1 lazyload"
        style=""
        alt="showcase image"
        srcset=""
        @click="popovermobile($event)"
      />
      <img
        src="../../public/NEWRENDERS/cs_modern_living_room_sequence.0002.webp"
        class="pic w-full h-full py-1 lazyload"
        style=""
        alt="showcase image"
        srcset=""
        @click="popovermobile($event)"
      />
      <img
        src="../../public/showcase/MV.webp"
        class="pic w-full h-full py-1 lazyload"
        style=""
        alt="showcase image"
        srcset=""
        @click="popovermobile($event)"
      />
    </div>
  </div>
</template>

<script lang=ts>

export default ({
  data() {
    return {
      image: null,
      popup: false
    }
  },
  mounted() {
    document.addEventListener('scroll', this.changeOp)
  },
  unmounted() {
    document.removeEventListener('scroll', this.changeOp)
  },
  methods: {
    mouseover(event) {
      const ele = event.currentTarget
      ele.style.opacity = 0.9
    },
    mouseleave(event) {
      const ele = event.currentTarget
      ele.style.opacity = 1
    },
    popover(event) {
      if (this.popup === false) {
        document.getElementById('showcasepopup').childNodes[0].className = "image";
        document.getElementById('showcaseholder').style.opacity = '0.2'
        document.getElementById('showcasepopup').style.zIndex = '5'
        document.getElementById('showcasepopup').style.opacity = '1'
        document.getElementById('pagetop').style.display = "none"
        this.image = event.currentTarget.getAttribute('src')
        this.popup = true
        event.stopPropagation()
      }
      else {
        document.getElementById('showcasepopup').childNodes[0].className = "image";
        document.getElementById('showcaseholder').style.opacity = '1'
        document.getElementById('showcasepopup').style.zIndex = '-1'
        document.getElementById('showcasepopup').style.opacity = '0'
        document.getElementById('pagetop').style.display = "block"
        // this.image = ""
        this.popup = false
        event.stopPropagation()
      }
    },
    closer() {
      document.getElementById('showcaseholder').style.opacity = '1'
      document.getElementById('showcasepopup').style.zIndex = '-1'
      document.getElementById('showcasepopup').style.opacity = '0'
      document.getElementById('pagetop').style.display = "block"
      // this.image = ""
      this.popup = false
    },
    popovermobile(event) {
      const eles = document.getElementsByClassName('pic')
      for (const e of eles)

        e.style.opacity = 0.5

      const ele = event.currentTarget
      ele.style.opacity = 1
    },
    changeOp() {
      const eles = document.getElementsByClassName('pic')
      for (const e of eles)

        e.style.opacity = 1
    },
  }
})
</script>

<style scoped>
#showcasepopup{
  position:absolute;
  top: 15%;
  left: 0%;
  padding:0% 4% 5% 4%;
  /* top: 45%;
  left: 50%; */
  /* -ms-transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translate(-50%,-50%);
  transform: translate(-50%,-50%); */
  opacity: 0;
  z-index: 5;
  transition: .5s ease-in-out;
  
}
.image {
  --targetwidth: 100vw;
    height: calc( ( (var(--targetwidth) / 12 * 9) * 0.5625) );
    width:calc( (var(--targetwidth) / 12 * 9) );
}
@media screen and (max-width:600px) {
  #inlargeScreen{
    display: none;
  }
  #insmallScreen{
    display:block;
  }
}
@media screen and (min-width:600px) {
  #inlargeScreen{
    display: block;
  }
  #insmallScreen{
    display:none;
  }
}
</style>
