<template>
  <div>
    <v-card flat>
      <v-card-title class="d-flex align-center px-0 pb-4">
        <v-icon icon="mdi-test-tube" class="mr-2" size="small" color="primary"></v-icon>
        <span class="text-h6">Sample Records</span>
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
          {{ samples?.length || 0 }} Total
        </v-chip>
      </v-card-title>
      
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Search samples..."
        variant="outlined"
        density="compact"
        hide-details
        clearable
        class="mb-4"
      ></v-text-field>

      <v-data-table
        v-if="samples"
        v-model:items-per-page="itemsPerPage"
        :headers="visibleHeaders"
        :items="samples"
        :search="search"
        item-value="sId"
        class="elevation-0"
        hover
        density="comfortable"
      >
        <template v-slot:[`item.sId`]="{ item }">
          <v-chip size="small" color="blue-grey" variant="tonal">
            {{ item.sId }}
          </v-chip>
        </template>
        
        <template v-slot:[`item.sStamp`]="{ item }">
          <span class="text-caption">{{ formatDate(item.sStamp) }}</span>
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
          <span class="text-h5">{{ editedIndex === -1 ? 'New Sample' : 'Edit Sample' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.sId" label="Sample ID" required></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model.number="editedItem.weightNet" label="Net Weight" type="number"></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model.number="editedItem.weightBru" label="Brutto Weight" type="number"></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model.number="editedItem.weightTar" label="Tara Weight" type="number"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model.number="editedItem.quantity" label="Quantity" type="number"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model.number="editedItem.distance" label="Distance" type="number"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.lane" label="Lane"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="editedItem.comment" label="Comment" rows="2"></v-textarea>
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
import sampleService from '../services/sampleService'

export default {
  setup() {
    const samples = ref([])
    const error = ref(null)
    const itemsPerPage = ref(10)
    const search = ref('')
    const dialog = ref(false)
    const editedIndex = ref(-1)

    // Spalten-/Attributsteuerung
    const allHeaders = [
      { title: 'Sample ID', align: 'start', key: 'sId', width: 150 },
      { title: 'Timestamp', align: 'start', key: 'sStamp', width: 180 },
      { title: 'Name', align: 'start', key: 'name' },
      { title: 'Net Weight', align: 'end', key: 'weightNet' },
      { title: 'Brutto Weight', align: 'end', key: 'weightBru' },
      { title: 'Tara Weight', align: 'end', key: 'weightTar' },
      { title: 'Quantity', align: 'end', key: 'quantity' },
      { title: 'Distance', align: 'end', key: 'distance' },
      { title: 'Lane', align: 'center', key: 'lane' },
      { title: 'Flags', align: 'center', key: 'sFlags' },
      { title: 'Date Crumbled', align: 'start', key: 'dateCrumbled', width: 180 },
      { title: 'Date Exported', align: 'start', key: 'dateExported', width: 180 },
      { title: 'Comment', align: 'start', sortable: false, key: 'comment' },
      { title: 'Actions', align: 'center', key: 'actions', sortable: false, width: 120 },
    ]

    // Standardmäßig alle außer Actions auswählbar und sichtbar
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
    const editedItem = ref({
      sId: '',
      sStamp: null,
      name: '',
      weightNet: null,
      weightBru: null,
      weightTar: null,
      quantity: null,
      distance: null,
      lane: '',
      comment: ''
    })
    const defaultItem = {
      sId: '',
      sStamp: null,
      name: '',
      weightNet: null,
      weightBru: null,
      weightTar: null,
      quantity: null,
      distance: null,
      lane: '',
      comment: ''
    }

    const loadSamples = async () => {
      try {
        const response = await sampleService.getAll()
        samples.value = response.data
      } catch (err) {
        error.value = err.message
        console.error(err)
      }
    }

    loadSamples()

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
      editedIndex.value = samples.value.indexOf(item)
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
          // Update
          await sampleService.update(editedItem.value.sId, editedItem.value)
        } else {
          // Create
          editedItem.value.sStamp = new Date().toISOString()
          await sampleService.create(editedItem.value)
        }
        await loadSamples()
        closeDialog()
      } catch (err) {
        error.value = err.message
        console.error(err)
      }
    }

    const deleteItem = async (item) => {
      if (confirm('Are you sure you want to delete this item?')) {
        try {
          await sampleService.delete(item.sId)
          await loadSamples()
        } catch (err) {
          error.value = err.message
          console.error(err)
        }
      }
    }

    return {
      samples,
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
