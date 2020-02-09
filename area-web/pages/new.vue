<template>
    <div>
        <v-stepper
            v-model="stepper"
            :vertical="vertical"
            :alt-labels="altLabels"
            class="secondary"
        >
            <template>
                <v-stepper-header>
                    <template v-for="n in steps">
                        <v-stepper-step
                            :key="`${n}-step`"
                            :complete="stepper > n"
                            :step="n"
                        >
                            <span class="accent--text">Step {{ n }}</span>
                        </v-stepper-step>

                        <v-divider
                            v-if="n !== steps"
                            :key="n"
                            class="tertiary"
                        />
                    </template>
                </v-stepper-header>

                <v-stepper-items>
                    <v-stepper-content
                        v-for="n in steps"
                        :key="`${n}-content`"
                        :step="n"
                    >
                        <v-card
                            class="mb-12"
                            color="grey lighten-1"
                            height="200px"
                        />

                        <v-btn
                            @click="nextStep(n)"
                            color="primary"
                        >
                            Continue
                        </v-btn>

                        <v-btn text dark>Cancel</v-btn>
                    </v-stepper-content>
                </v-stepper-items>
            </template>
        </v-stepper>
    </div>
</template>

<script>
 export default {
     data () {
         return {
             title: 'Create a new area',
             stepper: 1,
             steps: 2,
             vertical: false,
             altLabels: false,
             editable: true
         };
     },

     computed: {
         theme () {
             return this.$vuetify.theme.dark ? 'dark' : 'light';
         }
     },

     watch: {
         steps (val) {
             if (this.stepper > val) {
                 this.stepper = val;
             }
         },

         vertical () {
             this.stepper = 2;
             requestAnimationFrame(() => { this.stepper = 1; });
         }
     },

     mounted () {
         this.$store.commit('setTitle', this.title);
     },

     methods: {
         onInput (val) {
             this.steps = parseInt(val);
         },

         nextStep (n) {
             if (n === this.steps) {
                 this.stepper = 1;
             } else {
                 this.stepper = n + 1;
             }
         }
     }
 };
</script>
