import '@testing-library/jest-dom'

// Suppress console warnings in tests unless specifically testing error handling
const originalError = console.error
const originalWarn = console.warn

beforeAll(() => {
  console.error = (...args) => {
    if (
      args[0]?.includes?.('Error generating idea:') ||
      args[0]?.includes?.('punycode module is deprecated')
    ) {
      return
    }
    originalError.apply(console, args)
  }
  
  console.warn = (...args) => {
    if (args[0]?.includes?.('punycode module is deprecated')) {
      return
    }
    originalWarn.apply(console, args)
  }
})

afterAll(() => {
  console.error = originalError
  console.warn = originalWarn
})

// Add custom Jest matchers for DOM testing