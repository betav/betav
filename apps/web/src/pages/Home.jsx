import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { motion, useInView } from 'framer-motion'
import { Truck, Package, Settings, Gauge, HardHat, ArrowRight, ChevronDown } from 'lucide-react'
import { COMPANY_NAME, STATS, SERVICES } from '../lib/config.js'

const iconMap = { Truck, Package, Settings, Gauge, HardHat }

function AnimatedStat({ value, label, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-black gold-text mb-2">{value}</div>
      <div className="text-silver/70 text-sm font-medium uppercase tracking-wider">{label}</div>
    </motion.div>
  )
}

export default function Home() {
  return (
    <>
      <Helmet>
        <title>{COMPANY_NAME} — Cross-Border Logistics & Industrial Solutions Across Africa</title>
        <meta name="description" content="Alpha Empire Logistics provides cross-border logistics, procurement, engineering support, fleet and mining solutions across South Africa and the DRC." />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-charcoal-dark">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.08)_0%,_transparent_60%)]" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-semibold uppercase tracking-widest mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            South Africa · DRC Operations
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight mb-6"
          >
            Cross-Border Logistics &{' '}
            <span className="gold-text">Industrial Solutions</span>{' '}
            Across Africa
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-silver/80 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-10"
          >
            Bridging South Africa and the DRC with precision logistics, procurement excellence,
            and industrial expertise. Your partner for mining, construction, and cross-border operations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gold text-charcoal-dark font-bold text-base hover:bg-gold-light transition-all duration-300 shadow-xl shadow-gold/20 hover:shadow-gold/40 hover:-translate-y-0.5"
            >
              Request a Quote
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/partnerships"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-gold/40 text-gold font-bold text-base hover:border-gold hover:bg-gold/10 transition-all duration-300"
            >
              Become a Partner
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-silver/40 animate-bounce"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-charcoal/50 border-y border-gold/10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {STATS.map((stat, i) => (
              <AnimatedStat key={stat.label} value={stat.value} label={stat.label} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="inline-block text-gold text-xs font-semibold uppercase tracking-widest mb-3">
              Our Capabilities
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Integrated <span className="gold-text">Industrial Services</span>
            </h2>
            <p className="text-silver/70 max-w-2xl mx-auto">
              From cross-border freight to on-site engineering — we deliver end-to-end solutions
              for demanding African operations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => {
              const Icon = iconMap[service.icon] || Truck
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="glass rounded-2xl p-8 hover:border-gold/30 transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                    <Icon className="h-6 w-6 text-gold" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3">{service.title}</h3>
                  <p className="text-silver/70 text-sm leading-relaxed">{service.description}</p>
                </motion.div>
              )
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-gold font-semibold hover:underline"
            >
              View All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-charcoal-dark via-charcoal to-charcoal-dark border-y border-gold/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to Move Your Operations Forward?
            </h2>
            <p className="text-silver/70 text-lg mb-8">
              Get a custom logistics solution tailored to your cross-border requirements.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-lg bg-gold text-charcoal-dark font-bold text-lg hover:bg-gold-light transition-all duration-300 shadow-xl shadow-gold/20"
            >
              Start a Conversation <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
