import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { IdeaCardProps } from '@/types'

export function IdeaCard({ idea, onDelete }: IdeaCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  
  const handleDelete = async () => {
    if (!onDelete) return
    
    setIsDeleting(true)
    try {
      await onDelete(idea.id)
    } catch (error) {
      console.error('Error deleting idea:', error)
    } finally {
      setIsDeleting(false)
    }
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">
          {idea.content.persona} × {idea.content.technology}
        </CardTitle>
        <CardDescription>
          Generated on {formatDate(idea.content.generatedAt)}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {idea.content.description && (
          <p className="text-sm text-gray-700 leading-relaxed">
            {idea.content.description}
          </p>
        )}
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-500">Persona:</span>
            <p className="text-gray-900">{idea.content.persona}</p>
          </div>
          
          <div>
            <span className="font-medium text-gray-500">Problem:</span>
            <p className="text-gray-900">{idea.content.problem}</p>
          </div>
          
          <div>
            <span className="font-medium text-gray-500">Technology:</span>
            <p className="text-gray-900">{idea.content.technology}</p>
          </div>
          
          <div>
            <span className="font-medium text-gray-500">Business Model:</span>
            <p className="text-gray-900">{idea.content.businessModel}</p>
          </div>
          
          {idea.content.format && (
            <div className="col-span-2">
              <span className="font-medium text-gray-500">Format:</span>
              <p className="text-gray-900">{idea.content.format}</p>
            </div>
          )}
        </div>
      </CardContent>
      
      {onDelete && (
        <CardFooter>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}