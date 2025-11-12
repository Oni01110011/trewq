<template>
  <div>
    <v-card flat>
      <v-card-title class="d-flex align-center px-0 pb-4">
        <v-icon icon="mdi-map-marker" class="mr-2" size="small" color="primary"></v-icon>
        <span class="text-h6">Box Position Records</span>
        <v-spacer></v-spacer>
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
        :headers="headers"
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
  </div>
</template>

<script>
import { ref } from 'vue'
import getBoxpos from '../services/getBoxpos'

export default {
  setup() {
    const { boxpos, error, load } = getBoxpos()
    const itemsPerPage = ref(10)
    const search = ref('')

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
      headers: [
        { title: 'Position ID', align: 'start', key: 'id.bposId', width: 120 },
        { title: 'Box ID', align: 'start', key: 'id.bId', width: 120 },
        { title: 'Box Name', align: 'start', key: 'b.name' },
        { title: 'Date Exported', align: 'start', key: 'dateExported', width: 180 },
      ],
    }
  },
}
</script>
