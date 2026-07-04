import React from 'react'
import { Helmet } from 'react-helmet'
import { motion } from 'framer-motion'
import { Award, BookOpen, Briefcase } from 'lucide-react'
import { COMPANY_NAME, CONTACT_EMAIL } from '../lib/config.js'

export default function Leadership() {
  return (
    <>
      <Helmet>
        <title>Leadership — {COMPANY_NAME}</title>
        <meta name="description" content="Meet Alpha Balebela-Maiba, founder of Alpha Empire Logistics — engineering background, heavy civil construction, and logistics leadership." />
      </Helmet>

      <div className="pt-24">
        <section className="section-padding">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <div className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">Our Team</div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                <span className="gold-text">Leadership</span>
              </h1>
              <p className="text-silver/70 max-w-xl mx-auto">
                Driven by engineering precision and logistics expertise.
              </p>
            </motion.div>

            {/* Founder card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass rounded-3xl p-8 md:p-12 border border-gold/20 mb-12"
            >
              <div className="flex flex-col md:flex-row gap-10 items-start">
                {/* Avatar */}
                <div className="shrink-0">
                  <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-gradient-to-br from-gold/30 to-gold-dark/20 border border-gold/30 flex items-center justify-center shadow-xl shadow-gold/10">
                    <span className="text-4xl md:text-5xl font-black text-gold">AB</span>
                  </div>
                </div>

                <div>
                  <div className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">Founder & Director</div>
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Alpha Balebela-Maiba</h2>
                  <p className="text-silver/60 mb-6">South Africa · DRC</p>

                  <div className="space-y-4 text-silver/70 leading-relaxed">
                    <p>
                      Alpha Balebela-Maiba is the founder and driving force behind Alpha Empire Logistics.
                      With an engineering background spanning heavy civil construction, mechanical systems,
                      and industrial operations, he built the company to solve the unique logistics challenges
                      of Africa's most demanding cross-border corridors.
                    </p>
                    <p>
                      His direct experience managing operations across South Africa and the Democratic Republic
                      of Congo gave him firsthand insight into the gaps in regional logistics infrastructure —
                      and the expertise to fill them.
                    </p>
                    <p>
                      Under his leadership, Alpha Empire Logistics has established itself as a trusted partner
                      for mining, construction, and industrial clients requiring precision logistics and
                      integrated operational support across Southern and Central Africa.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Key attributes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Briefcase,
                  title: 'Operational Experience',
                  desc: '8+ years leading cross-border logistics and industrial operations across Southern and Central Africa.',
                },
                {
                  icon: BookOpen,
                  title: 'Engineering Background',
                  desc: 'Heavy civil construction, mechanical engineering, and industrial project management expertise.',
                },
                {
                  icon: Award,
                  title: 'Regional Expertise',
                  desc: 'Deep knowledge of SA-DRC trade corridors, customs regulations, and mining sector requirements.',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass rounded-2xl p-6 border border-gold/10 hover:border-gold/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                    <item.icon className="h-5 w-5 text-gold" />
                  </div>
                  <h3 className="text-white font-bold mb-2">{item.title}</h3>
                  <p className="text-silver/60 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
