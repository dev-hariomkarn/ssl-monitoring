import React from 'react'

const AdminLayout = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div>
            {children}
        </div>
    )
}

export default AdminLayout
