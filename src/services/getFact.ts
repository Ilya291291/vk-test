const getFact = async () => {
  const response = await fetch('https://catfact.ninja/fact')
  const data = await response.json()
  return data
}

export default getFact
