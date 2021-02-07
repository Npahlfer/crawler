export function scoreByFrequency(array) {
  const frequency = {}

  for (let i = 0; i < array.length; i++) {
    if (frequency[array[i]]) {
      ++frequency[array[i]]
    } else {
      frequency[array[i]] = 1
    }
  }

  const uniques = Object.keys(frequency)

  return {
    list: uniques.sort((a, b) => frequency[b] - frequency[a]),
    score: frequency,
  }
}
