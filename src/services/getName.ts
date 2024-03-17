const getName = async (name : string) => {
  const response = await fetch(`https://api.agify.io?name=${name}`)
  const data = await response.json()
  return data
}

export default getName
