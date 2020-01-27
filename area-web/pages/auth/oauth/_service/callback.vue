<template>
    <div>
        <h1>{{ service }}</h1>
        <p>Code: {{ code }}</p>
        <p>JWT: {{ jwt }}</p>
    </div>
</template>

<script>

 export default {
     validate ({ params, query, store }) {
         if (!query.code) {
             return false;
         }

         return true;
     },

     data () {
         return {
             code: this.$route.query.code,
             service: this.$route.params.service
         };
     },

     async asyncData ({ $axios, query, params }) {
         const jwt = await $axios.$post('/auth/signin', {
             authCode: query.code,
             service: params.service,
             clientType: 'web'
         });

         return { jwt };
     }
 };
</script>
