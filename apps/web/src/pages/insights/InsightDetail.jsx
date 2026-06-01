import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { motion } from 'framer-motion'
import { Clock, ArrowLeft, Share2, Calendar } from 'lucide-react'
import { Badge } from '../../components/ui/badge.jsx'
import { COMPANY_NAME } from '../../lib/config.js'
import { getArticle, trackAnalytics } from '../../lib/api.js'
import { formatDate } from '../../lib/utils.js'

export default function InsightDetail() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    getArticle(slug)
      .then(data => {
        setArticle(data)
        trackAnalytics({ article_id: data.id, type: 'view' })
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-gold animate-pulse">Loading article...</div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-4">Article Not Found</h2>
        <p className="text-silver/60 mb-6">This article may have been removed or is not yet published.</p>
        <Link to="/insights" className="text-gold hover:underline flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Insights
        </Link>
      </div>
    )
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <>
      <Helmet>
        <title>{article.seo_title || article.title} — {COMPANY_NAME}</title>
        <meta name="description" content={article.seo_description || article.excerpt || ''} />
        {article.seo_keywords && <meta name="keywords" content={article.seo_keywords} />}
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          datePublished: article.published_at,
          author: { '@type': 'Person', name: article.author },
          publisher: { '@type': 'Organization', name: COMPANY_NAME },
        })}</script>
      </Helmet>

      <div className="pt-24">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Back */}
          <Link to="/insights" className="inline-flex items-center gap-2 text-silver/50 hover:text-gold transition-colors text-sm mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Insights
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Category + Meta */}
            <div className="flex items-center gap-3 mb-5">
              {article.category && <Badge variant="gold-outline">{article.category}</Badge>}
              {article.source === 'cowork' && <Badge variant="silver">AI-Drafted</Badge>}
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-silver/50 text-sm mb-8 pb-8 border-b border-gold/10">
              {article.author && <span className="text-silver">{article.author}</span>}
              {article.published_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(article.published_at)}
                </span>
              )}
              {article.reading_time && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {article.reading_time} min read
                </span>
              )}
              <button
                onClick={handleShare}
                className="ml-auto flex items-center gap-1.5 text-silver/50 hover:text-gold transition-colors"
              >
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-silver/80 text-lg leading-relaxed mb-8 font-medium border-l-2 border-gold pl-4">
                {article.excerpt}
              </p>
            )}

            {/* Content */}
            <div
              className="prose prose-invert prose-gold max-w-none text-silver/80 leading-relaxed space-y-4"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {article.content}
            </div>
          </motion.div>

          {/* CTA */}
          <div className="mt-16 glass rounded-2xl p-8 text-center border border-gold/20">
            <h3 className="text-white font-bold text-xl mb-3">Need Logistics Support?</h3>
            <p className="text-silver/60 mb-6">Let's discuss your cross-border requirements.</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold text-charcoal-dark font-bold hover:bg-gold-light transition-all"
            >
              Get a Quote
            </Link>
          </div>
        </article>
      </div>
    </>
  )
}
