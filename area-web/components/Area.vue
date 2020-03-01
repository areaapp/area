<template>
    <div>
        <v-col align="center">
            <v-row style="max-width: 270px;" class="align-center">
                <h2
                    class="subtitle-2 text-truncate d-inline-block"
                    style="max-width: 200px;"
                >
                        {{ title }}
                </h2>
                <v-spacer></v-spacer>
                <v-tooltip
                    bottom
                    style="z-index: 20"
                >
                    <template v-slot:activator="{ on }">
                        <v-btn
                            v-on="on"
                            v-on:click="editArea = true"
                            icon
                        >
                            <v-icon>mdi-settings</v-icon>
                        </v-btn>
                    </template>
                    <span>Area settings</span>
                </v-tooltip>
            </v-row>
            <slot name="action"></slot>
            <slot name="reaction"></slot>
            <p class="caption" v-if="lastExecution">
                Last execution: {{ execDate }}
            </p>
        </v-col>
        <v-bottom-sheet v-model="editArea">
            <v-sheet
                :style="{ background: $vuetify.theme.themes[theme].background }"
                class="text-center pa-5"
                height="60vh"
            >
                <v-container class="d-flex flex-column">
                    <h1 class="mb-6">Area "{{ title }}" settings</h1>
                    <Errors :errors="errors"/>
                    <v-col class="align-center">
                        <h3 class="subtitle my-2">Global configuration</h3>
                        <v-form v-model="areaForm" class="pa-4">
                            <v-text-field
                                v-model="areaTitle"
                                :rules="[x => !!x || 'Area name is required.']"
                                :dark="theme === 'dark'"
                                color="primary"
                                required
                                label="Area name"
                                outlined
                            />
                            <v-btn
                                color="primary"
                                class="ma-4"
                                v-on:click="updateAreaName()"
                            >
                                Update<v-icon right>mdi-refresh-circle</v-icon>
                            </v-btn>
                        </v-form>
                    </v-col>
                    <v-divider></v-divider>
                    <v-col class="align-center">
                        <h3 class="subtitle my-2">Dangerous zone</h3>
                        <v-btn
                            color="error"
                            class="ma-4"
                            v-on:click="deleteArea"
                        >
                            Delete this area<v-icon right>mdi-delete</v-icon>
                        </v-btn>
                    </v-col>
                </v-container>
            </v-sheet>
        </v-bottom-sheet>
    </div>
</template>

<script>
 import Errors from './Errors.vue';

 export default {
     components: {
         Errors
     },

     props: [
         'id',
         'title',
         'lastExecution',
         'theme',
         'action',
         'reaction'
     ],

     data () {
         return {
             editArea: false,
             areaForm: false,
             areaTitle: '',
             errors: []
         };
     },

     mounted () {
         this.areaTitle = this.title;
     },

     methods: {
         async updateAreaName () {
             try {
                 await this.$store.dispatch('user/updateArea', {
                     id: this.id,
                     name: this.areaTitle,
                     reaction_args: this.reaction.args,
                     action_args: this.action.args
                 });
                 this.$store.dispatch('messages/setSuccess', {
                     message: `${this.areaTitle} successfully updated !`,
                     icon: 'mdi-vector-square'
                 });
                 this.editArea = false;
             } catch (e) {
                 this.errors.push({ message: e.response.data.message });
             }
         },

         async deleteArea () {
             try {
                 await this.$store.dispatch('user/deleteArea', this.id);
                 this.$store.dispatch('messages/setSuccess', {
                     message: `${this.title} successfully deleted !`,
                     icon: 'mdi-vector-square'
                 });
                 this.editArea = false;
             } catch (e) {
                 console.log(e);
                 this.errors.push({ message: e.response.data.message });
             }
         }
     },

     computed: {
         execDate () {
             const date = new Date(this.lastExecution);
             return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`;
         }
     }

 }
</script>
