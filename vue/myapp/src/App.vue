<template>
  <div id="app">
    <p>
      <router-link to="/">Home</router-link>
      <router-link to="/foo">Go to Foo</router-link>
      <router-link to="/bar">GO to bar</router-link>
      <router-link to="/hello/123">GO to hello</router-link>
    </p>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
