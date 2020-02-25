<template>
    <div>
        <Errors :errors="errors" />
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
                    <v-stepper-content step="1">
                        <h1 class="title mb-2 accent--text">Choose an action:</h1>
                        <ChooseAction
                            v-model="radioAction"
                            :allServices="allServices"
                            :userServices="services"
                            :color="$vuetify.theme.themes[theme].background"
                        />
                        <v-row class="justify-center">
                            <v-btn
                                @click="nextStep(1)"
                                color="primary"
                            >
                                Continue
                            </v-btn>
                        </v-row>
                    </v-stepper-content>
                    <v-stepper-content step="2">
                        <h1 class="title mb-2  accent--text">Choose a reaction:</h1>
                        <ChooseReaction
                            v-model="radioReaction"
                            :allServices="allServices"
                            :userServices="services"
                            :color="$vuetify.theme.themes[theme].background"
                        />
                        <v-row class="justify-center">
                            <v-btn
                                @click="previousStep(2)"
                                class="mx-3"
                                color="white primary--text"
                            >
                                Back
                            </v-btn>
                            <v-btn
                                @click="nextStep(2)"
                                class="mx-3"
                                color="primary"
                            >
                                Continue
                            </v-btn>
                        </v-row>
                    </v-stepper-content>
                    <v-stepper-content step="3">
                        <h1 class="title mb-2" dark>Configure your area:</h1>
                        <v-card
                            :color="$vuetify.theme.themes[theme].background"
                            class="mb-12 scrollable"
                            height="50vh"
                        >
                            <v-container fluid>
                                <h1 class="subtitle-2 mb-2">Global configuration:</h1>
                                <v-form v-model="areaForm">
                                    <v-text-field
                                        v-model="areaTitle"
                                        :rules="[x => !!x || 'Area name is required.']"
                                        :dark="theme === 'dark'"
                                        color="primary"
                                        required
                                        label="Area name"
                                        outlined
                                    />
                                </v-form>
                                <h1 class="subtitle-2 mb-2">Selected action configuration:</h1>
                                <ActionConfig
                                    v-if="selectedAction"
                                    v-model="actionConfig"
                                    :action="selectedAction.action"
                                    :service="selectedAction.service"
                                />
                                <h1 class="subtitle-2 mb-2">Selected reaction configuration:</h1>
                                <ReactionConfig
                                    v-if="selectedReaction"
                                    v-model="reactionConfig"
                                    :reaction="selectedReaction.reaction"
                                    :service="selectedReaction.service"
                                />
                            </v-container>
                        </v-card>
                        <v-row class="justify-center">
                            <v-btn
                                @click="previousStep(3)"
                                class="mx-3"
                                color="white primary--text"
                            >
                                Back
                            </v-btn>
                            <v-btn
                                @click="newArea"
                                :disabled="!actionConfig || !reactionConfig || !areaForm"
                                class="mx-3"
                                color="primary"
                            >
                                Create Area
                                <v-icon right>mdi-plus-circle</v-icon>
                            </v-btn>
                        </v-row>
                    </v-stepper-content>
                </v-stepper-items>
            </template>
        </v-stepper>
    </div>
</template>

<script>
 import Errors from '../components/Errors.vue';
 import ChooseReaction from '../components/AreaConfig/ChooseReaction.vue';
 import ChooseAction from '../components/AreaConfig/ChooseAction.vue';
 import ActionConfig from '../components/AreaConfig/ActionConfig.vue';
 import ReactionConfig from '../components/AreaConfig/ReactionConfig.vue';

 export default {
     components: {
         ChooseReaction,
         ChooseAction,
         ActionConfig,
         ReactionConfig,
         Errors
     },
     data () {
         return {
             title: 'Create a new area',
             stepper: 1,
             steps: 3,
             vertical: false,
             altLabels: false,
             editable: true,
             radioAction: null,
             radioReaction: null,
             actionForm: false,
             reactionForm: false,
             areaForm: false,
             actionConfig: {},
             reactionConfig: {},
             areaTitle: '',
             errors: []
         };
     },

     computed: {
         theme () {
             return this.$vuetify.theme.dark ? 'dark' : 'light';
         },

         services () {
             return this.$store.state.user.services;
         },

         allServices () {
             return this.$store.state.services;
         },

         selectedAction () {
             if (!this.radioAction) {
                 return null;
             }
             const data = this.radioAction.split('-');

             return {
                 service: this.allServices[data[0]],
                 action: this.allServices[data[0]].actions.find(a => a.name === data[1])
             };
         },

         selectedReaction () {
             if (!this.radioReaction) {
                 return null;
             }
             const data = this.radioReaction.split('-');

             return {
                 service: this.allServices[data[0]],
                 reaction: this.allServices[data[0]].reactions.find(a => a.name === data[1])
             };
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
         async newArea () {
             const area = {
                 name: this.areaTitle,
                 action: {
                     name: this.selectedAction.action.name,
                     params: this.actionConfig
                 },
                 reaction: {
                     name: this.selectedReaction.reaction.name,
                     params: this.reactionConfig
                 }
             };

             try {
                 await this.$store.dispatch('user/addArea', area);
                 this.$store.dispatch('messages/setSuccess', {
                     message: `${area.name} successfully added !`,
                     icon: 'mdi-vector-square'
                 });
                 this.$router.push('/');
             } catch (e) {
                 this.errors.push({ message: e.response.data.message });
             }
         },

         onInput (val) {
             this.steps = parseInt(val);
         },

         nextStep (n) {
             if (n === this.steps) {
                 this.stepper = 1;
             } else {
                 this.stepper = n + 1;
             }
         },

         previousStep (n) {
             if (n === 0) {
                 this.stepper = this.steps;
             } else {
                 this.stepper = n - 1;
             }
         }
     }
 };
</script>
