import { ref } from 'vue'
import axios from 'axios'

const getSamples = () => {
  const samples = ref(null)
  const error = ref(null)

  const load = async () => {
    try {
      const { data } = await axios.get('/api/samples')
      console.log(data)
      samples.value = data
      console.log(samples.value)
    } catch (err) {
      console.log(err)
      error.value = err.message
    }
  }

  return { samples, error, load }
}

export default getSamples
