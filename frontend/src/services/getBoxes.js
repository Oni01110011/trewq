import { ref } from 'vue'
import axios from 'axios'

const getBoxes = () => {
  const boxes = ref(null)
  const error = ref(null)

  const load = async () => {
    try {
      const { data } = await axios.get('/api/boxes')
      console.log(data)
      boxes.value = data
      console.log(boxes.value)
    } catch (err) {
      console.log(err)
      error.value = err.message
    }
  }

  return { boxes, error, load }
}

export default getBoxes
