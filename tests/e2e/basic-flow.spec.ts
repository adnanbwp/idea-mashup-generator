import { test, expect } from '@playwright/test'

test.describe('Idea Mashup Generator', () => {
  test('should load homepage correctly', async ({ page }) => {
    await page.goto('/')
    
    await expect(page).toHaveTitle(/Idea Mashup Generator/)
    await expect(page.getByText('Generate Your Next Big Idea')).toBeVisible()
    await expect(page.getByText('Generate Idea')).toBeVisible()
  })
  
  test('should navigate to saved ideas page', async ({ page }) => {
    await page.goto('/')
    
    await page.getByText('Saved Ideas').click()
    await expect(page.getByText('Saved Ideas')).toBeVisible()
    
    // Check for either the auth error message or the empty state message
    const authErrorVisible = page.getByText('Please sign in to view your saved ideas')
    const emptyStateVisible = page.getByText("You haven't saved any ideas yet. Generate some ideas to get started!")
    
    await expect(authErrorVisible.or(emptyStateVisible)).toBeVisible()
  })
  
  test('should generate an idea when button is clicked', async ({ page }) => {
    // Mock the API response
    await page.route('/api/ideas/generate', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-idea-123',
          content: {
            persona: 'Product Managers',
            problem: 'Context switching',
            technology: 'LLMs',
            businessModel: 'Per-seat subscription',
            format: 'SaaS',
            generatedAt: new Date().toISOString(),
            description: 'For product managers, who struggle with context switching, we\'re building a SaaS using LLMs that automates their workflow with a per-seat subscription model.'
          }
        })
      })
    })
    
    await page.goto('/')
    
    await page.getByText('Generate Idea').click()
    
    // Wait for the generated idea to appear
    await expect(page.getByText('Product Managers × LLMs')).toBeVisible()
    await expect(page.getByText('For product managers, who struggle with context switching')).toBeVisible()
    await expect(page.getByText('Save This Idea')).toBeVisible()
  })
  
  test('should show navigation between pages', async ({ page }) => {
    await page.goto('/')
    
    // Check navigation buttons are present - use role to target specific buttons
    await expect(page.getByRole('button', { name: 'Generate' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Saved Ideas' })).toBeVisible()
    
    // Navigate to saved ideas
    await page.getByRole('button', { name: 'Saved Ideas' }).click()
    await expect(page.url()).toContain('/saved')
    
    // Navigate back to generate
    await page.getByRole('button', { name: 'Generate' }).click()
    await expect(page.url()).toBe('http://localhost:3000/')
  })
})