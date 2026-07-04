import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Plus, Search, FileText } from 'lucide-react'
import { Button } from '../../components/ui/button.jsx'
import { Input } from '../../components/ui/input.jsx'
import { Badge } from '../../components/ui/badge.jsx'
import { AdminLayout } from './AdminDashboard.jsx'
import { getAdminArticles, approveArticle, rejectArticle } from '../../lib/api.js'
import { formatDate, truncate } from '../../lib/utils.js'

const statusColors = {
  published: 'bg-green-400/20 text-green-400 border-green-400/30',
  pending_review: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30',
  draft: 'bg-silver/20 text-silver border-silver/30',
  rejected: 'bg-red-400/20 text-red-400 border-red-400/30',
  approved: 'bg-blue-400/20 text-blue-400 border-blue-400/30',
}

export default function AdminArticles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getAdminArticles({ limit: 100 })
      .then(data => setArticles(data.items || data || []))
      .catch(() => toast.error('Failed to load articles'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = articles.filter(a =>
    a.title?.toLowerCase().includes(search.toLowerCase()) ||
    a.author?.toLowerCase().includes(search.toLowerCase())
  )

  const handleApprove = async (id) => {
    try {
      await approveArticle(id)
      setArticles(prev => prev.map(a => a.id === id ? { ...a, status: 'published' } : a))
      toast.success('Published!')
    } catch { toast.error('Failed') }
  }

  const handleReject = async (id) => {
    try {
      await rejectArticle(id)
      setArticles(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a))
      toast.success('Rejected')
    } catch { toast.error('Failed') }
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-white">Articles</h1>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-silver/40" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="pl-10 bg-charcoal border-gold/20 text-white placeholder:text-silver/30"
          />
        </div>

        {loading ? (
          <div className="text-center py-20 text-silver/50">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 glass rounded-2xl">
            <FileText className="h-12 w-12 text-silver/20 mx-auto mb-4" />
            <p className="text-silver/50">No articles found</p>
          </div>
        ) : (
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold/10 text-silver/40 text-xs uppercase tracking-wider">
                  <th className="text-left px-6 py-4">Title</th>
                  <th className="text-left px-6 py-4 hidden md:table-cell">Author</th>
                  <th className="text-left px-6 py-4 hidden lg:table-cell">Source</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4 hidden md:table-cell">Date</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {filtered.map(article => (
                  <tr key={article.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-white text-sm font-medium">{truncate(article.title, 60)}</div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-silver/60 text-sm">{article.author || '—'}</td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      {article.source === 'cowork' ? (
                        <Badge variant="silver" className="text-xs">AI</Badge>
                      ) : (
                        <Badge variant="gold-outline" className="text-xs">Human</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex text-xs px-2 py-1 rounded-full border ${statusColors[article.status] || ''}`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-silver/50 text-xs">
                      {formatDate(article.created)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {article.status === 'pending_review' && (
                          <>
                            <Button size="sm" variant="gold" onClick={() => handleApprove(article.id)} className="h-7 px-2 text-xs">Approve</Button>
                            <Button size="sm" variant="outline" onClick={() => handleReject(article.id)} className="h-7 px-2 text-xs text-red-400 border-red-400/20 hover:bg-red-400/10">Reject</Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
