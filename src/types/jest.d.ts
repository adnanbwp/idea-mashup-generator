import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toBeDisabled(): R
      toBeVisible(): R
      toHaveTextContent(text: string): R
    }
  }
}