import { h, renderSSR } from "nano-jsx";
import data from '../../data.json'

function List({ items }: { items: { title: string, retailPrice: string, sku: string }[] }) {
  const total = items.reduce((acc, crnt) => parseFloat(crnt.retailPrice.replace("$", "")) + acc, 0)
  return (
    <div className="max-w-lg mx-auto p-4 flex flex-col">
      <script src="https://cdn.tailwindcss.com"></script>
      <ul>
        <h1 className="font-bold text-lg">Grocery list</h1>
        {items.map((item) => (
          <li key={item.sku} className="flex flex-row items-center">
            <input type="checkbox" className="mr-1 peer" id={item.sku} />
            <label for={item.sku} className="peer-checked:line-through flex flex-row flex-1">
              <span className="flex-1">
                {item.title}
              </span>
              <span>
                {item.retailPrice}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <span className="text-sm text-end self-end mt-3">
        Total: ${total}
      </span>
    </div>
  )
}

export default eventHandler((event) => {
  const { skus } = event.context.params
  const skuArr = skus.split(",").map(sku => sku.trim())

  const items = []

  for (const sku of skuArr) {
    const newItem = data.find(item => item.sku === sku)
    if (newItem) {
      items.push(newItem)
    }
  }

  return renderSSR(
    <List items={items} />
  )
})
