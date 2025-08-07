import { Shield } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

const PublicHeader = () => {
    return (
        <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
            <Link href="/" className="flex items-center justify-center">
                <Shield className="h-8 w-8 text-green-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">SSLGuard</span>
            </Link>
            <nav className="ml-auto flex gap-4 sm:gap-6">
                {/* <Link href="#features" className="text-sm font-medium hover:text-green-600 transition-colors">
                    Features
                </Link> */}
                <Link href="/pricing" className="text-sm font-medium hover:text-green-600 transition-colors">
                    Pricing
                </Link>
                <Link href="/about" className="text-sm font-medium hover:text-green-600 transition-colors">
                    About
                </Link>
                <Link href="/contact-us" className="text-sm font-medium hover:text-green-600 transition-colors">
                    Contact
                </Link>
            </nav>
            <div className="ml-6 flex gap-2">
                <Button variant="ghost" size="sm">
                    <Link href={"/login"}>
                        Sign In
                    </Link>
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Link href={"/register"}>
                        Get Started
                    </Link>
                </Button>
            </div>
        </header>
    )
}

export default PublicHeader
