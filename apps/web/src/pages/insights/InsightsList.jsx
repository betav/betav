import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Clock, ArrowRight, BookOpen } from 'lucide-react'
import { Input } from '../../components/ui/input.jsx'
import { Badge } from '../../components/ui/badge.jsx'
import { COMPANY_NAME } from '../../lib/config.js'
import { getArticles } from '../../lib/api.js'
import { formatDate, truncate } from '../../lib/utils.js'

export default function InsightsList() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [lang] = useState(() => localStorage.getItem('lang') || 'en')

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await getArticles({ lang, search, category, limit: 20 })
        setArticles(data.items || data || [])
      } catch {
        setArticles([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [search, category, lang])

  const featured = articles[0]
  const rest = articles.slice(1)

  return (
    <>
      <Helmet>
        <title>Insights — {COMPANY_NAME}</title>
        <meta name="description" content="African logistics, mining, cross-border trade and infrastructure insights from Alpha Empire Logistics." />
      </Helmet>

      <div className="pt-24">
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-12"
            >
              <div className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">Intelligence</div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                Logistics <span className="gold-text">Insights</span>
              </h1>
              <p className="text-silver/70 max-w-xl mx-auto">
                Cross-border trade intelligence, mining logistics updates, and African supply chain analysis.
              </p>
            </motion.div>

            {/* Search */}
            <div className="max-w-lg mx-auto mb-12 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-silver/40" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search insights..."
                className="pl-10 bg-charcoal border-gold/20 text-white placeholder:text-silver/30 focus:border-gold"
              />
            </div>

            {loading ? (
              <div className="text-center py-20 text-silver/50">Loading insights...</div>
            ) : articles.length === 0 ? (
              <div className="text-center py-20 text-silver/50">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No insights published yet. Check back soon.</p>
              </div>
            ) : (
              <>
                {/* Featured */}
                {featured && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="mb-12"
                  >
                    <Link to={`/insights/${featured.slug}`} className="block glass rounded-2xl overflow-hidden hover:border-gold/30 transition-all group">
                      <div className="p-8 md:p-12">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge variant="gold">Featured</Badge>
                          {featured.category && <Badge variant="gold-outline">{featured.category}</Badge>}
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black text-white group-hover:text-gold transition-colors mb-4 leading-tight">
                          {featured.title}
                        </h2>
                        <p className="text-silver/70 text-base leading-relaxed mb-6 max-w-3xl">
                          {truncate(featured.excerpt || featured.content, 250)}
                        </p>
                        <div className="flex items-center gap-4 text-silver/50 text-sm">
                          {featured.author && <span>{featured.author}</span>}
                          {featured.published_at && <span>{formatDate(featured.published_at)}</span>}
                          {featured.reading_time && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" /> {featured.reading_time} min read
                            </span>
                          )}
                          <span className="ml-auto text-gold font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read More <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((article, i) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.07 }}
                    >
                      <Link to={`/insights/${article.slug}`} className="block glass rounded-xl p-6 h-full hover:border-gold/30 transition-all group hover:-translate-y-1">
                        {article.category && (
                          <Badge variant="gold-outline" className="mb-3 text-xs">{article.category}</Badge>
                        )}
                        <h3 className="text-white font-bold text-base group-hover:text-gold transition-colors mb-3 leading-tight">
                          {article.title}
                        </h3>
                        <p className="text-silver/60 text-sm leading-relaxed mb-4">
                          {truncate(article.excerpt || '', 120)}
                        </p>
                        <div className="flex items-center gap-3 text-silver/40 text-xs mt-auto">
                          {article.published_at && <span>{formatDate(article.published_at)}</span>}
                          {article.reading_time && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {article.reading_time}m
                            </span>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
