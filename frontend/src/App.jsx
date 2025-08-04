import React from 'react'
import { Routes, Route } from 'react-router'
import CreateDonationPage from './pages/CreateDonationPage.jsx'
import Welcome from './pages/Welcome.jsx'
import BrowsePage from './pages/BrowsePage.jsx'
import About from './pages/About.jsx'
import Footer from './components/Footer.jsx'
import Navbar from './components/Navbar.jsx'

const App = () => {
  return (
    <div className="min-h-screen flex flex-col" data-theme="garden">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/about" element={<About />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/create-donation" element={<CreateDonationPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App;