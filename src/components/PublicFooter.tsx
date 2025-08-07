import { Shield } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const PublicFooter = () => {
    return (
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-50">
            <div className="container flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-green-600" />
                    <span className="font-bold text-gray-900">SSLGuard</span>
                </div>
                <p className="text-xs text-gray-600">© {new Date().getFullYear()} SSLGuard. All rights reserved.</p>
                <nav className="flex gap-4 sm:gap-6">
                    <Link href="/privacy" className="text-xs hover:underline underline-offset-4 text-gray-600">
                        Privacy Policy
                    </Link>
                    <Link href="/terms" className="text-xs hover:underline underline-offset-4 text-gray-600">
                        Terms of Service
                    </Link>
                    <Link href="/support" className="text-xs hover:underline underline-offset-4 text-gray-600">
                        Support
                    </Link>
                </nav>
            </div>
        </footer>
    )
}

export default PublicFooter
