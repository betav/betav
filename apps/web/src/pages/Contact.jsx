import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { Button } from '../components/ui/button.jsx'
import { Input } from '../components/ui/input.jsx'
import { Textarea } from '../components/ui/textarea.jsx'
import { Label } from '../components/ui/label.jsx'
import { COMPANY_NAME, CONTACT_EMAIL, WHATSAPP_NUMBER } from '../lib/config.js'
import { submitLead } from '../lib/api.js'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  type: z.enum(['quote', 'freight', 'partner', 'general']).default('general'),
})

export default function Contact() {
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { type: 'general' },
  })

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      await submitLead({ ...data, source_page: '/contact' })
      toast.success('Message sent! We\'ll be in touch shortly.')
      reset()
    } catch (err) {
      toast.error('Failed to send message. Please email us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Contact — {COMPANY_NAME}</title>
        <meta name="description" content="Contact Alpha Empire Logistics for cross-border logistics quotes, freight inquiries, and partnership opportunities." />
      </Helmet>

      <div className="pt-24">
        <section className="section-padding">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <div className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">Get In Touch</div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                Let's <span className="gold-text">Talk Logistics</span>
              </h1>
              <p className="text-silver/70 max-w-xl mx-auto">
                Request a quote, discuss a freight requirement, or explore partnership opportunities.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              {/* Contact info */}
              <div className="lg:col-span-2 space-y-6">
                {[
                  { icon: Mail, label: 'Email', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
                  { icon: Phone, label: 'WhatsApp', value: WHATSAPP_NUMBER, href: `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g,'')}` },
                  { icon: MapPin, label: 'South Africa', value: 'Alpha Empire Logistics — SA Operations', href: null },
                  { icon: MapPin, label: 'DRC', value: 'Alpha Empire Corp SARLU — DRC Operations', href: null },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex items-start gap-4 glass rounded-xl p-5"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <div className="text-silver/50 text-xs uppercase tracking-wider mb-1">{item.label}</div>
                      {item.href ? (
                        <a href={item.href} className="text-white font-medium text-sm hover:text-gold transition-colors break-all">
                          {item.value}
                        </a>
                      ) : (
                        <div className="text-white font-medium text-sm">{item.value}</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="lg:col-span-3 glass rounded-2xl p-8 border border-gold/20"
              >
                <h2 className="text-white font-bold text-xl mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-silver/70 mb-1.5 block">Full Name *</Label>
                      <Input id="name" {...register('name')} placeholder="Your name" className="bg-charcoal border-gold/20 text-white placeholder:text-silver/30 focus:border-gold" />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-silver/70 mb-1.5 block">Email *</Label>
                      <Input id="email" type="email" {...register('email')} placeholder="your@email.com" className="bg-charcoal border-gold/20 text-white placeholder:text-silver/30 focus:border-gold" />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-silver/70 mb-1.5 block">Phone</Label>
                      <Input id="phone" {...register('phone')} placeholder="+27 ..." className="bg-charcoal border-gold/20 text-white placeholder:text-silver/30 focus:border-gold" />
                    </div>
                    <div>
                      <Label htmlFor="type" className="text-silver/70 mb-1.5 block">Inquiry Type</Label>
                      <select
                        id="type"
                        {...register('type')}
                        className="w-full h-9 rounded-md border border-gold/20 bg-charcoal px-3 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="quote">Request Quote</option>
                        <option value="freight">Freight Services</option>
                        <option value="partner">Partnership</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-silver/70 mb-1.5 block">Message *</Label>
                    <Textarea
                      id="message"
                      {...register('message')}
                      placeholder="Tell us about your logistics requirements..."
                      rows={5}
                      className="bg-charcoal border-gold/20 text-white placeholder:text-silver/30 focus:border-gold resize-none"
                    />
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    disabled={submitting}
                    className="w-full gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {submitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
