"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation' // Ensure this is correct for your Next.js version

const LogoutPage = () => {
  const router = useRouter()

  useEffect(() => {
    const logout = async () => {
      const BEARER_TOKEN = localStorage.getItem('BEARER_TOKEN')
      try {
        const response = await fetch('https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/logout', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${BEARER_TOKEN}`
          }
        })
        
        if (response.ok) {
          localStorage.removeItem('BEARER_TOKEN')
          router.push('/login')
        } else {
          console.error('Logout failed with status:', response.status)
          router.push('/login')
        }
      } catch (error) {
        console.error('Error during logout:', error)
        router.push('/login')
      }
    }
    
    logout()
  }, [router])

  return null
}

export default LogoutPage
