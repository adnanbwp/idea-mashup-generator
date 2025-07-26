import '@testing-library/jest-dom'

// Only suppress console warnings during Jest tests (not during build)
if (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID) {
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
}

// Add custom Jest matchers for DOM testing