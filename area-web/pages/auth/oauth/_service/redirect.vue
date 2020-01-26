<template>
    <div>hello</div>
</template>

<script>
 import config from '../../../../oauth.config.js';

 export default {
     validate ({ params, query, store }) {
         if (!config[params.service]) {
             return false;
         }
         console.log(params);
         console.log(query);
         console.log(config[params.service]);
         return true;
     }
 };
</script>
