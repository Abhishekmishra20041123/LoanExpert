'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Award, Briefcase, MapPin, Phone, Mail, Star,
  Linkedin, Instagram, Twitter, Facebook, Youtube,
  ArrowRight, CheckCircle2, Loader2, Shield
} from 'lucide-react'

type AgentProfile = {
  fullName: string
  title: string
  photoUrl: string
  bio: string
  experience: string
  achievements: string[]
  certifications: string[]
  specializations: string[]
  linkedinUrl: string
  instagramUrl: string
  twitterUrl: string
  facebookUrl: string
  youtubeUrl: string
  personalPhone: string
  personalEmail: string
  location: string
}

export default function AboutPage() {
  const [profile, setProfile] = useState<AgentProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/public/agent-profile')
      .then(r => r.json())
      .then(data => setProfile(data.profile))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
        <Footer />
      </div>
    )
  }

  const p = profile || {
    fullName: 'Your Loan Expert',
    title: 'Senior Loan Advisor',
    photoUrl: '',
    bio: 'Experienced loan professional dedicated to helping you find the best financing solutions.',
    experience: '10+ years in Banking & Financial Services',
    achievements: [],
    certifications: [],
    specializations: ['Home Loans', 'Personal Loans', 'Business Loans'],
    linkedinUrl: '', instagramUrl: '', twitterUrl: '', facebookUrl: '', youtubeUrl: '',
    personalPhone: '', personalEmail: '', location: '',
  }

  const socialLinks = [
    { url: p.linkedinUrl, icon: Linkedin, label: 'LinkedIn', color: 'hover:text-[#0A66C2]' },
    { url: p.instagramUrl, icon: Instagram, label: 'Instagram', color: 'hover:text-[#E4405F]' },
    { url: p.twitterUrl, icon: Twitter, label: 'Twitter', color: 'hover:text-[#1DA1F2]' },
    { url: p.facebookUrl, icon: Facebook, label: 'Facebook', color: 'hover:text-[#1877F2]' },
    { url: p.youtubeUrl, icon: Youtube, label: 'YouTube', color: 'hover:text-[#FF0000]' },
  ].filter(s => s.url)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-background py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Photo */}
            <div className="shrink-0">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/20 overflow-hidden">
                {p.photoUrl ? (
                  <img src={p.photoUrl} alt={p.fullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-7xl text-white font-bold">
                    {p.fullName ? p.fullName.charAt(0).toUpperCase() : '👤'}
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="text-center lg:text-left space-y-5">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
                  {p.fullName || 'Your Loan Expert'}
                </h1>
                <p className="text-xl text-primary font-semibold">{p.title}</p>
              </div>

              {p.experience && (
                <div className="flex items-center gap-2 justify-center lg:justify-start text-muted-foreground">
                  <Briefcase className="w-5 h-5" />
                  <span>{p.experience}</span>
                </div>
              )}

              {p.location && (
                <div className="flex items-center gap-2 justify-center lg:justify-start text-muted-foreground">
                  <MapPin className="w-5 h-5" />
                  <span>{p.location}</span>
                </div>
              )}

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-3 justify-center lg:justify-start pt-2">
                  {socialLinks.map(s => {
                    const Icon = s.icon
                    return (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-11 h-11 rounded-xl bg-muted flex items-center justify-center text-muted-foreground transition-all hover:scale-110 ${s.color}`}
                        title={s.label}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    )
                  })}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                <Link href="/contact">
                  <Button size="lg" className="gap-2">
                    Book Free Consultation <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                {p.personalPhone && (
                  <a href={`tel:${p.personalPhone}`}>
                    <Button variant="outline" size="lg" className="gap-2 w-full">
                      <Phone className="w-4 h-4" /> Call Now
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      {p.bio && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-foreground mb-6">About Me</h2>
            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
              {p.bio}
            </p>
          </div>
        </section>
      )}

      {/* Specializations + Achievements */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Specializations */}
            {p.specializations.length > 0 && (
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Specializations</h3>
                </div>
                <ul className="space-y-3">
                  {p.specializations.map((s, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Achievements */}
            {p.achievements.length > 0 && (
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Achievements</h3>
                </div>
                <ul className="space-y-3">
                  {p.achievements.map((a, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <Award className="w-5 h-5 text-amber-500 shrink-0" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Certifications */}
            {p.certifications.length > 0 && (
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Certifications</h3>
                </div>
                <ul className="space-y-3">
                  {p.certifications.map((c, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Card className="p-10 text-center bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Get the Best Loan Deal?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              With years of experience and deep banking relationships, I can help you get the best rates and fastest approvals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              {p.personalEmail && (
                <a href={`mailto:${p.personalEmail}`}>
                  <Button variant="outline" size="lg" className="gap-2 w-full">
                    <Mail className="w-4 h-4" /> Email Me
                  </Button>
                </a>
              )}
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
