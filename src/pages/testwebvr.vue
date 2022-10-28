<template>
  <Gutter class="">
      <div id="test" class="content-center mb-16 mt-20 aspect-video">
        <ClientOnly>
          <Webviewer user-id="user1" project-id="project1" start-scene="0" start-hotspot="Hotspot0" />
        </ClientOnly>
      </div>
  </Gutter>
</template>

<style scoped>
  #test{
    --targetwidth: 100vw;
    height: calc( ( (var(--targetwidth) / 12 * 10) * 0.5625) );
    width:100%;
  }
</style>

<route lang="yaml">
name: testwebvr
meta:
  layout: home
</route>