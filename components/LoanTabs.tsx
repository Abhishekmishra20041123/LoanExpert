'use client'

import { useState } from 'react'
import { useResponsive } from '@/hooks/useResponsive'
import { ChevronDown } from 'lucide-react'

export type TabItem = {
  id: string
  label: string
  icon?: React.ReactNode
}

interface LoanTabsProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

export default function LoanTabs({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}: LoanTabsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { isMobile } = useResponsive()

  const activeTabData = tabs.find((tab) => tab.id === activeTab)

  if (isMobile) {
    // Mobile: Dropdown view
    return (
      <div className={`relative mb-6 ${className}`}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="
            w-full flex items-center justify-between
            px-4 py-3 rounded-lg
            bg-muted border border-border
            text-sm font-medium
            hover:bg-muted/80 transition-colors
          "
        >
          <span className="flex items-center gap-2">
            {activeTabData?.icon && <span>{activeTabData.icon}</span>}
            {activeTabData?.label}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg z-50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id)
                  setIsDropdownOpen(false)
                }}
                className={`
                  w-full text-left px-4 py-3 text-sm
                  border-b border-border last:border-b-0
                  transition-colors
                  ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'hover:bg-muted'
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  {tab.icon && <span>{tab.icon}</span>}
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Desktop: Inline tabs view
  return (
    <div className={`flex flex-wrap gap-2 mb-8 border-b border-border pb-4 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            flex items-center gap-2 px-4 py-2 text-sm font-medium
            rounded-lg transition-all duration-200
            border-b-2
            ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }
          `}
        >
          {tab.icon && <span>{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  )
}
