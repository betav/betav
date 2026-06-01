import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Plus, Tag } from 'lucide-react'
import { Button } from '../../components/ui/button.jsx'
import { Input } from '../../components/ui/input.jsx'
import { AdminLayout } from './AdminDashboard.jsx'
import { CONTACT_EMAIL } from '../../lib/config.js'

const DEFAULT_CATEGORIES = [
  'Cross-Border Logistics',
  'Mining Logistics',
  'African Trade',
  'Customs & Freight',
  'Fleet Operations',
  'Infrastructure',
  'Supply Chain',
  'Procurement',
  'Industry Analysis',
]

export default function AdminCategories() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [newCat, setNewCat] = useState('')

  const addCategory = () => {
    const trimmed = newCat.trim()
    if (!trimmed) return
    if (categories.includes(trimmed)) { toast.error('Category already exists'); return }
    setCategories(prev => [...prev, trimmed])
    setNewCat('')
    toast.success('Category added')
  }

  const removeCategory = (cat) => {
    setCategories(prev => prev.filter(c => c !== cat))
    toast.success('Category removed')
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-black text-white mb-6">Categories</h1>

        <div className="glass rounded-2xl p-6 mb-6">
          <h2 className="text-white font-bold mb-4">Add Category</h2>
          <div className="flex gap-3">
            <Input
              value={newCat}
              onChange={e => setNewCat(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCategory()}
              placeholder="Category name..."
              className="bg-charcoal border-gold/20 text-white placeholder:text-silver/30"
            />
            <Button variant="gold" onClick={addCategory} className="gap-1.5 shrink-0">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-white font-bold mb-4">
            Existing Categories <span className="text-silver/40 font-normal text-sm">({categories.length})</span>
          </h2>
          <div className="space-y-2">
            {categories.map(cat => (
              <div key={cat} className="flex items-center justify-between p-3 rounded-lg bg-charcoal/50 border border-gold/10">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gold/50" />
                  <span className="text-white text-sm">{cat}</span>
                </div>
                <button
                  onClick={() => removeCategory(cat)}
                  className="text-silver/30 hover:text-red-400 transition-colors text-xs"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
