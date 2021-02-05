import React from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [trending, setTrending] = React.useState({
    excluded: {
      ucWords: [],
      words: [],
    },
    words: {
      hashTags: [],
      ucWords: [],
      words: [],
    },
  })

  React.useEffect(() => {
    const getWords = async () => {
      const res = await fetch('/api/crawl')
      const resultObj = await res.json()
      setTrending(resultObj.result)
    }

    getWords()
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Trending words on wallstreetbets</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Trending:</h1>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>Hashtags:</h2>
            <ol>
              {trending.words.hashTags.map((tag) => (
                <li>{tag}</li>
              ))}
            </ol>
          </div>

          <div className={styles.card}>
            <h2>Uppercased words:</h2>
            <ol>
              {trending.words.ucWords.map((word) => (
                <li>{word}</li>
              ))}
            </ol>

            <h2>Excluded Uppercased words:</h2>
            <ul>
              {trending.excluded.ucWords.map((word) => (
                <li>{word}</li>
              ))}
            </ul>
          </div>
          <div className={styles.card}>
            <h2>Words:</h2>
            <ol>
              {trending.words.words.map((word) => (
                <li>{word}</li>
              ))}
            </ol>

            <h2>Excluded words:</h2>
            <ul>
              {trending.excluded.words.map((word) => (
                <li>{word}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
