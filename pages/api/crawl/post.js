const axios = require('axios')
const { JSDOM } = require('jsdom')
const { excludedWords, excludedUcWords } = require('./excludedWords')

const readPost = async (url, bodySelector, wordMinLen) => {
  const { data } = await axios.get(url)
  const dom = new JSDOM(data, {
    url,
    contentType: 'text/html',
    includeNodeLocations: true,
    storageQuota: 10000000,
  })

  const { document } = dom.window

  const userBodyEls = document.querySelectorAll(bodySelector)
  const userTexts =
    userBodyEls && userBodyEls.length > 0 ? Array.from(userBodyEls) : []

  const hashTags = []
  const uppercasedWords = []
  const allWords = []

  const uppercasedRegex = new RegExp(
    `(\\b[A-Z][A-Z]+|\\b[A-Z]{${wordMinLen},}\\b)`,
    'g'
  )

  for (let i = 0; i < userTexts.length; i++) {
    const text = userTexts[i].textContent
    hashTags.push(...(text.match(/#(\w+)/g) || []))
    const ucWords = text.match(uppercasedRegex) || []
    uppercasedWords.push(
      ...ucWords.filter((w) => excludedUcWords.indexOf(w) === -1)
    )
    allWords.push(
      ...(text
        .split(/\s|,|\.|\?|\(|\)/)
        .filter((w) => w && w.length > 1 && excludedWords.indexOf(w) === -1) ||
        [])
    )
  }

  return {
    hashTags: hashTags,
    ucWords: uppercasedWords,
    allWords: allWords,
  }
}

export default async (req, res) => {
  let result = { result: [] }
  let query = {}

  if (req.method === 'POST') {
    try {
      await req.read()
      query = req.body
    } catch (error) {
      console.log('Error reading body', error)
    }
  } else {
    query = req.query
  }

  const { link, bodySelector, wordMinLen } = query

  try {
    const words = await readPost(link, bodySelector, wordMinLen)
    result.result = words
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
