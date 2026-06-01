import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import { COMPANY_NAME, CONTACT_EMAIL, WHATSAPP_NUMBER } from '../lib/config.js'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-charcoal-dark border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center shadow-lg shadow-gold/30">
                <span className="text-charcoal-dark font-black text-sm">AE</span>
              </div>
              <div>
                <div className="text-white font-bold text-sm">{COMPANY_NAME}</div>
                <div className="text-silver text-xs">Cross-Border Logistics</div>
              </div>
            </div>
            <p className="text-silver/70 text-sm leading-relaxed">
              Cross-border logistics and industrial solutions across Southern and Central Africa.
              Bridging South Africa and the DRC with precision.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">Services</h4>
            <ul className="space-y-2">
              {['Cross-Border Logistics', 'Procurement & Supply', 'Engineering Support', 'Fleet Solutions', 'Mining Support'].map(s => (
                <li key={s}>
                  <Link to="/services" className="text-silver/70 text-sm hover:text-gold transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-2">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/leadership', label: 'Leadership' },
                { to: '/partnerships', label: 'Partnerships' },
                { to: '/industries', label: 'Industries' },
                { to: '/insights', label: 'Insights' },
                { to: '/contact', label: 'Contact' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-silver/70 text-sm hover:text-gold transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-silver/70 text-sm hover:text-gold transition-colors break-all">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                <a href={`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}`} className="text-silver/70 text-sm hover:text-gold transition-colors">
                  {WHATSAPP_NUMBER}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                <span className="text-silver/70 text-sm">South Africa &amp; DRC Operations</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gold/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-silver/50 text-xs">
            © {year} {COMPANY_NAME}. All rights reserved.
          </p>
          <p className="text-silver/50 text-xs">
            Alpha Empire Corp SARLU — DRC Operations Arm
          </p>
        </div>
      </div>
    </footer>
  )
}
