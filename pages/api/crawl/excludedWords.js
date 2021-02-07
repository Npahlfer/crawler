export const excludedUcWords = [
  'WSB',
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

export const excludedWords = [
  "I'm",
  "I've",
  "It's",
  "It's",
  "don't",
  "dont't",
  'don’t',
  "he's",
  "it's",
  "you're",
  'And',
  'Best',
  'But',
  'Comment',
  'Daily',
  'Discussion',
  'For',
  'He',
  'If',
  'It',
  'Its',
  'It’s',
  'I’m',
  'Just',
  'Like',
  'Meme',
  'My',
  'No',
  'Read',
  'Reddit',
  'So',
  'THE',
  'The',
  'They',
  'This',
  'Those',
  'WSB',
  'We',
  'Weekly',
  'What',
  'You',
  'Your',
  'about',
  'account',
  'actually',
  'after',
  'all',
  'also',
  'am',
  'an',
  'and',
  'another',
  'any',
  'ape',
  'are',
  'around',
  'as',
  'at',
  'back',
  'be',
  'because',
  'been',
  'before',
  'being',
  'best',
  'but',
  'but',
  'by',
  'call',
  'can',
  'cant',
  'comment',
  'could',
  'daily',
  'day',
  'did',
  'discussion',
  'do',
  'doing',
  'downvotes',
  'even',
  'follow',
  'for',
  'from',
  'fuck',
  'fucking',
  'go',
  'going',
  'good',
  'got',
  'had',
  'has',
  'have',
  'He',
  'he',
  'here',
  'he’s',
  'him',
  'his',
  'how',
  'if',
  'in',
  'into',
  'is',
  'it',
  'its',
  'it’s',
  'jobs',
  'just',
  'know',
  'let',
  'like',
  'lol',
  'lot',
  'made',
  'make',
  'me',
  'meme',
  'money',
  'most',
  'movie',
  'my',
  'need',
  'no',
  'not',
  'of',
  'on',
  'one',
  'only',
  'options',
  'or',
  'other',
  'our',
  'people',
  'play',
  'point',
  'post',
  'put',
  'really',
  'reason',
  'reddit',
  'retard',
  'retarded',
  'right',
  'said',
  'same',
  'say',
  'see',
  'she',
  'should',
  'so',
  'some',
  'someone',
  'something',
  'still',
  'sub',
  'sure',
  'take',
  'than',
  'that',
  'the',
  'their',
  'them',
  'then',
  'there',
  'these',
  'they',
  'thing',
  'think',
  'thinking',
  'this',
  'those',
  'thread',
  'to',
  'too',
  'until',
  'up',
  'us',
  'used',
  'want',
  'was',
  'way',
  'we',
  'week',
  'weekly',
  'were',
  'what',
  'who',
  'will',
  'with',
  'would',
  'wsb',
  'year',
  'you',
  'your',
  'again',
]

export default async (req, res) => {
  res.statusCode = 200
  res.json({
    result: {
      ucWords: excludedUcWords,
      words: excludedWords,
    },
  })
}
