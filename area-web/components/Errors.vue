<template>
    <v-layout column>
        <v-alert v-for="(error, i) in errors" :key="i" type="error" dismissible>
            {{ error.message }}
        </v-alert>
    </v-layout>
</template>

<script>
 export default {
     props: ['errors']
 };
</script>
