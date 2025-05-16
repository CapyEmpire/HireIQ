"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import * as React from "react"
import { CaptionProps, useNavigation } from "react-day-picker"
import { InterviewStartInfoModal } from "@/components/InterviewStartInfoModal"

const months = [
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
]

function CustomCalendarCaption({ displayMonth }: CaptionProps) {
  const { goToMonth } = useNavigation();
  const year = displayMonth.getFullYear()
  const month = displayMonth.getMonth()
  const fromYear = 1900
  const toYear = new Date().getFullYear()
  return (
    <div className="flex items-center gap-2 justify-center p-2">
      <select
        className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
        value={month}
        onChange={e => goToMonth && goToMonth(new Date(year, Number(e.target.value), 1))}
      >
        {months.map((m, idx) => (
          <option key={m} value={idx}>{m}</option>
        ))}
      </select>
      <select
        className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
        value={year}
        onChange={e => goToMonth && goToMonth(new Date(Number(e.target.value), month, 1))}
      >
        {Array.from({ length: toYear - fromYear + 1 }, (_, i) => fromYear + i).map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  )
}

export default function TestInterviewPage() {
  const [dob, setDob] = React.useState<Date | undefined>(undefined)
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  })
  const [touched, setTouched] = React.useState<{[k: string]: boolean}>({})
  const [showStartInfo, setShowStartInfo] = React.useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched({ ...touched, [e.target.name]: true })
  }

  const isValid = form.firstName && form.lastName && form.email

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault()
    setShowStartInfo(true)
  }

  const handleStartInterview = () => {
    setShowStartInfo(false)
  }

  return (
    <>
      <InterviewStartInfoModal open={showStartInfo} onStart={handleStartInterview} onClose={() => setShowStartInfo(false)} />
      {!showStartInfo && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="max-w-2xl w-full bg-white border border-gray-300 rounded-lg mx-auto mt-4 mb-8">
            <h1 className="text-2xl font-semibold text-center mt-6 mb-4">Welcome to HireIQ</h1>
            <div className="border-t border-b border-gray-200 py-6 px-8 text-base">
              <p className="mb-4">
                This short AI-powered interview helps your future employer better understand your skills and personality. It only takes about 10–15 minutes.
              </p>
              <p className="mb-4">
                You'll be asked a few behavioral questions and, optionally, you can connect your public social profiles to strengthen your application.
              </p>
              <p className="mb-0 font-medium">Disclaimers:</p>
            </div>
          </div>
          <form className="w-full max-w-3xl" autoComplete="off" onSubmit={handleContinue}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8">
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName" className="font-semibold text-muted-foreground">First Name</label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className="bg-muted"
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="lastName" className="font-semibold text-muted-foreground">Last Name</label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className="bg-muted"
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-semibold text-muted-foreground">Email</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className="bg-muted"
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="font-semibold text-muted-foreground">Phone (Optional)</label>
                <Input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="bg-muted"
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="dob" className="font-semibold text-muted-foreground">Date of Birth (Opt)</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Input
                      id="dob"
                      name="dob"
                      value={dob ? dob.toLocaleDateString() : ""}
                      placeholder="MM/DD/YYYY"
                      readOnly
                      className="bg-muted cursor-pointer text-left"
                    />
                  </PopoverTrigger>
                  <PopoverContent align="start" side="top" className="p-0 w-auto">
                    <Calendar
                      mode="single"
                      selected={dob}
                      onSelect={setDob}
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                      initialFocus
                      captionLayout="dropdown"
                      components={{ Caption: CustomCalendarCaption }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex justify-center mt-12">
              <Button size="lg" className="w-56" type="submit" disabled={!isValid}>
                Start Interview
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  )
} 