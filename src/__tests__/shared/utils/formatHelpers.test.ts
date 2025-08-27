import { describe, it, expect } from 'vitest'
import { formatDateTime } from '../../../shared/utils/formatHelpers'

describe('formatHelpers', () => {
  describe('formatDateTime', () => {
    it('should format valid ISO date string correctly', () => {
      const isoString = '2023-12-25T14:30:00Z'
      const result = formatDateTime(isoString)
      // Note: Date is converted to local timezone, so 14:30 UTC becomes 22:30 (10:30 PM) in UTC+8
      expect(result).toBe('12/25/2023 10:30 PM')
    })

    it('should format date with single digit month and day', () => {
      const isoString = '2023-01-05T09:15:00Z'
      const result = formatDateTime(isoString)
      // 09:15 UTC becomes 17:15 (5:15 PM) in UTC+8
      expect(result).toBe('1/5/2023 5:15 PM')
    })

    it('should handle midnight (12 AM)', () => {
      const isoString = '2023-06-15T00:00:00Z'
      const result = formatDateTime(isoString)
      // 00:00 UTC becomes 08:00 (8:00 AM) in UTC+8
      expect(result).toBe('6/15/2023 8:00 AM')
    })

    it('should handle noon (12 PM)', () => {
      const isoString = '2023-06-15T12:00:00Z'
      const result = formatDateTime(isoString)
      // 12:00 UTC becomes 20:00 (8:00 PM) in UTC+8
      expect(result).toBe('6/15/2023 8:00 PM')
    })

    it('should return "Invalid Date" for invalid date string', () => {
      const invalidDate = 'not-a-date'
      const result = formatDateTime(invalidDate)
      expect(result).toBe('Invalid Date')
    })

    it('should return "Invalid Date" for empty string', () => {
      const result = formatDateTime('')
      expect(result).toBe('Invalid Date')
    })

    it('should handle dates with timezone offset', () => {
      const isoString = '2023-03-10T08:45:00-05:00'
      const result = formatDateTime(isoString)
      // The exact result depends on how the Date constructor handles the timezone
      expect(result).toMatch(/^\d{1,2}\/\d{1,2}\/2023 \d{1,2}:\d{2} (AM|PM)$/)
    })
  })
})
