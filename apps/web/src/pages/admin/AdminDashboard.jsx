import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { LogOut, FileText, Eye, CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react'
import { Button } from '../../components/ui/button.jsx'
import { Badge } from '../../components/ui/badge.jsx'
import { getAdminArticles, approveArticle, rejectArticle } from '../../lib/api.js'
import { COMPANY_NAME } from '../../lib/config.js'
import { formatDate } from '../../lib/utils.js'

function AdminLayout({ children }) {
  const navigate = useNavigate()
  const logout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
    toast.success('Logged out')
  }

  return (
    <div className="min-h-screen bg-charcoal-dark">
      {/* Top bar */}
      <header className="glass border-b border-gold/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center">
            <span className="text-charcoal-dark font-black text-xs">AE</span>
          </div>
          <span className="text-white font-bold">{COMPANY_NAME}</span>
          <span className="text-silver/40 text-sm">Admin</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/admin" className="text-silver/70 hover:text-gold transition-colors">Dashboard</Link>
          <Link to="/admin/review" className="text-silver/70 hover:text-gold transition-colors">Review Queue</Link>
          <Link to="/admin/articles" className="text-silver/70 hover:text-gold transition-colors">Articles</Link>
          <Link to="/admin/categories" className="text-silver/70 hover:text-gold transition-colors">Categories</Link>
          <Link to="/" className="text-silver/70 hover:text-gold transition-colors">View Site</Link>
        </nav>
        <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5 text-silver/50 hover:text-red-400">
          <LogOut className="h-4 w-4" /> Logout
        </Button>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}

export { AdminLayout }

export default function AdminDashboard() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminArticles({ limit: 100 })
      .then(data => setArticles(data.items || data || []))
      .catch(() => toast.error('Failed to load articles'))
      .finally(() => setLoading(false))
  }, [])

  const stats = {
    total: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    pending: articles.filter(a => a.status === 'pending_review').length,
    draft: articles.filter(a => a.status === 'draft').length,
  }

  const chartData = [
    { name: 'Published', count: stats.published },
    { name: 'Pending', count: stats.pending },
    { name: 'Draft', count: stats.draft },
    { name: 'Rejected', count: articles.filter(a => a.status === 'rejected').length },
  ]

  const pending = articles.filter(a => a.status === 'pending_review')

  const handleApprove = async (id) => {
    try {
      await approveArticle(id)
      setArticles(prev => prev.map(a => a.id === id ? { ...a, status: 'published' } : a))
      toast.success('Article approved and published')
    } catch { toast.error('Failed to approve') }
  }

  const handleReject = async (id) => {
    try {
      await rejectArticle(id)
      setArticles(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a))
      toast.success('Article rejected')
    } catch { toast.error('Failed to reject') }
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-2xl font-black text-white">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: FileText, label: 'Total Articles', value: stats.total, color: 'text-silver' },
            { icon: CheckCircle, label: 'Published', value: stats.published, color: 'text-green-400' },
            { icon: Clock, label: 'Pending Review', value: stats.pending, color: 'text-yellow-400' },
            { icon: AlertCircle, label: 'Drafts', value: stats.draft, color: 'text-silver/50' },
          ].map(stat => (
            <div key={stat.label} className="glass rounded-xl p-5">
              <stat.icon className={`h-5 w-5 ${stat.color} mb-3`} />
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-silver/50 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-white font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gold" /> Article Status Overview
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#A8A9AD" tick={{ fontSize: 12 }} />
              <YAxis stroke="#A8A9AD" tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.2)', color: '#fff' }} />
              <Bar dataKey="count" fill="#C9A84C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Review Queue */}
        {pending.length > 0 && (
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-400" /> Review Queue
                <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">{pending.length}</Badge>
              </h2>
              <Link to="/admin/review" className="text-gold text-sm hover:underline">View All →</Link>
            </div>
            <div className="space-y-3">
              {pending.slice(0, 3).map(article => (
                <div key={article.id} className="flex items-start gap-4 p-4 rounded-xl bg-charcoal/50 border border-gold/10">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold text-sm truncate">{article.title}</h3>
                      {article.source === 'cowork' && <Badge variant="silver" className="text-xs shrink-0">AI</Badge>}
                    </div>
                    <p className="text-silver/50 text-xs">{formatDate(article.created)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" variant="gold" onClick={() => handleApprove(article.id)} className="text-xs h-7 px-3">Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => handleReject(article.id)} className="text-xs h-7 px-3 text-red-400 border-red-400/20 hover:bg-red-400/10">Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
