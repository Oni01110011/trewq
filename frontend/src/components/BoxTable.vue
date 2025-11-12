<template>
  <div>
    <v-card flat>
      <v-card-title class="d-flex align-center px-0 pb-4">
        <v-icon icon="mdi-package-variant" class="mr-2" size="small" color="primary"></v-icon>
        <span class="text-h6">Box Records</span>
        <v-spacer></v-spacer>
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
        :headers="headers"
        :items="boxes"
        :search="search"
        item-value="bId"
        class="elevation-0"
        hover
        density="comfortable"
      >
        <template v-slot:[`item.bId`]="{ item }">
          <v-chip size="small" color="purple" variant="tonal">
            {{ item.bId }}
          </v-chip>
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
import { ref } from 'vue'
import boxService from '../services/boxService'

export default {
  setup() {
    const boxes = ref([])
    const error = ref(null)
    const itemsPerPage = ref(10)
    const search = ref('')
    const dialog = ref(false)
    const editedIndex = ref(-1)
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
        }
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
      headers: [
        { title: 'Box ID', align: 'start', key: 'bId', width: 120 },
        { title: 'Name', align: 'start', key: 'name' },
        { title: 'Max Number', align: 'end', key: 'numMax' },
        { title: 'Type', align: 'center', key: 'type' },
        { title: 'Comment', align: 'start', sortable: false, key: 'comment' },
        { title: 'Date Exported', align: 'start', key: 'dateExported', width: 180 },
        { title: 'Actions', align: 'center', key: 'actions', sortable: false, width: 120 },
      ],
    }
  },
}
</script>
