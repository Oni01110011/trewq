<template>
  <div>
    <v-card flat>
      <v-card-title class="d-flex align-center px-0 pb-4">
        <v-icon icon="mdi-map-marker" class="mr-2" size="small" color="primary"></v-icon>
        <span class="text-h6">Box Position Records</span>
        <v-spacer></v-spacer>
        <v-btn
          color="secondary"
          variant="outlined"
          prepend-icon="mdi-view-column"
          class="mr-2"
          @click="attributesDialog = true"
        >
          Attributes
        </v-btn>
        <v-chip color="primary" variant="outlined" size="small">
          {{ boxpos?.length || 0 }} Total
        </v-chip>
      </v-card-title>
      
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Search box positions..."
        variant="outlined"
        density="compact"
        hide-details
        clearable
        class="mb-4"
      ></v-text-field>

      <v-data-table
        v-if="boxpos"
        v-model:items-per-page="itemsPerPage"
        :headers="visibleHeaders"
        :items="boxpos"
        :search="search"
        item-value="id.bposId"
        class="elevation-0"
        hover
        density="comfortable"
      >
        <template v-slot:[`item.dateExported`]="{ item }">
          <span class="text-caption">{{ formatDate(item.dateExported) }}</span>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog zur Auswahl sichtbarer Attribute/Spalten -->
    <v-dialog v-model="attributesDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Select attributes</v-card-title>
        <v-card-text>
          <div class="text-caption mb-2">
            Choose which columns should be visible in the table.
          </div>
          <v-checkbox
            v-for="header in selectableHeaders"
            :key="header.key"
            v-model="visibleHeaderKeys"
            :label="header.title"
            :value="header.key"
            density="compact"
            hide-details
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="attributesDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import getBoxpos from '../services/getBoxpos'

export default {
  setup() {
    const { boxpos, error, load } = getBoxpos()
    const itemsPerPage = ref(10)
    const search = ref('')

    // Spalten-/Attributsteuerung
    const allHeaders = [
      { title: 'Position ID', align: 'start', key: 'id.bposId', width: 120 },
      { title: 'Box ID', align: 'start', key: 'id.bId', width: 120 },
      { title: 'Box Name', align: 'start', key: 'b.name' },
      { title: 'Date Exported', align: 'start', key: 'dateExported', width: 180 },
    ]

    const visibleHeaderKeys = ref(
      allHeaders.map(h => h.key)
    )

    const visibleHeaders = computed(() =>
      allHeaders.filter(h => visibleHeaderKeys.value.includes(h.key))
    )

    const selectableHeaders = allHeaders
    const attributesDialog = ref(false)

    load()

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    return {
      boxpos,
      error,
      itemsPerPage,
      search,
      formatDate,
      allHeaders,
      visibleHeaders,
      visibleHeaderKeys,
      selectableHeaders,
      attributesDialog,
    }
  },
}
</script>
