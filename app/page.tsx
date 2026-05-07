'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

export default function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Sustainability visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-green via-brand-green-mid to-emerald-700 items-center justify-center p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="text-center text-white max-w-md relative z-10">
          <div className="flex justify-center mb-6">
            <Image src="/greenbid-logo.png" alt="Greenbid" width={240} height={60} className="h-16 w-auto" />
          </div>
          <p className="text-lg text-white/80 leading-relaxed">
            Streamline sustainable procurement. Connect buyers and suppliers in a transparent, compliance-driven RFP ecosystem.
          </p>
          <div className="mt-8 space-y-3 text-sm text-white/70">
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              Manage RFPs with ease
            </p>
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              Track compliance requirements
            </p>
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              Secure proposal submissions
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Auth card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
        <Card className="w-full max-w-sm shadow-modal border-border">
          {/* Auth tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setIsLoginMode(true)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                isLoginMode
                  ? 'border-b-2 border-brand-green text-brand-green'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setIsLoginMode(false)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                !isLoginMode
                  ? 'border-b-2 border-brand-green text-brand-green'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="p-8">
            {isLoginMode ? (
              // LOGIN STATE
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">Welcome Back</h2>
                  <p className="text-text-secondary text-sm">Log in to your Greenbid account</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Link href="/buyer" className="block w-full">
                    <Button className="w-full bg-brand-green hover:bg-brand-green-mid text-white">
                      Demo: Log in as Buyer
                    </Button>
                  </Link>
                  <Link href="/supplier" className="block w-full">
                    <Button variant="outline" className="w-full border-border text-text-primary hover:bg-surface">
                      Demo: Log in as Supplier
                    </Button>
                  </Link>
                </div>

                <p className="text-center text-sm text-text-secondary">
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => setIsLoginMode(false)}
                    className="text-brand-green hover:text-brand-green-mid font-medium"
                  >
                    Create one
                  </button>
                </p>
              </div>
            ) : (
              // SIGNUP STATE
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">Get Started</h2>
                  <p className="text-text-secondary text-sm">Choose your role to create an account</p>
                </div>

                <div className="space-y-4">
                  {/* Buyer Card */}
                  <Link href="/buyer" className="block group">
                    <div className="border border-border rounded-lg p-6 hover:border-brand-green hover:bg-brand-green-light transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-text-primary group-hover:text-brand-green transition-colors">
                            I am a Buyer
                          </h3>
                          <p className="text-sm text-text-secondary mt-1">
                            Issue RFPs, evaluate suppliers, and manage sustainability procurement.
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-text-secondary group-hover:text-brand-green transition-colors mt-1 shrink-0" />
                      </div>
                    </div>
                  </Link>

                  {/* Supplier Card */}
                  <Link href="/supplier" className="block group">
                    <div className="border border-border rounded-lg p-6 hover:border-brand-green hover:bg-brand-green-light transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-text-primary group-hover:text-brand-green transition-colors">
                            I am a Supplier
                          </h3>
                          <p className="text-sm text-text-secondary mt-1">
                            Discover RFPs, submit proposals, and manage compliance data.
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-text-secondary group-hover:text-brand-green transition-colors mt-1 shrink-0" />
                      </div>
                    </div>
                  </Link>
                </div>

                <p className="text-center text-sm text-text-secondary">
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsLoginMode(true)}
                    className="text-brand-green hover:text-brand-green-mid font-medium"
                  >
                    Log in
                  </button>
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
