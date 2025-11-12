import { ref } from 'vue'
import axios from 'axios'

const getBoxpos = () => {
  const boxpos = ref(null)
  const error = ref(null)

  const load = async () => {
    try {
      const { data } = await axios.get('/api/boxpos')
      console.log(data)
      boxpos.value = data
      console.log(boxpos.value)
    } catch (err) {
      console.log(err)
      error.value = err.message
    }
  }

  return { boxpos, error, load }
}

export default getBoxpos
