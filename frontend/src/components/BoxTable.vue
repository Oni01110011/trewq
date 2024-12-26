<template>
  <div>
    <v-card flat>
      <v-card-title class="d-flex align-center px-0 pb-4">
        <v-icon icon="mdi-package-variant" class="mr-2" size="small" color="primary"></v-icon>
        <span class="text-h6">Box Records</span>
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
          {{ boxes?.length || 0 }} Total
        </v-chip>
      </v-card-title>
      
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Search boxes..."
        variant="outlined"
        density="compact"
        hide-details
        clearable
        class="mb-4"
      ></v-text-field>

      <v-data-table
        v-if="boxes"
        v-model:items-per-page="itemsPerPage"
        v-model:expanded="expanded"
        show-expand
        :headers="visibleHeaders"
        :items="boxes"
        :search="search"
        item-value="bId"
        class="elevation-0"
        hover
        density="comfortable"
        @update:expanded="onExpandedUpdate"
      >
        <template #expanded-row="{ item, columns }">
          <tr>
            <td :colspan="columns.length">
              <v-card variant="tonal" class="ma-2">
                <v-card-title class="text-subtitle-2">
                  Samples in box {{ item.bId }}
                </v-card-title>
                <v-card-text>
                  <div v-if="boxSamplesLoading[item.bId]" class="text-caption">
                    Loading samples...
                  </div>
                  <div v-else-if="!boxSamples[item.bId] || boxSamples[item.bId].length === 0" class="text-caption">
                    No samples in this box.
                  </div>
                  <div v-else>
                    <v-data-table
                      :headers="sampleHeaders"
                      :items="boxSamples[item.bId]"
                      density="compact"
                      hide-default-footer
                    >
                    </v-data-table>
                  </div>
                </v-card-text>
              </v-card>
            </td>
          </tr>
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
          <span class="text-h5">{{ editedIndex === -1 ? 'New Box' : 'Edit Box' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.bId" label="Box ID" required></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model.number="editedItem.numMax" label="Max Number" type="number"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.type" label="Type"></v-text-field>
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
import boxService from '../services/boxService'
import sampleService from '../services/sampleService'

export default {
  setup() {
    const boxes = ref([])
    const error = ref(null)
    const itemsPerPage = ref(10)
    const search = ref('')
    const dialog = ref(false)
    const editedIndex = ref(-1)

    // Expandierte Boxen und Samples darin
    const expanded = ref([])
    const boxSamples = ref({})
    const boxSamplesLoading = ref({})

    const sampleHeaders = [
      { title: 'Sample ID', align: 'start', key: 'sId', width: 120 },
      { title: 'Timestamp', align: 'start', key: 'sStamp', width: 160 },
      { title: 'Name', align: 'start', key: 'name' },
    ]

    // Spalten-/Attributsteuerung
    const allHeaders = [
      { title: 'Box ID', align: 'start', key: 'bId', width: 120 },
      { title: 'Name', align: 'start', key: 'name' },
      { title: 'Max Number', align: 'end', key: 'numMax' },
      { title: 'Type', align: 'center', key: 'type' },
      { title: 'Comment', align: 'start', sortable: false, key: 'comment' },
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
    const editedItem = ref({ bId: '', name: '', numMax: null, type: '', comment: '', dateExported: null })
    const defaultItem = { bId: '', name: '', numMax: null, type: '', comment: '', dateExported: null }

    const loadBoxes = async () => {
      try {
        const response = await boxService.getAll()
        boxes.value = response.data
      } catch (err) {
        error.value = err.message
      }
    }

    loadBoxes()

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
      editedIndex.value = boxes.value.indexOf(item)
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
          await boxService.update(editedItem.value.bId, editedItem.value)
        } else {
          await boxService.create(editedItem.value)
        }
        await loadBoxes()
        closeDialog()
      } catch (err) {
        error.value = err.message
      }
    }

    const deleteItem = async (item) => {
      if (confirm('Are you sure you want to delete this item?')) {
        try {
          await boxService.delete(item.bId)
          await loadBoxes()
        } catch (err) {
          error.value = err.message
          console.error(err)
        }
      }
    }

    const loadSamplesForBox = async (bId) => {
      if (boxSamplesLoading.value[bId]) return
      boxSamplesLoading.value = { ...boxSamplesLoading.value, [bId]: true }
      try {
        const response = await sampleService.getByBoxId(bId)
        boxSamples.value = { ...boxSamples.value, [bId]: response.data }
      } catch (err) {
        console.error(err)
      } finally {
        boxSamplesLoading.value = { ...boxSamplesLoading.value, [bId]: false }
      }
    }

    const onExpandedUpdate = async (val) => {
      expanded.value = val
      const last = val[val.length - 1]
      if (last && !boxSamples.value[last]) {
        await loadSamplesForBox(last)
      }
    }
    return {
      boxes,
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
      expanded,
      boxSamples,
      boxSamplesLoading,
      sampleHeaders,
      onExpandedUpdate,
    }
  },
}
</script>
