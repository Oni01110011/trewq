import { ref } from 'vue'
import axios from 'axios'

const getAnalysis = () => {
  const analysis = ref(null)
  const error = ref(null)

  const load = async () => {
    try {
      const { data } = await axios.get('/api/analysis')
      console.log(data)
      analysis.value = data
      console.log(analysis.value)
    } catch (err) {
      console.log(err)
      error.value = err.message
    }
  }

  return { analysis, error, load }
}

export default getAnalysis
