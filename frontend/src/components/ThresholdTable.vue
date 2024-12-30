<template>
  <div>
    <v-card flat>
      <v-card-title class="d-flex align-center px-0 pb-4">
        <v-icon icon="mdi-gauge" class="mr-2" size="small" color="primary"></v-icon>
        <span class="text-h6">Threshold Records</span>
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
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog" class="mr-2">
          Add New
        </v-btn>
        <v-chip color="primary" variant="outlined" size="small">
          {{ thresholds?.length || 0 }} Total
        </v-chip>
      </v-card-title>
      
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Search thresholds..."
        variant="outlined"
        density="compact"
        hide-details
        clearable
        class="mb-4"
      ></v-text-field>

      <v-data-table
        v-if="thresholds"
        v-model:items-per-page="itemsPerPage"
        :headers="visibleHeaders"
        :items="thresholds"
        :search="search"
        item-value="thId"
        class="elevation-0"
        hover
        density="comfortable"
      >
        <template v-slot:[`item.thId`]="{ item }">
          <v-chip size="small" color="teal" variant="tonal">
            {{ item.thId }}
          </v-chip>
        </template>
        
        <template v-slot:[`item.dateChanged`]="{ item }">
          <span class="text-caption">{{ formatDate(item.dateChanged) }}</span>
        </template>
        
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon="mdi-pencil" size="small" variant="text" @click="openEditDialog(item)"></v-btn>
          <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="deleteItem(item)"></v-btn>
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

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editedIndex === -1 ? 'New Threshold' : 'Edit Threshold' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editedItem.thId" label="Threshold ID" required></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model.number="editedItem.valueMin" label="Min Value" type="number"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model.number="editedItem.valueMax" label="Max Value" type="number"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="saveItem">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import thresholdService from '../services/thresholdService'

export default {
  setup() {
    const thresholds = ref([])
    const error = ref(null)
    const itemsPerPage = ref(10)
    const search = ref('')
    const dialog = ref(false)
    const editedIndex = ref(-1)

    // Spalten-/Attributsteuerung
    const allHeaders = [
      { title: 'Threshold ID', align: 'start', key: 'thId', width: 150 },
      { title: 'Min Value', align: 'end', key: 'valueMin' },
      { title: 'Max Value', align: 'end', key: 'valueMax' },
      { title: 'Date Changed', align: 'start', key: 'dateChanged', width: 180 },
      { title: 'Actions', align: 'center', key: 'actions', sortable: false, width: 120 },
    ]

    const visibleHeaderKeys = ref(
      allHeaders
        .filter(h => h.key !== 'actions')
        .map(h => h.key)
    )

    const visibleHeaders = computed(() =>
      allHeaders.filter(h => h.key === 'actions' || visibleHeaderKeys.value.includes(h.key))
    )

    const selectableHeaders = allHeaders.filter(h => h.key !== 'actions')
    const attributesDialog = ref(false)
    const editedItem = ref({ thId: '', valueMin: null, valueMax: null, dateChanged: null })
    const defaultItem = { thId: '', valueMin: null, valueMax: null, dateChanged: null }

    const loadThresholds = async () => {
      try {
        const response = await thresholdService.getAll()
        thresholds.value = response.data
      } catch (err) {
        error.value = err.message
      }
    }

    loadThresholds()

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

    const openCreateDialog = () => {
      editedIndex.value = -1
      editedItem.value = { ...defaultItem }
      dialog.value = true
    }

    const openEditDialog = (item) => {
      editedIndex.value = thresholds.value.indexOf(item)
      editedItem.value = { ...item }
      dialog.value = true
    }

    const closeDialog = () => {
      dialog.value = false
      setTimeout(() => {
        editedItem.value = { ...defaultItem }
        editedIndex.value = -1
      }, 300)
    }

    const saveItem = async () => {
      try {
        if (editedIndex.value > -1) {
          await thresholdService.update(editedItem.value.thId, editedItem.value)
        } else {
          editedItem.value.dateChanged = new Date().toISOString()
          await thresholdService.create(editedItem.value)
        }
        await loadThresholds()
        closeDialog()
      } catch (err) {
        error.value = err.message
      }
    }

    const deleteItem = async (item) => {
      if (confirm('Are you sure you want to delete this item?')) {
        try {
          await thresholdService.delete(item.thId)
          await loadThresholds()
        } catch (err) {
          error.value = err.message
        }
      }
    }

    return {
      thresholds,
      error,
      itemsPerPage,
      search,
      dialog,
      editedIndex,
      editedItem,
      formatDate,
      openCreateDialog,
      openEditDialog,
      closeDialog,
      saveItem,
      deleteItem,
      allHeaders,
      visibleHeaders,
      visibleHeaderKeys,
      selectableHeaders,
      attributesDialog,
    }
  },
}
</script>
