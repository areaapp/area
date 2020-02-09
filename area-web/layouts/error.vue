<template>
    <v-app
        :style="{ background: $vuetify.theme.themes[theme].background }"
        class="text-center"
    >
        <h1 v-if="error.statusCode === 404">
            {{ pageNotFound }}
        </h1>
        <h1 v-else>
            {{ otherError }}
        </h1>
        <NuxtLink to="/" class="link-light">
            Home page
        </NuxtLink>
    </v-app>
</template>

<script>
 export default {
     layout: 'empty',
     props: {
         error: {
             type: Object,
             default: null
         }
     },

     head () {
         const title =
             this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
         return {
             title
         };
     },

     data () {
         return {
             pageNotFound: '404 Not Found',
             otherError: 'An error occurred'
         };
     },

     computed: {
         theme () {
             return this.$vuetify.theme.dark ? 'dark' : 'light';
         }
     }
 };
</script>

<style scoped>
 h1 {
     font-size: 20px;
 }
</style>
