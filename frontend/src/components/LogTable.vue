<template>
  <div>
    <v-card flat>
      <v-card-title class="d-flex align-center px-0 pb-4">
        <v-icon icon="mdi-file-document-outline" class="mr-2" size="small" color="primary"></v-icon>
        <span class="text-h6">Log Records</span>
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
          {{ logs?.length || 0 }} Total
        </v-chip>
      </v-card-title>
      
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Search logs..."
        variant="outlined"
        density="compact"
        hide-details
        clearable
        class="mb-4"
      ></v-text-field>

      <v-data-table
        v-if="logs"
        v-model:items-per-page="itemsPerPage"
        :headers="visibleHeaders"
        :items="logs"
        :search="search"
        item-value="id"
        class="elevation-0"
        hover
        density="comfortable"
      >
        <template v-slot:[`item.id`]="{ item }">
          <v-chip size="small" color="amber" variant="tonal">
            {{ item.id }}
          </v-chip>
        </template>
        
        <template v-slot:[`item.level`]="{ item }">
          <v-chip 
            size="small" 
            :color="item.level === 'ERROR' ? 'error' : item.level === 'WARN' ? 'warning' : 'info'"
            variant="flat"
          >
            {{ item.level }}
          </v-chip>
        </template>
        
        <template v-slot:[`item.dateCreated`]="{ item }">
          <span class="text-caption">{{ formatDate(item.dateCreated) }}</span>
        </template>
        
        <template v-slot:[`item.dateExported`]="{ item }">
          <span class="text-caption">{{ formatDate(item.dateExported) }}</span>
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

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editedIndex === -1 ? 'New Log' : 'Edit Log' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-select v-model="editedItem.level" :items="['INFO', 'WARN', 'ERROR']" label="Level" required></v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="editedItem.info" label="Info" rows="3"></v-textarea>
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
import logService from '../services/logService'

export default {
  setup() {
    const logs = ref([])
    const error = ref(null)
    const itemsPerPage = ref(10)
    const search = ref('')
    const dialog = ref(false)
    const editedIndex = ref(-1)

    // Spalten-/Attributsteuerung
    const allHeaders = [
      { title: 'Log ID', align: 'start', key: 'id', width: 120 },
      { title: 'Date Created', align: 'start', key: 'dateCreated', width: 180 },
      { title: 'Level', align: 'center', key: 'level', width: 100 },
      { title: 'Info', align: 'start', sortable: false, key: 'info' },
      { title: 'Date Exported', align: 'start', key: 'dateExported', width: 180 },
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
    const editedItem = ref({ id: null, dateCreated: null, level: 'INFO', info: '', dateExported: null })
    const defaultItem = { id: null, dateCreated: null, level: 'INFO', info: '', dateExported: null }

    const loadLogs = async () => {
      try {
        const response = await logService.getAll()
        logs.value = response.data
      } catch (err) {
        error.value = err.message
      }
    }

    loadLogs()

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
      editedIndex.value = logs.value.indexOf(item)
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
          await logService.update(editedItem.value.id, editedItem.value)
        } else {
          editedItem.value.dateCreated = new Date().toISOString()
          await logService.create(editedItem.value)
        }
        await loadLogs()
        closeDialog()
      } catch (err) {
        error.value = err.message
      }
    }

    const deleteItem = async (item) => {
      if (confirm('Are you sure you want to delete this item?')) {
        try {
          await logService.delete(item.id)
          await loadLogs()
        } catch (err) {
          error.value = err.message
        }
      }
    }

    return {
      logs,
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
