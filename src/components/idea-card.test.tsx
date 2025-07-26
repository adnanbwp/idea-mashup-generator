import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { IdeaCard } from './idea-card'
import { Idea } from '@/types'

const mockIdea: Idea = {
  id: 'test-idea-1',
  user_id: 'test-user',
  content: {
    persona: 'Product Managers',
    problem: 'Context switching',
    technology: 'LLMs',
    businessModel: 'Per-seat subscription',
    format: 'SaaS',
    generatedAt: '2023-12-01T10:00:00Z',
    description: 'For product managers, who struggle with context switching, we\'re building a SaaS using LLMs that automates their workflow with a per-seat subscription model.'
  },
  created_at: '2023-12-01T10:00:00Z',
  updated_at: '2023-12-01T10:00:00Z'
}

describe('IdeaCard', () => {
  it('renders idea content correctly', () => {
    render(<IdeaCard idea={mockIdea} />)
    
    expect(screen.getByText('Product Managers × LLMs')).toBeInTheDocument()
    expect(screen.getByText('Product Managers')).toBeInTheDocument()
    expect(screen.getByText('Context switching')).toBeInTheDocument()
    expect(screen.getByText('LLMs')).toBeInTheDocument()
    expect(screen.getByText('Per-seat subscription')).toBeInTheDocument()
    expect(screen.getByText('SaaS')).toBeInTheDocument()
  })
  
  it('displays formatted date correctly', () => {
    render(<IdeaCard idea={mockIdea} />)
    
    expect(screen.getByText(/Generated on/)).toBeInTheDocument()
  })
  
  it('shows delete button when onDelete is provided', () => {
    const mockOnDelete = jest.fn()
    render(<IdeaCard idea={mockIdea} onDelete={mockOnDelete} />)
    
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })
  
  it('does not show delete button when onDelete is not provided', () => {
    render(<IdeaCard idea={mockIdea} />)
    
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
  })
  
  it('calls onDelete when delete button is clicked', async () => {
    const mockOnDelete = jest.fn()
    render(<IdeaCard idea={mockIdea} onDelete={mockOnDelete} />)
    
    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)
    
    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith('test-idea-1')
    })
  })
  
  it('shows loading state when deleting', async () => {
    const mockOnDelete = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)))
    render(<IdeaCard idea={mockIdea} onDelete={mockOnDelete} />)
    
    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)
    
    expect(screen.getByText('Deleting...')).toBeInTheDocument()
    expect(deleteButton).toBeDisabled()
  })
})