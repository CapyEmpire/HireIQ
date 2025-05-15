import { Button } from "@/components/ui/button"

export default function InterviewsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Interviews</h1>
        <Button>Create New Interview</Button>
      </div>
      
      <div className="grid gap-4">
        {/* Interview list will go here */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold">Sample Interview</h2>
          <p className="text-muted-foreground">Created on May 15, 2024</p>
        </div>
      </div>
    </div>
  )
} 