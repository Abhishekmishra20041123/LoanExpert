'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, User } from 'lucide-react'
import Link from 'next/link'

type Post = {
  id: string
  title: string
  excerpt: string
  category: string
  author: string
  publishedAt: string
  readTime: string
  imageUrl: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/public/blog')

        if (!response.ok) return

        const data = await response.json()

        if (data?.posts?.length > 0) {
          setPosts(
            data.posts.map((p: any) => ({
              id: p.id,
              title: p.title,
              excerpt: p.excerpt,
              category: p.category,
              author: p.author,
              publishedAt: p.publishedAt
                ? new Date(p.publishedAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : '',
              readTime: p.readTime,
              imageUrl: p.imageUrl,
            }))
          )
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const categories = [
    'All',
    ...Array.from(new Set(posts.map((p) => p.category))),
  ]

  const filtered =
    activeCategory === 'All'
      ? posts
      : posts.filter((p) => p.category === activeCategory)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12 md:py-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-foreground">
              LoanExpert Insights
            </h1>

            <p className="text-muted-foreground text-lg max-w-2xl">
              Expert advice, financial tips, and market updates to help you make smarter loan decisions.
            </p>
          </div>

          {!loading && categories.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {categories.slice(0, 6).map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-full text-xs font-bold"
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-border overflow-hidden animate-pulse"
              >
                <div className="h-56 bg-muted" />

                <div className="p-6 space-y-4">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-6 bg-muted rounded w-full" />
                  <div className="h-6 bg-muted rounded w-4/5" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (

          /* No Posts */
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              No posts available yet.
            </p>
          </div>
        ) : (

          /* Actual Posts */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((post) => (
              <Card
                key={post.id}
                className="group border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl overflow-hidden flex flex-col"
              >
                
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-muted">
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}

                  <div className="absolute top-4 left-4">
                    <span className="bg-primary px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <CardHeader className="pt-6">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    
                    {post.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.publishedAt}
                      </span>
                    )}

                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </h3>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col space-y-6">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto pt-6 border-t border-border/30 flex justify-between items-center">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                      {post.readTime}
                    </span>

                    <Link
                      href={`/blog/${post.id}`}
                      className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
