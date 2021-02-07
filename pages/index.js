import React from 'react'
import Head from 'next/head'
import { scoreByFrequency } from '../util/sort'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [loading, setLoading] = React.useState(false)
  const [links, setLinks] = React.useState([])
  const [words, setWords] = React.useState({
    ucWords: [],
    words: [],
    hashTags: [],
  })

  const [excludedWords, setExcludedWords] = React.useState({
    ucWords: [],
    words: [],
  })
  const getLinks = async () => {
    setLoading(true)
    const res = await fetch('/api/crawl/links')
    const resultObj = await res.json()
    const links = resultObj?.result

    setLinks(links)
    setLoading(false)
  }

  const handleBtnClick = () => {
    getLinks()
  }

  React.useEffect(() => {
    const getWordsInPost = async (link, bodySelector, wordMinLen = 2) => {
      const res = await fetch('/api/crawl/post', {
        method: 'POST',
        body: JSON.stringify({
          link,
          bodySelector,
          wordMinLen,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })

      const resultObj = await res.json()
      return resultObj.result
    }

    const setAllPostWords = async () => {
      const bodySelector = '.thing .usertext-body'
      const wordList = []
      const ucWordList = []
      const hashTags = []

      setLoading(true)

      for (let i = 0; i < links.length; i++) {
        const postWords = await getWordsInPost(links[i], bodySelector)

        wordList.push(...postWords.allWords)
        ucWordList.push(...postWords.ucWords)
        hashTags.push(...postWords.hashTags)
      }

      const hashTagsSorted = scoreByFrequency(hashTags)
      const ucWordsSorted = scoreByFrequency(ucWordList)
      const allWordsSorted = scoreByFrequency(wordList)

      setWords({
        ucWords: ucWordsSorted,
        words: allWordsSorted,
        hashTags: hashTagsSorted,
      })
      setLoading(false)
    }

    setAllPostWords()
  }, [links])

  React.useEffect(() => {
    const getExcludedWords = async () => {
      const res = await fetch('/api/crawl/excludedWords')
      const resultObj = await res.json()
      const words = resultObj?.result
      setExcludedWords(words)
    }
    getExcludedWords()
  }, [links])

  return (
    <div className={styles.container}>
      <Head>
        <title>Trending words on wallstreetbets</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Trending words</h1>

        <button
          className={styles.fetchBtn}
          type="button"
          onClick={handleBtnClick}
        >
          Fetch words
        </button>

        {loading && <div className={styles.loader}>🚀LOADING...🚀</div>}

        {loading && (
          <p>
            Scraping /r/wallstreetbets front page posts. This can take a while
            (~40sec).
          </p>
        )}

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>Uppercased words:</h2>

            <div className={styles.head}>
              <span>Word:</span>
              <span>Count:</span>
            </div>

            <ol className={styles.list}>
              {words?.ucWords?.list?.map((word, i) => (
                <li key={i}>
                  <div className={styles.listItem}>
                    <span>{word}</span>
                    <span>{words.ucWords.score[word]}</span>
                  </div>
                </li>
              ))}
              {!words?.ucWords?.list ||
                (words?.ucWords?.list.length === 0 && (
                  <li className={styles.listEmpty}>...</li>
                ))}
            </ol>

            <h2>Excluded Uppercased words:</h2>
            <ul className={styles.list}>
              {excludedWords?.ucWords?.map((word, i) => (
                <li key={i}>{word}</li>
              ))}
            </ul>
          </div>

          <div className={styles.card}>
            <h2>Words:</h2>

            <div className={styles.head}>
              <span>Word:</span>
              <span>Count:</span>
            </div>
            <ol className={styles.list}>
              {words?.words?.list?.map((word, i) => (
                <li key={i}>
                  <div className={styles.listItem}>
                    <span>{word}</span>
                    <span>{words.words.score[word]}</span>
                  </div>
                </li>
              ))}
              {!words?.words?.list ||
                (words?.words?.list.length === 0 && (
                  <li className={styles.listEmpty}>...</li>
                ))}
            </ol>

            <h2>Excluded words:</h2>
            <ul className={styles.list}>
              {excludedWords?.words?.map((word, i) => (
                <li key={i}>{word}</li>
              ))}
            </ul>
          </div>

          <div className={styles.card}>
            <h2>Hashtags:</h2>
            <div className={styles.head}>
              <span>Word:</span>
              <span>Count:</span>
            </div>
            <ol className={styles.list}>
              {words?.hashTags?.list?.map((tag, i) => (
                <li key={i}>
                  <div className={styles.listItem}>
                    <span>{tag}</span>
                    <span>{words.hashTags.score[tag]}</span>
                  </div>
                </li>
              ))}
              {!words?.hashTags?.list ||
                (words?.hashTags?.list.length === 0 && (
                  <li className={styles.listEmpty}>...</li>
                ))}
            </ol>
          </div>
        </div>
      </main>
    </div>
  )
}
