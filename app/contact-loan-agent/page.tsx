'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function ContactLoanAgentRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/contact')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
        <p className="text-muted-foreground font-medium">Redirecting to our new unified contact center...</p>
      </div>
    </div>
  )
}
