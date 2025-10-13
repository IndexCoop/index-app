import { isAvailableForFlashMint } from './available'

describe('isAvailableForFlashMint()', () => {
  test('should return false for INDEX swap availability', async () => {
    const isAvailable = isAvailableForFlashMint('INDEX')
    expect(isAvailable).toBe(false)
  })
})
