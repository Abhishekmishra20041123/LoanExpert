'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card } from '@/components/ui/card'
import { ArrowRight, CheckCircle2, TrendingDown, Users } from 'lucide-react'

export default function Home() {
  const [scanStep, setScanStep] = useState(0)
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/public/site-settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings?.siteContent) {
          setContent(data.settings.siteContent)
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const nodes = content?.animationNodes || []
  const totalSteps = nodes.length + 1

  useEffect(() => {
    if (!nodes.length) return

    const timer = setInterval(() => {
      setScanStep(s => (s + 1) % totalSteps)
    }, 2000)

    return () => clearInterval(timer)
  }, [totalSteps, nodes.length])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground text-sm animate-pulse">
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Header />

      {/* Hero Section */}
      <section className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                {content?.heroTitle && (
                  <h1 className="text-4xl sm:text-5xl font-bold text-balance text-foreground leading-tight">
                    {content.heroTitle}
                  </h1>
                )}

                {content?.heroSubtitle && (
                  <p className="text-lg text-muted-foreground max-w-xl leading-relaxed whitespace-pre-line">
                    {content.heroSubtitle}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/loans">
                  <Button size="lg" className="w-full sm:w-auto">
                    Explore Loans
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>

                <Link href="/eligibility">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Check Eligibility
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 pt-6">
                {content?.trustIndicator1 && (
                  <div className="group border-l-2 border-primary/20 pl-4 hover:border-primary transition-all">
                    <p className="text-3xl font-black text-primary tracking-tighter tabular-nums">
                      {content.trustIndicator1.split(' ')[0]}
                    </p>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                      {content.trustIndicator1.split(' ').slice(1).join(' ')}
                    </p>
                  </div>
                )}

                {content?.trustIndicator2 && (
                  <div className="group border-l-2 border-accent/20 pl-4 hover:border-accent transition-all">
                    <p className="text-3xl font-black text-accent tracking-tighter tabular-nums">
                      {content.trustIndicator2.split(' ')[0]}
                    </p>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                      {content.trustIndicator2.split(' ').slice(1).join(' ')}
                    </p>
                  </div>
                )}

                {content?.trustIndicator3 && (
                  <div className="group border-l-2 border-primary/20 pl-4 hover:border-primary transition-all col-span-2 md:col-span-1">
                    <p className="text-3xl font-black text-primary tracking-tighter tabular-nums">
                      {content.trustIndicator3.split(' ')[0]}
                    </p>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                      {content.trustIndicator3.split(' ').slice(1).join(' ')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Animated Loan Finder Graphic */}
            {nodes.length > 0 && (
              <div className="w-full max-w-[320px] sm:max-w-[420px] lg:max-w-none lg:w-[450px] relative mt-16 lg:mt-0 aspect-square flex items-center justify-center pointer-events-none mx-auto lg:mx-0">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl opacity-50" />

                {/* Orbital Rings */}
                <div className="absolute inset-4 border-[1.5px] border-primary/20 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-16 border-[1.5px] border-accent/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                <div className="absolute inset-28 border border-primary/10 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />

                {/* Central Hub */}
                <div className="relative z-10 w-44 h-44 bg-background/95 backdrop-blur-md rounded-full border-4 border-primary/30 flex flex-col items-center justify-center shadow-2xl shadow-primary/20 gap-3">
                  <div className="text-5xl animate-bounce">
                    {scanStep === totalSteps - 1
                      ? '✨'
                      : scanStep === 0
                      ? '🏦'
                      : scanStep === 1
                      ? '📊'
                      : '⚡'}
                  </div>

                  <div className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent text-center px-4 leading-tight">
                    {scanStep === totalSteps - 1
                      ? content?.finalNodeStatus
                      : nodes[scanStep]?.statusText}
                  </div>
                </div>

                {/* Floating Orbiting Elements */}
                {nodes.map((node: any, idx: number) => {
                  const isActive = scanStep === idx

                  const positionClasses = [
                    'top-6 right-1/4',
                    'bottom-1/4 right-0',
                    'bottom-6 left-1/4',
                    'bottom-6 right-1/4',
                    'top-1/4 left-10',
                  ][idx % 5]

                  const currentEmoji = node.icon
                  const currentIcon = (
                    <span className="text-[26px] mb-0.5 leading-none">
                      {currentEmoji}
                    </span>
                  )

                  const ringClass = [
                    'ring-primary shadow-primary/30',
                    'ring-accent shadow-accent/30',
                    'ring-primary shadow-primary/30',
                  ][idx % 3]

                  return (
                    <div
                      key={idx}
                      className={`absolute ${positionClasses} w-16 h-16 bg-card rounded-2xl shadow-xl flex flex-col items-center justify-center border border-border transition-all duration-700 ease-in-out ${
                        isActive
                          ? `scale-125 ring-4 ${ringClass} z-20`
                          : 'scale-90 opacity-40 z-0 grayscale'
                      }`}
                    >
                      {currentIcon}

                      <span className="text-[9px] font-bold text-muted-foreground leading-none">
                        {node.label}
                      </span>
                    </div>
                  )
                })}

                <div
                  className={`absolute top-1/4 left-0 w-24 h-24 bg-card rounded-full shadow-2xl flex flex-col items-center justify-center border-4 border-green-500 transition-all duration-700 ease-out ${
                    scanStep === totalSteps - 1
                      ? 'scale-110 z-30 shadow-green-500/40 bg-green-50 dark:bg-green-950/30'
                      : 'scale-50 opacity-0 z-0'
                  }`}
                >
                  <span className="text-xs font-bold text-muted-foreground mb-0.5">
                    {content?.finalNodeLabel}
                  </span>

                  <span className="font-black text-2xl text-green-600 dark:text-green-400 leading-none">
                    {content?.finalNodeValue}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose LoanExpert?
            </h2>

            <p className="text-muted-foreground max-w-2xl mx-auto">
              We help you make informed decisions with expert guidance and transparent tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <TrendingDown className="w-6 h-6 text-primary" />
                <h3 className="font-bold text-foreground">Best Rates</h3>
              </div>

              <p className="text-muted-foreground text-sm">
                Compare interest rates from 20+ banks and find the lowest EMI for your loan.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-accent" />
                <h3 className="font-bold text-foreground">Expert Picks</h3>
              </div>

              <p className="text-muted-foreground text-sm">
                Our expert recommendations help you choose the best bank for your financial needs.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-secondary" />
                <h3 className="font-bold text-foreground">
                  Trusted by Thousands
                </h3>
              </div>

              <p className="text-muted-foreground text-sm">
                Join thousands of satisfied customers who have found the perfect loan.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
