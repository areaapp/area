<template>
    <v-hover>
        <template v-slot:default="{ hover }">
            <v-card
                :color="background"
                class="ma-4 pa-2 d-flex flex-column justify-start text-left"
                min-height="270"
                min-width="270"
                max-width="270"
                max-height="270"
            >
                <v-row v-if="slot" class="px-2 mt-n2">
                    <v-spacer />
                    <slot />
                </v-row>
                <v-spacer />
                <v-container fluid>
                    <v-row class="pa-2">
                        <v-chip :color="foreground" :text-color="background" x-small>reaction</v-chip>
                        <v-spacer />
                        <v-icon :color="foreground" right small>mdi-{{ icon }}</v-icon>
                    </v-row>
                    <v-row class="px-2">
                        <span
                            :style="{ color: foreground }"
                            class="subtitle-2 text-left"
                        >
                            {{ title }}
                        </span>
                    </v-row>
                </v-container>
                <v-card-subtitle
                    :style="{ color: foreground }"
                >
                    {{ description }}
                </v-card-subtitle>
                <v-spacer />
                <v-fade-transition>
                    <v-overlay
                        v-if="hover && !nooverlay"
                        absolute
                        color="#000"
                        opacity="0.6"
                    >
                        <v-col align="center">
                            <p class="caption">Reaction settings</p>
                            <v-btn
                                fab
                                color="primary"
                                v-on:click="$emit('settings')"
                            >
                                <v-icon dark>mdi-settings</v-icon>
                            </v-btn>
                        </v-col>
                    </v-overlay>
                </v-fade-transition>
            </v-card>
        </template>
    </v-hover>
</template>

<script>
 export default {
     props: [
         'foreground',
         'background',
         'title',
         'description',
         'icon',
         'nooverlay'
     ],

     computed: {
         slot () {
             return !!this.$slots.default;
         }
     }
 };
</script>
