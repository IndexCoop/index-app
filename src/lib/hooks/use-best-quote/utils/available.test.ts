import { IndexToken } from '@/constants/tokens'

import { isAvailableForFlashMint } from './available'

describe('isAvailableForFlashMint()', () => {
  test('should return false for INDEX swap availability', async () => {
    const isAvailable = isAvailableForFlashMint(IndexToken)
    expect(isAvailable).toBe(false)
  })
})
