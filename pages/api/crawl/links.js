const axios = require('axios')
const { JSDOM } = require('jsdom')

const getTopPostLinks = async (url, linkSelector) => {
  let links = []
  try {
    const { data } = await axios.get(url)
    const dom = new JSDOM(data, {
      url,
      contentType: 'text/html',
      includeNodeLocations: true,
      storageQuota: 10000000,
    })

    const { document } = dom.window
    links = Array.from(document.querySelectorAll(linkSelector)).map(
      (link) => link.href
    )
  } catch (error) {
    throw error
  }

  return links
}

export default async (req, res) => {
  let result = { result: [] }

  try {
    const links = await getTopPostLinks(
      'https://old.reddit.com/r/wallstreetbets/',
      '.thing .entry .top-matter p.title > a'
    )
    result.result = links
    res.statusCode = 200
  } catch (error) {
    result = {
      error,
      result: [],
    }
    res.statusCode = 500
  }

  res.json(result)
}
