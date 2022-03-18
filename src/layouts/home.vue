<template>
  <div>
    <Navigation style="position:fixed; top:0; width:100%; z-index: 99" />
    <router-view v-bind="$attrs" />
    <ScrollBase />
    <Footer class="bg-gray-100" />
  </div>
</template>
