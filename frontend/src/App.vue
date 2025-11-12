<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      :color="isDark ? 'grey-darken-4' : 'blue-grey-lighten-5'"
      width="280"
    >
      <v-list-item
        class="px-4 py-6"
        :prepend-icon="'mdi-database'"
      >
        <v-list-item-title class="text-h5 font-weight-bold">
          Venlab
        </v-list-item-title>
        <v-list-item-subtitle class="text-caption">
          Database Manager
        </v-list-item-subtitle>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="comfortable" nav class="mt-2">
        <v-list-item
          v-for="item in menuItems"
          :key="item.value"
          :value="item.value"
          :prepend-icon="item.icon"
          :title="item.title"
          :active="tab === item.value"
          @click="tab = item.value"
          rounded="xl"
          class="mx-2"
        >
        </v-list-item>
      </v-list>

      <template #append>
        <div class="pa-4">
          <v-btn
            block
            variant="outlined"
            :prepend-icon="isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'"
            @click="isDark = !isDark"
          >
            {{ isDark ? 'Dark Mode' : 'Light Mode' }}
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar
      :color="isDark ? 'grey-darken-4' : 'blue-grey-darken-3'"
      elevation="2"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      
      <v-toolbar-title class="font-weight-light">
        <v-icon class="mr-2">{{ getCurrentIcon }}</v-icon>
        {{ getCurrentTitle }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-chip
        class="mr-2"
        :color="isDark ? 'green-darken-2' : 'green'"
        variant="flat"
        prepend-icon="mdi-circle-small"
      >
        Connected
      </v-chip>
    </v-app-bar>

    <v-main :class="isDark ? 'bg-grey-darken-3' : 'bg-grey-lighten-4'">
      <v-container fluid class="pa-6">
        <v-window v-model="tab">
          <v-window-item value="thresholds">
            <v-card class="elevation-4" rounded="lg">
              <v-card-text>
                <ThresholdTable />
              </v-card-text>
            </v-card>
          </v-window-item>

          <v-window-item value="samples">
            <v-card class="elevation-4" rounded="lg">
              <v-card-text>
                <SampleTable />
              </v-card-text>
            </v-card>
          </v-window-item>

          <v-window-item value="analysis">
            <v-card class="elevation-4" rounded="lg">
              <v-card-text>
                <AnalysisTable />
              </v-card-text>
            </v-card>
          </v-window-item>

          <v-window-item value="logs">
            <v-card class="elevation-4" rounded="lg">
              <v-card-text>
                <LogTable />
              </v-card-text>
            </v-card>
          </v-window-item>

          <v-window-item value="boxes">
            <v-card class="elevation-4" rounded="lg">
              <v-card-text>
                <BoxTable />
              </v-card-text>
            </v-card>
          </v-window-item>

          <v-window-item value="boxpos">
            <v-card class="elevation-4" rounded="lg">
              <v-card-text>
                <BoxpoTable />
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ref, watch, computed } from 'vue'
import { useTheme } from 'vuetify'
import ThresholdTable from './components/ThresholdTable.vue'
import SampleTable from './components/SampleTable.vue'
import AnalysisTable from './components/AnalysisTable.vue'
import LogTable from './components/LogTable.vue'
import BoxTable from './components/BoxTable.vue'
import BoxpoTable from './components/BoxpoTable.vue'

export default {
  name: 'App',
  components: {
    ThresholdTable,
    SampleTable,
    AnalysisTable,
    LogTable,
    BoxTable,
    BoxpoTable,
  },
  setup() {
    const theme = useTheme()
    const isDark = ref(false)
    const tab = ref('samples')
    const drawer = ref(true)

    const menuItems = ref([
      { title: 'Thresholds', value: 'thresholds', icon: 'mdi-gauge' },
      { title: 'Samples', value: 'samples', icon: 'mdi-test-tube' },
      { title: 'Analysis', value: 'analysis', icon: 'mdi-chart-line' },
      { title: 'Logs', value: 'logs', icon: 'mdi-file-document-outline' },
      { title: 'Boxes', value: 'boxes', icon: 'mdi-package-variant' },
      { title: 'Box Positions', value: 'boxpos', icon: 'mdi-map-marker' },
    ])

    const getCurrentTitle = computed(() => {
      const item = menuItems.value.find(i => i.value === tab.value)
      return item ? item.title : ''
    })

    const getCurrentIcon = computed(() => {
      const item = menuItems.value.find(i => i.value === tab.value)
      return item ? item.icon : ''
    })

    watch(isDark, (newValue) => {
      theme.global.name.value = newValue ? 'dark' : 'light'
    })

    return {
      isDark,
      tab,
      drawer,
      menuItems,
      getCurrentTitle,
      getCurrentIcon,
    }
  },
}
</script>
