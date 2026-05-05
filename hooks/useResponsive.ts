'use client'

import { useEffect, useState } from 'react'

export type BreakPoint = 'mobile' | 'tablet' | 'desktop'

export const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState<BreakPoint>('desktop')
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth

      if (width < 640) {
        setBreakpoint('mobile')
        setIsMobile(true)
        setIsTablet(false)
        setIsDesktop(false)
      } else if (width >= 640 && width < 1024) {
        setBreakpoint('tablet')
        setIsMobile(false)
        setIsTablet(true)
        setIsDesktop(false)
      } else {
        setBreakpoint('desktop')
        setIsMobile(false)
        setIsTablet(false)
        setIsDesktop(true)
      }
    }

    // Set initial breakpoint
    handleResize()

    // Add event listener
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { breakpoint, isMobile, isTablet, isDesktop }
}

export const getResponsiveValue = <T,>(
  mobile: T,
  tablet: T,
  desktop: T,
  breakpoint: BreakPoint
): T => {
  switch (breakpoint) {
    case 'mobile':
      return mobile
    case 'tablet':
      return tablet
    case 'desktop':
      return desktop
  }
}
