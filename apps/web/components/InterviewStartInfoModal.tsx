"use client"

import * as React from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface InterviewStartInfoModalProps {
  open: boolean
  onStart: () => void
  onClose: () => void
}

export function InterviewStartInfoModal({ open, onStart, onClose }: InterviewStartInfoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl mx-auto flex flex-col items-center gap-8 p-8 border-2 border-black">
        <div className="w-full text-center text-base mb-8">
          <p>
            Please note that this interview will be with an AI interviewer.<br />
            You will answer each question by speaking out loud, so find a quiet spot and make sure your internet connection is stable.
          </p>
        </div>
        <Button size="lg" className="w-56" onClick={onStart} variant="outline">
          Start interview
        </Button>
      </DialogContent>
    </Dialog>
  )
} 