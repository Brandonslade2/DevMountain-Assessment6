const {shuffleArray} = require('./utils')

describe('shuffleArray should', () => {

    test('Check if shuffleArray contains Brandon', () => {
        expect(shuffleArray(['Jay', 'Brandon'])).toContain('Jay')
    })

    test('Check if the length of shuffleArray is accurate', () => {
        expect(shuffleArray(['Jay', 'Brandon'])).toHaveLength(2)
    })
})

//reminder: you are testing the functions in utils.js