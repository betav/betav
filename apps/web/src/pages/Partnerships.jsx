import React from 'react'
import { Helmet } from 'react-helmet'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Globe, Handshake, TrendingUp, Shield, Zap, Users, MapPin, ArrowRight } from 'lucide-react'
import { COMPANY_NAME } from '../lib/config.js'

const advantages = [
  { icon: Globe, title: 'Regional Reach', desc: 'Established operations in SA and DRC with cross-border corridor expertise.' },
  { icon: Handshake, title: 'Integrated Operations', desc: 'Seamless coordination between Alpha Empire Logistics and Alpha Empire Corp SARLU.' },
  { icon: TrendingUp, title: 'Growth Corridors', desc: 'Positioned at the intersection of Africa\'s fastest-growing trade routes.' },
  { icon: Shield, title: 'Compliance & Risk', desc: 'Full customs, regulatory, and compliance management on both sides of the border.' },
  { icon: Zap, title: 'Operational Speed', desc: 'Rapid deployment capability for time-sensitive industrial and mining operations.' },
  { icon: Users, title: 'Local Intelligence', desc: 'Deep local networks in South Africa and the DRC for on-ground support.' },
]

export default function Partnerships() {
  return (
    <>
      <Helmet>
        <title>Partnerships — {COMPANY_NAME}</title>
        <meta name="description" content="Partner with Alpha Empire Logistics for integrated regional operations across South Africa and the DRC. Become a strategic partner." />
      </Helmet>

      <div className="pt-24">
        {/* Hero */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">Strategic Alliances</div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                <span className="gold-text">Integrated Regional</span> Operations
              </h1>
              <p className="text-silver/70 text-lg leading-relaxed max-w-2xl mx-auto">
                Alpha Empire Logistics operates as the South African anchor of a binational industrial
                logistics network, with Alpha Empire Corp SARLU as our DRC operations arm.
                Together, we bridge two of Africa's most critical economies.
              </p>
            </motion.div>
          </div>
        </section>

        {/* SA ↔ DRC Story */}
        <section className="py-16 bg-charcoal/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                The SA — DRC <span className="gold-text">Corridor</span>
              </h2>
              <p className="text-silver/70 max-w-2xl mx-auto">
                The cross-border link between South Africa and the Democratic Republic of Congo
                is one of Africa's most strategically important and operationally complex trade routes.
              </p>
            </motion.div>

            {/* Animated corridor visual */}
            <div className="relative flex items-center justify-center my-12 overflow-hidden rounded-2xl glass border border-gold/20 p-10">
              <div className="flex items-center gap-6 md:gap-16">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center mx-auto mb-3">
                    <MapPin className="h-7 w-7 text-gold" />
                  </div>
                  <div className="text-white font-bold">South Africa</div>
                  <div className="text-silver/50 text-xs">Alpha Empire Logistics</div>
                </div>

                <div className="flex-1 flex flex-col items-center gap-3">
                  <div className="w-full h-px bg-gradient-to-r from-gold/30 via-gold to-gold/30 relative">
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gold shadow-lg shadow-gold/50"
                      animate={{ left: ['0%', '100%', '0%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                  <div className="text-silver/40 text-xs uppercase tracking-widest">Mining Corridors · Transport Routes</div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center mx-auto mb-3">
                    <MapPin className="h-7 w-7 text-gold" />
                  </div>
                  <div className="text-white font-bold">DRC</div>
                  <div className="text-silver/50 text-xs">Alpha Empire Corp SARLU</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partnership advantages */}
        <section className="section-padding">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                Partnership <span className="gold-text">Advantages</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {advantages.map((adv, i) => (
                <motion.div
                  key={adv.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="glass rounded-2xl p-6 hover:border-gold/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                    <adv.icon className="h-5 w-5 text-gold" />
                  </div>
                  <h3 className="text-white font-bold mb-2">{adv.title}</h3>
                  <p className="text-silver/60 text-sm leading-relaxed">{adv.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gold text-charcoal-dark font-bold hover:bg-gold-light transition-all shadow-xl shadow-gold/20"
              >
                Become a Partner <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
