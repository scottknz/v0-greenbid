'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

export default function SettingsPage() {
  const router = useRouter()
  const [currentRole, setCurrentRole] = useState<'buyer' | 'supplier'>('buyer')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const savedRole = localStorage.getItem('userRole') as 'buyer' | 'supplier' | null
    if (savedRole) {
      setCurrentRole(savedRole)
    }
  }, [])

  const handleRoleChange = (role: 'buyer' | 'supplier') => {
    setCurrentRole(role)
    localStorage.setItem('userRole', role)
    
    // Redirect to appropriate dashboard
    if (role === 'buyer') {
      router.push('/buyer')
    } else {
      router.push('/supplier')
    }
  }

  if (!isMounted) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-text-secondary mt-2">Manage your account and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Role (Dev Testing)</CardTitle>
          <CardDescription>
            Switch between Buyer and Supplier dashboards for testing. This setting persists in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={currentRole} onValueChange={(value) => handleRoleChange(value as 'buyer' | 'supplier')}>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="buyer" id="buyer-role" />
                <Label htmlFor="buyer-role" className="cursor-pointer flex-1">
                  <div className="font-medium">Buyer Dashboard</div>
                  <p className="text-sm text-text-secondary">Create and manage RFPs, view supplier responses</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="supplier" id="supplier-role" />
                <Label htmlFor="supplier-role" className="cursor-pointer flex-1">
                  <div className="font-medium">Supplier Dashboard</div>
                  <p className="text-sm text-text-secondary">Browse RFPs, submit proposals, manage submissions</p>
                </Label>
              </div>
            </div>
          </RadioGroup>

          <div className="mt-6 pt-6 border-t space-y-2">
            <p className="text-sm text-text-secondary">Current Role: <span className="font-semibold capitalize">{currentRole}</span></p>
            <div className="text-xs text-text-secondary bg-surface p-2 rounded">
              Note: This setting is stored in your browser's local storage and will persist across sessions.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
