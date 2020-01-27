<template>
    <div>Redirecting</div>
</template>

<script>
 export default {
     async asyncData ({ params, redirect, $axios }) {
         const redirectUri = await $axios.$get(`/auth/oauth/authorize_url/${params.service}/web`);

         redirect(redirectUri);
     }
 };
</script>
