import { Button } from "@/components/ui/button"

interface InterviewStartPageProps {
  params: {
    id: string
  }
}

export default function InterviewStartPage({ params }: InterviewStartPageProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Your Interview</h1>
        <p className="text-muted-foreground mb-8">
          This interview consists of several questions. Please take your time to provide thoughtful answers.
        </p>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg text-left">
            <h2 className="font-semibold mb-2">Instructions</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>You will have 30 minutes to complete the interview</li>
              <li>Each question has a time limit</li>
              <li>Make sure you have a quiet environment</li>
              <li>Test your microphone and camera before starting</li>
            </ul>
          </div>
          
          <Button size="lg" className="w-full">
            Start Interview
          </Button>
        </div>
      </div>
    </div>
  )
} 