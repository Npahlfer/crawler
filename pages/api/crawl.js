const axios = require('axios')
const { JSDOM } = require('jsdom')

function sortByFrequency(array) {
  const frequency = {}

  array.forEach((value) => {
    frequency[value] = 0
  })

  const uniques = array.filter((value) => ++frequency[value] == 1)

  return uniques.sort((a, b) => frequency[b] - frequency[a])
}

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
    uppercasedWords.push(...(text.match(uppercasedRegex) || []))
    allWords.push(
      ...(text.split(/\s|,|\.|\?|\(|\)/).filter((w) => w && w.length > 1) || [])
    )
  }

  return {
    hashTags: hashTags,
    ucWords: uppercasedWords,
    allWords: allWords,
  }
}

const scrapeTrendingWords = async (
  url,
  linkSelector,
  bodySelector,
  options = {}
) => {
  const {
    wordMinLen = 2,
    maxResult = 100,
    excludeUcWords = [],
    excludeWords = [],
  } = options
  const tags = []
  const uc = []
  const words = []

  const links = await getTopPostLinks(url, linkSelector)

  for (let i = 0; i < links.length; i++) {
    console.log('Crawling link:', links[i])
    const { hashTags, ucWords, allWords } = await readPost(
      links[i],
      bodySelector,
      wordMinLen
    )

    tags.push(...hashTags)
    uc.push(...ucWords)
    words.push(...allWords)
  }

  const hashTagsSorted = sortByFrequency(tags)
  const ucWordsSorted = sortByFrequency(uc)
  const allWordsSorted = sortByFrequency(words)

  const ucWordsFiltered = ucWordsSorted.filter(
    (w) => excludeUcWords.indexOf(w) === -1
  )

  const wordsFiltered = allWordsSorted.filter(
    (w) => excludeWords.indexOf(w) === -1
  )

  if (ucWordsFiltered.length > maxResult) {
    ucWordsFiltered.length = maxResult
  }

  if (wordsFiltered.length > maxResult) {
    wordsFiltered.length = maxResult
  }

  if (hashTagsSorted.length > maxResult) {
    hashTagsSorted.length = maxResult
  }

  return {
    ucWords: ucWordsFiltered,
    words: wordsFiltered,
    hashTags: hashTagsSorted,
  }
}

const excludedUcWords = [
  'NOT',
  'CAN',
  'THE',
  'IS',
  'BIG',
  'SPECIAL',
  'SPY',
  'OOH',
  'LMAO',
  'FOR',
  'NO',
  'YES',
  'WHO',
  'EMAILS',
  'IM',
  'IT',
  'WE',
  'BUT',
  'EDIT',
  'LIKE',
  'WHAT',
  'MY',
  'BE',
  'CONSOLE',
  'IDK',
  'THEM',
  'JUST',
  'STILL',
  'BE',
  'TO',
  'RETARDS',
  'ONE',
  'AND',
  'US',
  'ARE',
  'USING',
  'MESSAGES',
  'EDIT',
  'THIS',
  'YOUR',
  'THAT',
  'LETS',
  'NEVER',
  'EXACTLY',
  'HIM',
  'OK',
  'WANT',
  'REMEMBER',
  'PLEASE',
  'AM',
  'ME',
  'RIGHT',
  'LOL',
  'FUCKING',
  'FUCK',
  'WILL',
  'HERE',
  'FROM',
  'HANDS',
  'THESE',
  'YOU',
  'HAVE',
  'OF',
  'AT',
  'SAID',
  'SO',
  'WITH',
  'OPINION',
  'THEIR',
  'TOGETHER',
  'HEAR',
  'OR',
  'MOD',
  'MODS',
]

const excludedWords = [
  'the',
  'The',
  'best',
  'Best',
  'Daily',
  'daily',
  'or',
  'No',
  'no',
  'this',
  'This',
  'for',
  'For',
  'like',
  'Like',
  'will',
  'good',
  'It’s',
  'it’s',
  'its',
  'Its',
  'was',
  'to',
  'their',
  'know',
  'any',
  'at',
  'some',
  'think',
  'do',
  'week',
  'but',
  'if',
  'If',
  'other',
  'What',
  'what',
  'Discussion',
  'discussion',
  'as',
  'are',
  'is',
  'you',
  'You',
  'Your',
  'your',
  'Weekly',
  'weekly',
  'not',
  'about',
  'let',
  'who',
  'meme',
  'Meme',
  'it',
  'one',
  'people',
  'also',
  'something',
  'ape',
  'Read',
  'that',
  'me',
  'on',
  'day',
  'just',
  'I’m',
  "I'm",
  'by',
  'then',
  'been',
  'make',
  'made',
  'he',
  'she',
  'sure',
  'of',
  'have',
  'thread',
  'there',
  'got',
  'so',
  'can',
  'has',
  'being',
  'follow',
  'and',
  'And',
  'with',
  'sub',
  'another',
  'thinking',
  'we',
  'We',
  'call',
  'before',
  'even',
  'jobs',
  'comment',
  'Comment',
  'them',
  'these',
  'our',
  'want',
  'how',
  'be',
  'they',
  'into',
  'retard',
  'retarded',
  'his',
  'him',
  'from',
  'He',
  'he',
  'he’s',
  "he's",
  'an',
  'downvotes',
  'because',
  'actually',
  'said',
  'movie',
  'But',
  'but',
  'cant',
  'year',
  'Those',
  'used',
  'doing',
  'play',
  'fuck',
  'fucking',
  "it's",
  'post',
  "dont't",
  'point',
  'THE',
  'someone',
  'too',
  'see',
  'right',
  'say',
  "I've",
  'My',
  'my',
  'us',
  'way',
  'in',
  'here',
  'than',
  'am',
  'had',
  'take',
  'reason',
  'Just',
  'lot',
  'those',
]

let dn = Date.now()
const cache = {
  words: [],
  excluded: {
    ucWords: excludedUcWords,
    words: excludedWords,
  },
}
const cacheTime = 30 * 60 * 1000
const getTrendingWords = async () => {
  if (Date.now() - dn > cacheTime || cache.words.length === 0) {
    dn = Date.now()
    cache.words = await scrapeTrendingWords(
      'https://old.reddit.com/r/wallstreetbets/',
      '.thing .entry .top-matter p.title > a',
      '.thing .usertext-body',
      {
        excludeUcWords: excludedUcWords,
        excludeWords: excludedWords,
      }
    )
  }

  return cache
}

export default async (req, res) => {
  let result = { result: [] }
  try {
    const words = await getTrendingWords()
    console.log('words', words)
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
