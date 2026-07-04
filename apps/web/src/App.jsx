import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import WhatsAppButton from './components/WhatsAppButton.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

// Eager load public pages
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Services from './pages/Services.jsx'
import Industries from './pages/Industries.jsx'
import Leadership from './pages/Leadership.jsx'
import Partnerships from './pages/Partnerships.jsx'
import Contact from './pages/Contact.jsx'

// Lazy load heavy routes
const InsightsList = lazy(() => import('./pages/insights/InsightsList.jsx'))
const InsightDetail = lazy(() => import('./pages/insights/InsightDetail.jsx'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'))
const AdminArticles = lazy(() => import('./pages/admin/AdminArticles.jsx'))
const AdminReviewQueue = lazy(() => import('./pages/admin/AdminReviewQueue.jsx'))
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories.jsx'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal-dark">
      <div className="text-gold animate-pulse text-xl font-semibold">Loading...</div>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Routes>
        {/* Admin routes — no public navbar/footer */}
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<PageLoader />}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/articles" element={<AdminArticles />} />
                  <Route path="/review" element={<AdminReviewQueue />} />
                  <Route path="/categories" element={<AdminCategories />} />
                </Routes>
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* Public routes */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <main>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/industries" element={<Industries />} />
                    <Route path="/leadership" element={<Leadership />} />
                    <Route path="/partnerships" element={<Partnerships />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/insights" element={<InsightsList />} />
                    <Route path="/insights/:slug" element={<InsightDetail />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          }
        />
      </Routes>
    </>
  )
}
