<template>
    <div>Redirecting</div>
</template>

<script>
 export default {
     async fetch ({ params, redirect, $axios }) {
         const res = await $axios.$get(`/auth/oauth/authorize_url/${params.service}/web`);
         const redirectUri = decodeURIComponent(res.data);

         console.log(redirectUri);

         redirect(redirectUri);
     }
 };
</script>
