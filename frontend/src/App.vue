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
            class="mb-2"
          >
            {{ isDark ? 'Dark Mode' : 'Light Mode' }}
          </v-btn>
          
          <v-btn
            block
            variant="outlined"
            color="primary"
            prepend-icon="mdi-download"
            @click="installPWA"
            :disabled="isInstalled"
          >
            {{ isInstalled ? 'App Installed' : 'Install App' }}
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

      <!-- Login/Logout oben rechts -->
      <v-btn
        v-if="!isAuthenticated"
        variant="outlined"
        color="primary"
        prepend-icon="mdi-login"
        class="mr-2"
        @click="loginDialog = true"
      >
        Login
      </v-btn>

      <v-btn
        v-else
        variant="text"
        color="red"
        prepend-icon="mdi-logout"
        class="mr-2"
        @click="handleLogout"
      >
        Logout ({{ username }})
      </v-btn>

      <v-btn
        v-if="showInstallButton"
        variant="outlined"
        prepend-icon="mdi-download"
        class="mr-2"
        @click="installPWA"
      >
        Install App
      </v-btn>

      <v-chip
        class="mr-2"
        :color="isDark ? 'green-darken-2' : 'green'"
        variant="flat"
        prepend-icon="mdi-circle-small"
      >
        Connected
      </v-chip>
    </v-app-bar>

    <!-- Login Dialog -->
    <v-dialog v-model="loginDialog" persistent max-width="400">
      <v-card>
        <v-card-title class="text-h6">Login</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="loginUsername"
            label="Benutzername"
            autocomplete="username"
          />
          <v-text-field
            v-model="loginPassword"
            label="Passwort"
            type="password"
            autocomplete="current-password"
          />
          <div v-if="loginError" class="text-error text-caption mt-2">
            {{ loginError }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="handleLogin">
            Login
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-main :class="isDark ? 'bg-grey-darken-3' : 'bg-grey-lighten-4'">
      <v-container fluid class="pa-6">
        <div v-if="!isAuthenticated" class="text-center py-16">
          Bitte logge dich ein, um die Daten zu sehen.
        </div>
        <v-window v-else v-model="tab">
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

          <!-- Box Positions Tab entfernt, Funktionalität jetzt in Box-Ansicht integriert -->
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
import { login as loginApi, logout as logoutApi, isAuthenticated as isAuthFn, getUsername as getStoredUsername } from './services/authService'

export default {
  name: 'App',
  components: {
    ThresholdTable,
    SampleTable,
    AnalysisTable,
    LogTable,
    BoxTable,
  },
  setup() {
    const theme = useTheme()
    const isDark = ref(false)
    const tab = ref('samples')
    const drawer = ref(true)
    const showInstallButton = ref(false)
    const isInstalled = ref(false)
    let deferredPrompt = null

    // Auth-Status
    const isAuthenticated = ref(isAuthFn())
    const username = ref(getStoredUsername() || '')

    // Login Dialog State
    const loginDialog = ref(!isAuthenticated.value)
    const loginUsername = ref('admin')
    const loginPassword = ref('')
    const loginError = ref('')

    const menuItems = ref([
      { title: 'Thresholds', value: 'thresholds', icon: 'mdi-gauge' },
      { title: 'Samples', value: 'samples', icon: 'mdi-test-tube' },
      { title: 'Analysis', value: 'analysis', icon: 'mdi-chart-line' },
      { title: 'Logs', value: 'logs', icon: 'mdi-file-document-outline' },
      { title: 'Boxes', value: 'boxes', icon: 'mdi-package-variant' },
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

    const handleLogin = async () => {
      loginError.value = ''
      try {
        const data = await loginApi(loginUsername.value, loginPassword.value)
        if (data && data.token) {
          isAuthenticated.value = true
          username.value = data.username || loginUsername.value
          loginDialog.value = false
          loginPassword.value = ''
        } else {
          loginError.value = 'Login fehlgeschlagen.'
        }
      } catch (e) {
        loginError.value = 'Benutzername oder Passwort falsch.'
      }
    }

    const handleLogout = () => {
      logoutApi()
      isAuthenticated.value = false
      username.value = ''
      loginDialog.value = true
      tab.value = 'samples'
    }

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      isInstalled.value = true
    }

    // PWA Install functionality
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      deferredPrompt = e
    })

    const installPWA = async () => {
      if (!deferredPrompt) {
        // Show helpful message based on platform
        const userAgent = window.navigator.userAgent.toLowerCase()
        let message = ''
        
        if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
          message = 'Auf iOS:\n1. Tippe auf das Teilen-Symbol\n2. Scrolle runter und wähle "Zum Home-Bildschirm"'
        } else if (userAgent.includes('android')) {
          message = 'Auf Android:\n1. Tippe auf die Menü-Schaltfläche (⋮)\n2. Wähle "Zum Startbildschirm hinzufügen"\n\nOder probiere es in Chrome.'
        } else {
          message = 'Installation auf diesem Gerät/Browser nicht verfügbar.\n\nVerwende Chrome oder Edge für die Installation.'
        }
        
        alert(message)
        return
      }
      
      try {
        // Show the install prompt
        deferredPrompt.prompt()
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice
        console.log(`User response to the install prompt: ${outcome}`)
        if (outcome === 'accepted') {
          isInstalled.value = true
        }
        // Clear the deferredPrompt for reuse
        deferredPrompt = null
      } catch (error) {
        console.error('Install error:', error)
        alert('Installation fehlgeschlagen. Bitte versuche es über das Browser-Menü.')
      }
    }

    // Mark as installed if already installed
    window.addEventListener('appinstalled', () => {
      isInstalled.value = true
      deferredPrompt = null
      console.log('PWA was installed')
    })

    return {
      isDark,
      tab,
      drawer,
      menuItems,
      getCurrentTitle,
      getCurrentIcon,
      showInstallButton,
      installPWA,
      isInstalled,
      // Auth
      isAuthenticated,
      username,
      loginDialog,
      loginUsername,
      loginPassword,
      loginError,
      handleLogin,
      handleLogout,
    }
  },
}
</script>
