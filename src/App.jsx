import React from 'react'
import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Footer from './components/Footer'

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <Experience />
        <Projects />
      </main>
      <Footer />
    </div>
  )
}

export default App
