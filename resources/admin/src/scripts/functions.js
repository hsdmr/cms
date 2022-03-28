export async function postUrl(url = '', data = {}, header = {}) {
  const response = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': CSRF_TOKEN,
          'Accept': 'application/json',
          header
      },
      body: JSON.stringify(data)
  })
  return response.json()
}

export async function getUrl(url = '', header = {}) {
  const response = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': CSRF_TOKEN,
          'Accept': 'application/json',
          header
      },
  })
  return response.json()
}