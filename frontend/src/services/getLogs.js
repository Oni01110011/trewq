import { ref } from 'vue'
import axios from 'axios'

const getLogs = () => {
  const logs = ref(null)
  const error = ref(null)

  const load = async () => {
    try {
      const { data } = await axios.get('/api/logs')
      console.log(data)
      logs.value = data
      console.log(logs.value)
    } catch (err) {
      console.log(err)
      error.value = err.message
    }
  }

  return { logs, error, load }
}

export default getLogs
