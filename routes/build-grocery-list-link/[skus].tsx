export default eventHandler((event) => {
  const { skus } = event.context.params
  return {
    groceryListLink: `https://chatgpt-actions.vercel.app/grocery-list/${skus}`
  }
})
