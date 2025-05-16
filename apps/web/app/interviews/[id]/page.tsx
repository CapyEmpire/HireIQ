import { Button } from "@/components/ui/button"

interface InterviewPageProps {
  params: {
    id: string
  }
}

export default function InterviewPage({ params }: InterviewPageProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Interview Details</h1>
        <div className="space-x-4">
          <Button variant="outline">Edit</Button>
          <Button>Share Link</Button>
        </div>
      </div>
      
      <div className="grid gap-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Interview Information</h2>
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">Draft</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium">May 15, 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 