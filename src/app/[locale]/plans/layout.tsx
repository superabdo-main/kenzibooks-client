import { Footer } from '@/components/landing/Footer'
import { Navigation } from '@/components/landing/Navigation'
import React from 'react'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='min-h-screen bg-white'>
        <Navigation />
        <div className='container mx-auto px-4 text-center'>
            {children}
        </div>
        <Footer />
    </div>
  )
}

export default layout