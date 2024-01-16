
import data from '../../data.json'

export default eventHandler((event) => {
  const { query } = event.context.params
  return data.filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
})
