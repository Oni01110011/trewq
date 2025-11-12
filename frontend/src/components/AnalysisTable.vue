<template>
  <div>
    <v-card flat>
      <v-card-title class="d-flex align-center px-0 pb-4">
        <v-icon icon="mdi-chart-line" class="mr-2" size="small" color="primary"></v-icon>
        <span class="text-h6">Analysis Records</span>
        <v-spacer></v-spacer>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog" class="mr-2">
          Add New
        </v-btn>
        <v-chip color="primary" variant="outlined" size="small">
          {{ analysis?.length || 0 }} Total
        </v-chip>
      </v-card-title>
      
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Search analysis..."
        variant="outlined"
        density="compact"
        hide-details
        clearable
        class="mb-4"
      ></v-text-field>

      <v-data-table
        v-if="analysis"
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="analysis"
        :search="search"
        item-value="aId"
        class="elevation-0"
        hover
        density="comfortable"
      >
        <template v-slot:[`item.aId`]="{ item }">
          <v-chip size="small" color="primary" variant="tonal">
            {{ item.aId }}
          </v-chip>
        </template>
        
        <template v-slot:[`item.sId`]="{ item }">
          <v-chip size="small" color="blue-grey" variant="outlined">
            {{ item.sId }}
          </v-chip>
        </template>
        
        <template v-slot:[`item.dateIn`]="{ item }">
          <span class="text-caption">{{ formatDate(item.dateIn) }}</span>
        </template>
        
        <template v-slot:[`item.dateOut`]="{ item }">
          <span class="text-caption">{{ formatDate(item.dateOut) }}</span>
        </template>
        
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon="mdi-pencil" size="small" variant="text" @click="openEditDialog(item)"></v-btn>
          <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="deleteItem(item)"></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editedIndex === -1 ? 'New Analysis' : 'Edit Analysis' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.sId" label="Sample ID" required></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model.number="editedItem.pol" label="POL" type="number"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model.number="editedItem.nat" label="NAT" type="number"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model.number="editedItem.kal" label="KAL" type="number"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model.number="editedItem.an" label="AN" type="number"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model.number="editedItem.dry" label="DRY" type="number"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model.number="editedItem.weightMea" label="Weight Measured" type="number"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model.number="editedItem.weightNrm" label="Weight Normal" type="number"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model.number="editedItem.density" label="Density" type="number"></v-text-field>
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
import { ref } from 'vue'
import analysisService from '../services/analysisService'

export default {
  setup() {
    const analysis = ref([])
    const error = ref(null)
    const itemsPerPage = ref(10)
    const search = ref('')
    const dialog = ref(false)
    const editedIndex = ref(-1)
    const editedItem = ref({
      sId: '', sStamp: null, pol: null, nat: null, kal: null, an: null, dry: null,
      dateIn: null, dateOut: null, weightMea: null, weightNrm: null, density: null, lane: '', comment: ''
    })
    const defaultItem = {
      sId: '', sStamp: null, pol: null, nat: null, kal: null, an: null, dry: null,
      dateIn: null, dateOut: null, weightMea: null, weightNrm: null, density: null, lane: '', comment: ''
    }

    const loadAnalysis = async () => {
      try {
        const response = await analysisService.getAll()
        analysis.value = response.data
      } catch (err) {
        error.value = err.message
      }
    }

    loadAnalysis()

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
      editedIndex.value = analysis.value.indexOf(item)
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
          await analysisService.update(editedItem.value.aId, editedItem.value)
        } else {
          editedItem.value.sStamp = new Date().toISOString()
          editedItem.value.dateIn = new Date().toISOString()
          await analysisService.create(editedItem.value)
        }
        await loadAnalysis()
        closeDialog()
      } catch (err) {
        error.value = err.message
      }
    }

    const deleteItem = async (item) => {
      if (confirm('Are you sure you want to delete this item?')) {
        try {
          await analysisService.delete(item.aId)
          await loadAnalysis()
        } catch (err) {
          error.value = err.message
        }
      }
    }

    return {
      analysis,
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
      headers: [
        { title: 'Analysis ID', align: 'start', key: 'aId', width: 120 },
        { title: 'Sample ID', align: 'start', key: 'sId', width: 150 },
        { title: 'Timestamp', align: 'start', key: 'sStamp', width: 180 },
        { title: 'POL', align: 'end', key: 'pol' },
        { title: 'NAT', align: 'end', key: 'nat' },
        { title: 'KAL', align: 'end', key: 'kal' },
        { title: 'AN', align: 'end', key: 'an' },
        { title: 'DRY', align: 'end', key: 'dry' },
        { title: 'Date In', align: 'start', key: 'dateIn', width: 180 },
        { title: 'Date Out', align: 'start', key: 'dateOut', width: 180 },
        { title: 'Weight Measured', align: 'end', key: 'weightMea' },
        { title: 'Weight Normal', align: 'end', key: 'weightNrm' },
        { title: 'Density', align: 'end', key: 'density' },
        { title: 'Lane', align: 'center', key: 'lane' },
        { title: 'Comment', align: 'start', sortable: false, key: 'comment' },
        { title: 'Actions', align: 'center', key: 'actions', sortable: false, width: 120 },
      ],
    }
  },
}
</script>
