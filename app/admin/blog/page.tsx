'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit2, Trash2, Plus, X, FileText, Eye, EyeOff, Search } from 'lucide-react'

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  author: string
  imageUrl: string
  readTime: string
  isPublished: boolean
  publishedAt: string
  createdAt: string
}

const CATEGORIES = ['General', 'Personal Loan', 'Home Loan', 'Business', 'Credit Score', 'Car Loan', 'LAP', 'Investment']

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  category: 'General',
  author: 'Admin',
  imageUrl: '',
  readTime: '5 min read',
  isPublished: false,
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  const fetchPosts = async () => {
    const res = await fetch('/api/admin/blog', { credentials: 'include' })
    if (res.ok) {
      const data = await res.json()
      setPosts(data.posts || [])
    }
    setLoading(false)
  }

  useEffect(() => { fetchPosts() }, [])

  const resetForm = () => {
    setForm({ ...emptyForm })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (post: BlogPost) => {
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      author: post.author,
      imageUrl: post.imageUrl,
      readTime: post.readTime,
      isPublished: post.isPublished,
    })
    setEditingId(post.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      if (editingId) {
        await fetch(`/api/admin/blog/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form),
        })
      } else {
        await fetch('/api/admin/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form),
        })
      }
      await fetchPosts()
      resetForm()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE', credentials: 'include' })
    await fetchPosts()
  }

  const handleTogglePublish = async (post: BlogPost) => {
    await fetch(`/api/admin/blog/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ...post, isPublished: !post.isPublished }),
    })
    await fetchPosts()
  }

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.author.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog Manager</h1>
          <p className="text-muted-foreground mt-1">Create and manage blog posts shown on the public blog page</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true) }} className="gap-2">
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="p-6 mb-8 border-primary/30">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              {editingId ? 'Edit Post' : 'New Blog Post'}
            </h2>
            <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-foreground block mb-1.5">Title *</label>
              <Input
                placeholder="Blog post title..."
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Author</label>
              <Input
                placeholder="Author name"
                value={form.author}
                onChange={e => setForm({ ...form, author: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Read Time</label>
              <Input
                placeholder="e.g. 5 min read"
                value={form.readTime}
                onChange={e => setForm({ ...form, readTime: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Image URL</label>
              <Input
                placeholder="https://..."
                value={form.imageUrl}
                onChange={e => setForm({ ...form, imageUrl: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-foreground block mb-1.5">Excerpt / Summary</label>
              <textarea
                value={form.excerpt}
                onChange={e => setForm({ ...form, excerpt: e.target.value })}
                placeholder="Short description shown in the blog listing..."
                className="w-full border rounded-lg p-3 min-h-20 bg-background text-foreground border-input"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-foreground block mb-1.5">Content (Full Article)</label>
              <textarea
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                placeholder="Full blog post content..."
                className="w-full border rounded-lg p-3 min-h-48 bg-background text-foreground border-input"
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={e => setForm({ ...form, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded border-input accent-primary"
                />
                <span className="text-sm font-medium text-foreground">Publish immediately</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Post' : 'Create Post'}
            </Button>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          </div>
        </Card>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search posts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Posts List */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading posts...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground">No blog posts yet. Create one to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map(post => (
              <div key={post.id} className="p-5 flex items-start gap-4 hover:bg-muted/30">
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-20 h-14 object-cover rounded-lg shrink-0"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {post.category}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          post.isPublished
                            ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {post.isPublished ? '● Published' : '○ Draft'}
                        </span>
                      </div>
                      <h3 className="font-bold text-foreground leading-snug">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{post.excerpt}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        By {post.author} • {post.readTime} •{' '}
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleTogglePublish(post)}
                        title={post.isPublished ? 'Unpublish' : 'Publish'}
                        className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      >
                        {post.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-1.5 rounded hover:bg-primary/10 transition-colors text-primary"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="mt-4 text-sm text-muted-foreground">
        {filtered.length} post{filtered.length !== 1 ? 's' : ''} •{' '}
        {posts.filter(p => p.isPublished).length} published
      </div>
    </div>
  )
}
