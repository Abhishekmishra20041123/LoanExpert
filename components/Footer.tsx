'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Linkedin, Instagram, Twitter, Facebook, Youtube } from 'lucide-react'

type SocialLinks = {
  linkedinUrl?: string
  instagramUrl?: string
  twitterUrl?: string
  facebookUrl?: string
  youtubeUrl?: string
}

export function Footer() {
  const [socials, setSocials] = useState<SocialLinks>({})

  useEffect(() => {
    fetch('/api/public/agent-profile')
      .then(r => r.json())
      .then(data => {
        if (data.profile) {
          setSocials({
            linkedinUrl: data.profile.linkedinUrl || '',
            instagramUrl: data.profile.instagramUrl || '',
            twitterUrl: data.profile.twitterUrl || '',
            facebookUrl: data.profile.facebookUrl || '',
            youtubeUrl: data.profile.youtubeUrl || '',
          })
        }
      })
      .catch(() => {})
  }, [])

  const socialIcons = [
    { url: socials.linkedinUrl, icon: Linkedin, label: 'LinkedIn' },
    { url: socials.instagramUrl, icon: Instagram, label: 'Instagram' },
    { url: socials.twitterUrl, icon: Twitter, label: 'Twitter' },
    { url: socials.facebookUrl, icon: Facebook, label: 'Facebook' },
    { url: socials.youtubeUrl, icon: Youtube, label: 'YouTube' },
  ].filter(s => s.url)

  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-primary mb-4">LoanExpert</h3>
            <p className="text-sm text-muted-foreground">
              Helping you find the best loan deals from top banks.
            </p>
            {/* Social Links */}
            {socialIcons.length > 0 && (
              <div className="flex items-center gap-3 mt-4">
                {socialIcons.map(s => {
                  const Icon = s.icon
                  return (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
                      title={s.label}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Loan Types</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/loans/personal" className="hover:text-primary transition-colors">
                  Personal Loan
                </Link>
              </li>
              <li>
                <Link href="/loans/home" className="hover:text-primary transition-colors">
                  Home Loan
                </Link>
              </li>
              <li>
                <Link href="/loans/business" className="hover:text-primary transition-colors">
                  Business Loan
                </Link>
              </li>
              <li>
                <Link href="/loans/car" className="hover:text-primary transition-colors">
                  Car Loan
                </Link>
              </li>
              <li>
                <Link href="/loans/lap" className="hover:text-primary transition-colors">
                  Loan Against Property
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Tools</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/eligibility" className="hover:text-primary transition-colors">
                  Eligibility Checker
                </Link>
              </li>
              <li>
                <Link href="/emi-calculator" className="hover:text-primary transition-colors">
                  EMI Calculator
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Help</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {year} LoanExpert. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 sm:mt-0 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
