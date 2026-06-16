import React from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { Header } from './components/Header'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Bem-vindo ao JVDonates</h1>
          <p className="text-xl text-gray-600 mb-8">Sistema de gerenciamento de doações</p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
            Começar
          </button>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App

