import { ref } from 'vue'
import axios from 'axios'

const getThresholds = () => {
  const thresholds = ref(null)
  const error = ref(null)

  const load = async () => {
    try {
      const { data } = await axios.get('/api/thresholds')
      console.log(data)
      thresholds.value = data
      console.log(thresholds.value)
    } catch (err) {
      console.log(err)
      error.value = err.message
    }
  }

  return { thresholds, error, load }
}

export default getThresholds
