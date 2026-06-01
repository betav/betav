import React from 'react'
import { Helmet } from 'react-helmet'
import { motion } from 'framer-motion'
import { Truck, Package, Settings, Gauge, HardHat, Shield } from 'lucide-react'
import { COMPANY_NAME } from '../lib/config.js'

const capabilities = [
  { icon: Truck, title: 'Logistics', desc: 'Cross-border freight management' },
  { icon: Truck, title: 'Transport', desc: 'Heavy haulage and fleet ops' },
  { icon: Package, title: 'Procurement', desc: 'Industrial supply chain' },
  { icon: Settings, title: 'Engineering', desc: 'Technical deployment' },
  { icon: Shield, title: 'Industrial Operations', desc: 'On-site industrial support' },
  { icon: HardHat, title: 'Mining Support', desc: 'Mining & construction logistics' },
]

export default function About() {
  return (
    <>
      <Helmet>
        <title>About — {COMPANY_NAME}</title>
        <meta name="description" content="Learn about Alpha Empire Logistics — our story, mission, and capabilities in cross-border logistics across Southern and Central Africa." />
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
              <div className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">Our Story</div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                Built for <span className="gold-text">Africa's Toughest</span> Operations
              </h1>
              <p className="text-silver/80 text-lg leading-relaxed">
                Alpha Empire Logistics was founded with a singular vision: to provide world-class logistics,
                procurement, and industrial support across Southern and Central Africa's most demanding corridors.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 bg-charcoal/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
                Rooted in Engineering.<br />
                <span className="gold-text">Driven by Logistics.</span>
              </h2>
              <p className="text-silver/70 leading-relaxed mb-4">
                With over 8 years of operational experience spanning South Africa and the Democratic Republic
                of Congo, Alpha Empire Logistics has grown from a specialized cross-border operator into
                a full-service industrial logistics company.
              </p>
              <p className="text-silver/70 leading-relaxed mb-4">
                Our founder's background in heavy civil construction, mechanical engineering, and logistics
                leadership shaped the company's DNA — combining engineering rigor with operational agility.
              </p>
              <p className="text-silver/70 leading-relaxed">
                Today, Alpha Empire Logistics and its DRC operations arm, Alpha Empire Corp SARLU, deliver
                integrated solutions for mining, construction, infrastructure, and industrial clients
                across the region.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="glass rounded-2xl p-8 border border-gold/20"
            >
              <div className="space-y-6">
                {[
                  { label: 'Founded', value: '2016' },
                  { label: 'Headquarters', value: 'South Africa' },
                  { label: 'DRC Operations', value: 'Alpha Empire Corp SARLU' },
                  { label: 'Primary Corridors', value: 'SA — DRC' },
                  { label: 'Core Industries', value: 'Mining, Construction, Industrial' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center border-b border-gold/10 pb-4">
                    <span className="text-silver/60 text-sm">{item.label}</span>
                    <span className="text-white font-semibold text-sm text-right max-w-[60%]">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="section-padding">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                Core <span className="gold-text">Capabilities</span>
              </h2>
              <p className="text-silver/70">Six pillars that define our operational excellence.</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {capabilities.map((cap, i) => (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="glass rounded-xl p-6 text-center hover:border-gold/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
                    <cap.icon className="h-6 w-6 text-gold" />
                  </div>
                  <h3 className="text-white font-bold mb-1">{cap.title}</h3>
                  <p className="text-silver/60 text-xs">{cap.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
