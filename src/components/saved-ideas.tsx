'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IdeaCard } from '@/components/idea-card'
import { Idea, GetIdeasResponse } from '@/types'

export function SavedIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)
  
  const PAGE_SIZE = 10
  
  const loadIdeas = async (page: number = 0) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const offset = page * PAGE_SIZE
      const response = await fetch(
        `/api/ideas?limit=${PAGE_SIZE}&offset=${offset}`,
        {
          headers: {
            'Authorization': 'Bearer mock-token' // TODO: Replace with real auth token
          }
        }
      )
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please sign in to view your saved ideas')
        }
        throw new Error('Failed to load ideas')
      }
      
      const data: GetIdeasResponse = await response.json()
      setIdeas(data.ideas)
      setTotalCount(data.total)
      setCurrentPage(page)
      setHasNextPage(offset + PAGE_SIZE < data.total)
      
    } catch (error: any) {
      console.error('Error loading ideas:', error)
      setError(error.message || 'Failed to load ideas')
    } finally {
      setIsLoading(false)
    }
  }
  
  const deleteIdea = async (ideaId: string) => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer mock-token' // TODO: Replace with real auth token
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete idea')
      }
      
      // Remove the idea from the local state
      setIdeas(prevIdeas => prevIdeas.filter(idea => idea.id !== ideaId))
      setTotalCount(prev => prev - 1)
      
    } catch (error) {
      console.error('Error deleting idea:', error)
      alert('Failed to delete idea. Please try again.')
    }
  }
  
  useEffect(() => {
    loadIdeas()
  }, [])
  
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">Loading your saved ideas...</p>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <p className="text-destructive text-center">{error}</p>
            <Button onClick={() => loadIdeas(currentPage)} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Saved Ideas</CardTitle>
          <CardDescription>
            {totalCount === 0 
              ? "You haven't saved any ideas yet. Generate some ideas to get started!"
              : `You have ${totalCount} saved idea${totalCount === 1 ? '' : 's'}`
            }
          </CardDescription>
        </CardHeader>
      </Card>
      
      {ideas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <p className="text-muted-foreground text-center">
              No saved ideas found. Start generating some ideas!
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6">
            {ideas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onDelete={deleteIdea}
              />
            ))}
          </div>
          
          {(currentPage > 0 || hasNextPage) && (
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => loadIdeas(currentPage - 1)}
                disabled={currentPage === 0}
                variant="outline"
              >
                Previous
              </Button>
              
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Page {currentPage + 1}
              </span>
              
              <Button
                onClick={() => loadIdeas(currentPage + 1)}
                disabled={!hasNextPage}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}