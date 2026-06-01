import React from 'react'
import { Helmet } from 'react-helmet'
import { motion } from 'framer-motion'
import { HardHat, Building2, Zap, Package, Truck, Settings, BarChart3 } from 'lucide-react'
import { COMPANY_NAME } from '../lib/config.js'

const industries = [
  {
    icon: HardHat,
    title: 'Mining',
    desc: 'Logistics, equipment supply, and on-site support for open-cast and underground mining operations across Southern and Central Africa.',
    tags: ['Equipment Logistics', 'Consumables Supply', 'Site Services'],
  },
  {
    icon: Building2,
    title: 'Construction',
    desc: 'Heavy civil construction logistics including material transport, machinery movement, and on-site procurement for large-scale projects.',
    tags: ['Material Transport', 'Machinery Haulage', 'Site Procurement'],
  },
  {
    icon: Zap,
    title: 'Infrastructure',
    desc: 'Supply chain and logistics support for road, rail, dam, and energy infrastructure development projects across the region.',
    tags: ['Project Logistics', 'Supply Chain', 'Cross-Border Delivery'],
  },
  {
    icon: Settings,
    title: 'Industrial Operations',
    desc: 'Engineering and technical personnel deployment, industrial equipment procurement, and operational support for manufacturing facilities.',
    tags: ['Technical Staffing', 'Equipment Procurement', 'Maintenance Support'],
  },
  {
    icon: Zap,
    title: 'Energy',
    desc: 'Logistics solutions for power generation projects, fuel supply chains, and energy infrastructure across the SA-DRC corridor.',
    tags: ['Fuel Logistics', 'Equipment Transport', 'Project Support'],
  },
  {
    icon: Package,
    title: 'Procurement & Supply Chain',
    desc: 'End-to-end procurement services for industrial clients — from sourcing to delivery — with full compliance and quality oversight.',
    tags: ['Vendor Management', 'Quality Assurance', 'Last-Mile Delivery'],
  },
  {
    icon: Truck,
    title: 'Logistics & Transport',
    desc: 'Cross-border freight forwarding, customs clearance, and multi-modal transport solutions for cargo of all sizes.',
    tags: ['Freight Forwarding', 'Customs Clearance', 'Multi-Modal'],
  },
]

export default function Industries() {
  return (
    <>
      <Helmet>
        <title>Industries — {COMPANY_NAME}</title>
        <meta name="description" content="Alpha Empire Logistics serves mining, construction, infrastructure, industrial, energy, and logistics sectors across Africa." />
      </Helmet>

      <div className="pt-24">
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <div className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">Who We Serve</div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                Industries We <span className="gold-text">Serve</span>
              </h1>
              <p className="text-silver/70 max-w-2xl mx-auto text-lg">
                Deep sector expertise across Africa's most capital-intensive industries.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industries.map((ind, i) => (
                <motion.div
                  key={ind.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.07 }}
                  className="glass rounded-2xl p-7 hover:border-gold/30 transition-all group hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                    <ind.icon className="h-6 w-6 text-gold" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{ind.title}</h3>
                  <p className="text-silver/60 text-sm leading-relaxed mb-4">{ind.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {ind.tags.map(tag => (
                      <span key={tag} className="text-xs px-2.5 py-1 rounded-full border border-gold/20 text-gold/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
