import PublicFooter from '@/components/PublicFooter';
import PublicHeader from '@/components/PublicHeader';
import React from 'react'

const PublicLayout = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div>
            <PublicHeader />
            {children}
            <PublicFooter />
        </div>
    )
}

export default PublicLayout
