import React from 'react'
import { Helmet } from 'react-helmet'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Truck, Package, Settings, Gauge, HardHat, ArrowRight } from 'lucide-react'
import { COMPANY_NAME, SERVICES } from '../lib/config.js'

const iconMap = { Truck, Package, Settings, Gauge, HardHat }

const serviceDetails = {
  'cross-border': {
    features: ['Full customs clearance & documentation', 'SA-DRC corridor specialization', 'Real-time shipment tracking', 'Hazmat & oversized cargo', 'Cross-border compliance'],
  },
  procurement: {
    features: ['OEM & aftermarket parts sourcing', 'Industrial consumables supply', 'Vendor management', 'Quality assurance inspection', 'Expedited procurement'],
  },
  engineering: {
    features: ['Mechanical & civil engineering deployment', 'On-site technical teams', 'Equipment commissioning', 'Maintenance support', 'Project management'],
  },
  fleet: {
    features: ['Heavy haulage transport', 'Equipment leasing programs', 'Oversized load management', 'Fleet maintenance coordination', 'Route optimization'],
  },
  mining: {
    features: ['Site logistics planning', 'Fuel & consumables supply', 'Construction material transport', 'Remote site operations', 'Integrated site services'],
  },
}

export default function Services() {
  return (
    <>
      <Helmet>
        <title>Services — {COMPANY_NAME}</title>
        <meta name="description" content="Explore Alpha Empire Logistics' full range of services: cross-border logistics, procurement, engineering support, fleet solutions, and mining support." />
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
              <div className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">What We Do</div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                Our <span className="gold-text">Services</span>
              </h1>
              <p className="text-silver/70 max-w-2xl mx-auto text-lg">
                Integrated industrial solutions for Africa's most demanding environments.
              </p>
            </motion.div>

            <div className="space-y-8">
              {SERVICES.map((service, i) => {
                const Icon = iconMap[service.icon] || Truck
                const details = serviceDetails[service.id] || { features: [] }
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className="glass rounded-2xl p-8 hover:border-gold/30 transition-all group"
                  >
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="md:w-1/3">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                            <Icon className="h-7 w-7 text-gold" />
                          </div>
                          <div>
                            <div className="text-silver/50 text-xs font-semibold uppercase tracking-widest">Service {String(i+1).padStart(2,'0')}</div>
                            <h2 className="text-white font-black text-xl">{service.title}</h2>
                          </div>
                        </div>
                        <p className="text-silver/70 leading-relaxed">{service.description}</p>
                      </div>
                      <div className="md:w-2/3">
                        <h3 className="text-gold text-sm font-semibold uppercase tracking-wider mb-4">Key Capabilities</h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {details.features.map(f => (
                            <li key={f} className="flex items-center gap-2 text-silver/70 text-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gold text-charcoal-dark font-bold text-base hover:bg-gold-light transition-all shadow-xl shadow-gold/20"
              >
                Discuss Your Requirements <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
