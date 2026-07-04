import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { CheckCircle, XCircle, Eye, Clock } from 'lucide-react'
import { Button } from '../../components/ui/button.jsx'
import { Badge } from '../../components/ui/badge.jsx'
import { AdminLayout } from './AdminDashboard.jsx'
import { getAdminArticles, approveArticle, rejectArticle } from '../../lib/api.js'
import { formatDate, truncate } from '../../lib/utils.js'

export default function AdminReviewQueue() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState(null)

  const load = () => {
    setLoading(true)
    getAdminArticles({ status: 'pending_review', limit: 50 })
      .then(data => setArticles(data.items || data || []))
      .catch(() => toast.error('Failed to load review queue'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleApprove = async (id) => {
    try {
      await approveArticle(id)
      setArticles(prev => prev.filter(a => a.id !== id))
      if (preview?.id === id) setPreview(null)
      toast.success('Article published!')
    } catch { toast.error('Failed to approve') }
  }

  const handleReject = async (id) => {
    try {
      await rejectArticle(id)
      setArticles(prev => prev.filter(a => a.id !== id))
      if (preview?.id === id) setPreview(null)
      toast.success('Article rejected')
    } catch { toast.error('Failed to reject') }
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Clock className="h-6 w-6 text-yellow-400" /> Review Queue
            {articles.length > 0 && (
              <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">{articles.length}</Badge>
            )}
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-20 text-silver/50">Loading...</div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 glass rounded-2xl">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4 opacity-50" />
            <p className="text-silver/50">Review queue is empty. All caught up!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* List */}
            <div className="space-y-4">
              {articles.map(article => (
                <div
                  key={article.id}
                  className={`glass rounded-xl p-5 border transition-all cursor-pointer ${
                    preview?.id === article.id ? 'border-gold/50' : 'border-gold/10 hover:border-gold/30'
                  }`}
                  onClick={() => setPreview(article)}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-white font-semibold text-sm">{article.title}</h3>
                        {article.source === 'cowork' && (
                          <Badge variant="silver" className="text-xs">AI Draft</Badge>
                        )}
                        {article.source === 'human' && (
                          <Badge variant="gold-outline" className="text-xs">Human</Badge>
                        )}
                      </div>
                      <div className="text-silver/40 text-xs">
                        {article.author && <span className="mr-2">{article.author}</span>}
                        {formatDate(article.created)}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setPreview(article) }}>
                      <Eye className="h-4 w-4 text-silver/50" />
                    </Button>
                  </div>

                  <p className="text-silver/50 text-xs mb-4">{truncate(article.excerpt || '', 120)}</p>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="gold" onClick={(e) => { e.stopPropagation(); handleApprove(article.id) }} className="gap-1.5 h-8">
                      <CheckCircle className="h-3.5 w-3.5" /> Approve & Publish
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => { e.stopPropagation(); handleReject(article.id) }}
                      className="gap-1.5 h-8 text-red-400 border-red-400/20 hover:bg-red-400/10"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Preview pane */}
            <div className="lg:sticky lg:top-4 h-fit">
              {preview ? (
                <div className="glass rounded-2xl p-6 border border-gold/20">
                  <h2 className="text-white font-bold text-lg mb-2">{preview.title}</h2>
                  {preview.excerpt && (
                    <p className="text-silver/70 text-sm italic mb-4 border-l-2 border-gold pl-3">{preview.excerpt}</p>
                  )}
                  <div className="text-silver/60 text-sm leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto pr-2">
                    {preview.content}
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Button variant="gold" onClick={() => handleApprove(preview.id)} className="flex-1 gap-1.5">
                      <CheckCircle className="h-4 w-4" /> Approve
                    </Button>
                    <Button variant="outline" onClick={() => handleReject(preview.id)} className="flex-1 gap-1.5 text-red-400 border-red-400/20 hover:bg-red-400/10">
                      <XCircle className="h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="glass rounded-2xl p-12 text-center border border-gold/10">
                  <Eye className="h-8 w-8 text-silver/20 mx-auto mb-3" />
                  <p className="text-silver/30 text-sm">Click an article to preview</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
