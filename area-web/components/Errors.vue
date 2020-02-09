<template>
    <v-layout column>
        <v-alert v-for="error in errors" :key="error" type="error" dismissible>
            {{ error.message }}
        </v-alert>
    </v-layout>
</template>

<script>
 export default {
     props: ['errors']
 };
</script>
