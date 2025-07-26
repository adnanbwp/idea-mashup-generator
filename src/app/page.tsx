import { IdeaGenerator } from '@/components/idea-generator'

export default function HomePage() {
  return (
    <div className="text-center space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Generate Your Next Big Idea
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover unique business opportunities by combining random personas, problems, 
          technologies, and business models into structured ideas.
        </p>
      </div>
      
      <IdeaGenerator />
    </div>
  )
}