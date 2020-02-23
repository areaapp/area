<template>
    <v-card
        :color="service.background"
        class="mb-4"
    >
        <v-card-title>
            <span
                :style="{ color: service.foreground }"
            >
                {{ action.displayName }} - Configuration
            </span>
            <v-chip
                x-small
                class="mx-4"
                :color="service.foreground"
                :text-color="service.background"
            >
                action
            </v-chip>
            <v-spacer></v-spacer>
            <v-icon :color="service.foreground" right>mdi-{{ service.iconName }}</v-icon>
        </v-card-title>
        <v-card-text>
            <v-form v-model="form">
                <v-col>
                    <div v-for="(type, key) in action.params">
                        <v-combobox
                            v-if="type === 'Array'"
                            :label="key"
                            v-model="config[key]"
                            multiple
                            chips
                            outlined
                            required
                            :rules="[x => !!x || `${key} is required.`]"
                            :color="service.foreground"
                            dark
                        >
                            <template v-slot:selection="data">
                                <v-chip
                                    :key="data.item"
                                    v-bind="data.attrs"
                                    color="secondary"
                                >
                                    <v-avatar
                                        left
                                        :text-color="service.foreground"
                                        :color="service.background"
                                        v-text="data.item.slice(0, 1).toUpperCase()"
                                    ></v-avatar>
                                    {{ data.item }}
                                </v-chip>
                            </template>
                        </v-combobox>
                        <v-textarea
                            v-else
                            clearable
                            :label="key"
                            v-model="config[key]"
                            outlined
                            auto-grow
                            rows="1"
                            required
                            :rules="[x => !!x || `${key} is required.`]"
                            :color="service.foreground"
                            dark
                        />
                    </div>
                </v-col>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
 export default {
     props: [
         'value',
         'service',
         'action'
     ],

     data () {
         return {
             form: false,
             config: this.value || {}
         };
     },

     watch: {
         form () {
             if (this.form) {
                 return this.$emit('input', this.config);
             }
         }
     }
 }
</script>
