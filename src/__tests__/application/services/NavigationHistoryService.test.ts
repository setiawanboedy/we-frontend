import { describe, it, expect, beforeEach } from 'vitest'
import { NavigationHistoryService } from '@/application/services/NavigationHistoryService'

describe('NavigationHistoryService', () => {
  let navigationService: NavigationHistoryService

  beforeEach(() => {
    navigationService = new NavigationHistoryService()
  })

  describe('constructor', () => {
    it('should initialize with empty history', () => {
      expect(navigationService.getHistory()).toEqual([])
      expect(navigationService.getCurrentIndex()).toBe(-1)
      expect(navigationService.canGoBack()).toBe(false)
      expect(navigationService.canGoForward()).toBe(false)
    })
  })

  describe('addToHistory', () => {
    it('should add folder to history', () => {
      navigationService.addToHistory('folder-1')

      expect(navigationService.getHistory()).toEqual(['folder-1'])
      expect(navigationService.getCurrentIndex()).toBe(0)
    })

    it('should not add duplicate consecutive entries', () => {
      navigationService.addToHistory('folder-1')
      navigationService.addToHistory('folder-1')

      expect(navigationService.getHistory()).toEqual(['folder-1'])
      expect(navigationService.getCurrentIndex()).toBe(0)
    })

    it('should add different folders to history', () => {
      navigationService.addToHistory('folder-1')
      navigationService.addToHistory('folder-2')
      navigationService.addToHistory('folder-3')

      expect(navigationService.getHistory()).toEqual(['folder-1', 'folder-2', 'folder-3'])
      expect(navigationService.getCurrentIndex()).toBe(2)
    })

    it('should truncate history when exceeding max size', () => {
      // Set maxHistorySize to 3 for testing
      ;(navigationService as any).maxHistorySize = 3

      navigationService.addToHistory('folder-1')
      navigationService.addToHistory('folder-2')
      navigationService.addToHistory('folder-3')
      navigationService.addToHistory('folder-4')

      expect(navigationService.getHistory()).toEqual(['folder-2', 'folder-3', 'folder-4'])
      expect(navigationService.getCurrentIndex()).toBe(2)
    })

    it('should handle adding folders after navigation', () => {
      navigationService.addToHistory('folder-1')
      navigationService.addToHistory('folder-2')
      navigationService.navigateBack() // Now at folder-1
      navigationService.addToHistory('folder-3') // Should truncate forward history

      expect(navigationService.getHistory()).toEqual(['folder-1', 'folder-3'])
      expect(navigationService.getCurrentIndex()).toBe(1)
    })
  })

  describe('navigateBack', () => {
    it('should return null when cannot go back', () => {
      const result = navigationService.navigateBack()

      expect(result).toBeNull()
    })

    it('should navigate back to previous folder', () => {
      navigationService.addToHistory('folder-1')
      navigationService.addToHistory('folder-2')
      navigationService.addToHistory('folder-3')

      const result = navigationService.navigateBack()

      expect(result).toBe('folder-2')
      expect(navigationService.getCurrentIndex()).toBe(1)
    })

    it('should handle navigation back multiple times', () => {
      navigationService.addToHistory('folder-1')
      navigationService.addToHistory('folder-2')
      navigationService.addToHistory('folder-3')

      navigationService.navigateBack()
      const result = navigationService.navigateBack()

      expect(result).toBe('folder-1')
      expect(navigationService.getCurrentIndex()).toBe(0)
    })

    it('should not go back beyond the beginning', () => {
      navigationService.addToHistory('folder-1')
      navigationService.addToHistory('folder-2')

      navigationService.navigateBack()
      navigationService.navigateBack() // Should not go beyond start

      expect(navigationService.getCurrentIndex()).toBe(0)
      expect(navigationService.navigateBack()).toBeNull()
    })
  })

  describe('navigateForward', () => {
    it('should return null when cannot go forward', () => {
      navigationService.addToHistory('folder-1')

      const result = navigationService.navigateForward()

      expect(result).toBeNull()
    })

    it('should navigate forward after going back', () => {
      navigationService.addToHistory('folder-1')
      navigationService.addToHistory('folder-2')
      navigationService.addToHistory('folder-3')

      navigationService.navigateBack() // At folder-2
      const result = navigationService.navigateForward() // Should go to folder-3

      expect(result).toBe('folder-3')
      expect(navigationService.getCurrentIndex()).toBe(2)
    })

    it('should handle navigation forward multiple times', () => {
      navigationService.addToHistory('folder-1')
      navigationService.addToHistory('folder-2')
      navigationService.addToHistory('folder-3')

      navigationService.navigateBack() // At folder-2
      navigationService.navigateBack() // At folder-1
      const result = navigationService.navigateForward() // Should go to folder-2

      expect(result).toBe('folder-2')
      expect(navigationService.getCurrentIndex()).toBe(1)
    })

    it('should not go forward beyond the end', () => {
      navigationService.addToHistory('folder-1')
      navigationService.addToHistory('folder-2')

      navigationService.navigateBack() // At folder-1
      navigationService.navigateForward() // At folder-2
      const result = navigationService.navigateForward() // Should not go beyond end

      expect(result).toBeNull()
      expect(navigationService.getCurrentIndex()).toBe(1)
    })
  })

  describe('canGoBack', () => {
    it('should return false for empty history', () => {
      expect(navigationService.canGoBack()).toBe(false)
    })

    it('should return false when at the beginning of history', () => {
      navigationService.addToHistory('folder-1')
      navigationService.addToHistory('folder-2')

      navigationService.navigateBack() // At folder-1

      expect(navigationService.canGoBack()).toBe(false)
    })

    it('should return true when not at the beginning', () => {
      navigationService.addToHistory('folder-1')
      navigationService.addToHistory('folder-2')
      navigationService.addToHistory('folder-3')

      navigationService.navigateBack() // At folder-2

      expect(navigationService.canGoBack()).toBe(true)
    })
  })

  describe('canGoForward', () => {
    it('should return false for empty history', () => {
      expect(navigationService.canGoForward()).toBe(false)
    })

    it('should return false when at the end of history', () => {
      navigationService.addToHistory('folder-1')
      navigationService.addToHistory('folder-2')

      expect(navigationService.canGoForward()).toBe(false)
    })

    it('should return true when not at the end after going back', () => {
      navigationService.addToHistory('folder-1')
      navigationService.addToHistory('folder-2')
      navigationService.addToHistory('folder-3')

      navigationService.navigateBack() // At folder-2

      expect(navigationService.canGoForward()).toBe(true)
    })
  })

  describe('getHistory', () => {
    it('should return a copy of the history array', () => {
      navigationService.addToHistory('folder-1')
      navigationService.addToHistory('folder-2')

      const history = navigationService.getHistory()

      expect(history).toEqual(['folder-1', 'folder-2'])

      // Modifying the returned array should not affect internal state
      history.push('folder-3')
      expect(navigationService.getHistory()).toEqual(['folder-1', 'folder-2'])
    })
  })

  describe('getCurrentIndex', () => {
    it('should return current index', () => {
      expect(navigationService.getCurrentIndex()).toBe(-1)

      navigationService.addToHistory('folder-1')
      expect(navigationService.getCurrentIndex()).toBe(0)

      navigationService.addToHistory('folder-2')
      expect(navigationService.getCurrentIndex()).toBe(1)
    })
  })

  describe('clear', () => {
    it('should clear all history and reset index', () => {
      navigationService.addToHistory('folder-1')
      navigationService.addToHistory('folder-2')
      navigationService.addToHistory('folder-3')
      navigationService.navigateBack()

      navigationService.clear()

      expect(navigationService.getHistory()).toEqual([])
      expect(navigationService.getCurrentIndex()).toBe(-1)
      expect(navigationService.canGoBack()).toBe(false)
      expect(navigationService.canGoForward()).toBe(false)
    })
  })

  describe('complex navigation scenarios', () => {
    it('should handle back and forth navigation', () => {
      navigationService.addToHistory('folder-1')
      navigationService.addToHistory('folder-2')
      navigationService.addToHistory('folder-3')
      navigationService.addToHistory('folder-4')

      // Navigate back twice
      navigationService.navigateBack() // At folder-3
      navigationService.navigateBack() // At folder-2

      // Navigate forward once
      navigationService.navigateForward() // At folder-3

      expect(navigationService.getCurrentIndex()).toBe(2)
      expect(navigationService.canGoBack()).toBe(true)
      expect(navigationService.canGoForward()).toBe(true)

      // Navigate back to start
      navigationService.navigateBack() // At folder-2
      navigationService.navigateBack() // At folder-1

      expect(navigationService.canGoBack()).toBe(false)
      expect(navigationService.canGoForward()).toBe(true)
    })

    it('should handle adding new folder after navigation', () => {
      navigationService.addToHistory('folder-1')
      navigationService.addToHistory('folder-2')
      navigationService.addToHistory('folder-3')

      navigationService.navigateBack() // At folder-2
      navigationService.navigateBack() // At folder-1

      navigationService.addToHistory('folder-4') // Should replace forward history

      expect(navigationService.getHistory()).toEqual(['folder-1', 'folder-4'])
      expect(navigationService.getCurrentIndex()).toBe(1)
      expect(navigationService.canGoBack()).toBe(true)
      expect(navigationService.canGoForward()).toBe(false)
    })
  })
})
