'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IdeaCard } from '@/components/idea-card'
import { GeneratorProps, IdeaContent } from '@/types'
import { supabase } from '@/lib/supabase'

export function IdeaGenerator({ onIdeaGenerated }: GeneratorProps) {
  const [currentIdea, setCurrentIdea] = useState<IdeaContent | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const generateIdea = async () => {
    setIsGenerating(true)
    setError(null)
    
    try {
      const response = await fetch('/api/ideas/generate', {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate idea')
      }
      
      const data = await response.json()
      setCurrentIdea(data.content)
      
      if (onIdeaGenerated) {
        onIdeaGenerated(data.content)
      }
      
    } catch (error) {
      console.error('Error generating idea:', error)
      setError('Failed to generate idea. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }
  
  const saveIdea = async () => {
    if (!currentIdea) return
    
    setIsSaving(true)
    setError(null)
    
    try {
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session?.access_token) {
        throw new Error('Please sign in to save ideas')
      }
      
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          content: currentIdea
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Failed to save idea')
      }
      
      // Show success feedback
      alert('Idea saved successfully!')
      
    } catch (error) {
      console.error('Error saving idea:', error)
      setError(error instanceof Error ? error.message : 'Failed to save idea. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Generate New Idea</CardTitle>
          <CardDescription>
            Click the button below to generate a unique business idea mashup
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center space-y-4">
          <Button
            onClick={generateIdea}
            disabled={isGenerating}
            size="lg"
            className="w-full max-w-xs"
          >
            {isGenerating ? 'Generating...' : 'Generate Idea'}
          </Button>
          
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
        </CardContent>
      </Card>
      
      {currentIdea && (
        <div className="space-y-4">
          <IdeaCard
            idea={{
              id: 'temp-' + Date.now(),
              user_id: 'temp',
              content: currentIdea,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }}
          />
          
          <div className="flex justify-center">
            <Button
              onClick={saveIdea}
              disabled={isSaving}
              variant="outline"
            >
              {isSaving ? 'Saving...' : 'Save This Idea'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}