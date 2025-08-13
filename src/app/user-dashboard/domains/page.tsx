"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
    Search,
    Globe,
    MoreHorizontal,
    Eye,
    RefreshCw,
    Trash2,
    Plus,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Clock,
} from "lucide-react"

interface Domain {
    id: string
    domain: string
    expiryDate: string
    daysLeft: number
    status: "valid" | "expiring" | "expired" | "invalid"
    addedDate: string
}

// Sample data
const sampleDomains: Domain[] = [
    {
        id: "1",
        domain: "example.com",
        expiryDate: "2024-12-15",
        daysLeft: 45,
        status: "valid",
        addedDate: "2024-01-15",
    },
    {
        id: "2",
        domain: "mywebsite.org",
        expiryDate: "2024-11-20",
        daysLeft: 20,
        status: "expiring",
        addedDate: "2024-02-10",
    },
    {
        id: "3",
        domain: "testsite.net",
        expiryDate: "2024-10-25",
        daysLeft: -5,
        status: "expired",
        addedDate: "2024-03-05",
    },
    {
        id: "4",
        domain: "portfolio.dev",
        expiryDate: "2025-03-10",
        daysLeft: 120,
        status: "valid",
        addedDate: "2024-01-20",
    },
    {
        id: "5",
        domain: "blog.io",
        expiryDate: "2024-11-05",
        daysLeft: 5,
        status: "expiring",
        addedDate: "2024-04-12",
    },
    {
        id: "6",
        domain: "shop.store",
        expiryDate: "Invalid",
        daysLeft: 0,
        status: "invalid",
        addedDate: "2024-05-01",
    },
]

type SortOption = "a-z" | "z-a" | "up-first" | "down-first" | "newest-first"

export default function DomainsPage() {
    const [domains, setDomains] = useState<Domain[]>(sampleDomains)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortBy, setSortBy] = useState<SortOption>("a-z")

    const getStatusIcon = (status: Domain["status"]) => {
        switch (status) {
            case "valid":
                return <CheckCircle className="h-4 w-4 text-green-600" />
            case "expiring":
                return <AlertTriangle className="h-4 w-4 text-yellow-600" />
            case "expired":
                return <XCircle className="h-4 w-4 text-red-600" />
            case "invalid":
                return <Clock className="h-4 w-4 text-gray-600" />
            default:
                return null
        }
    }

    const getStatusBadge = (status: Domain["status"]) => {
        const variants = {
            valid: "bg-green-100 text-green-800 border-green-200",
            expiring: "bg-yellow-100 text-yellow-800 border-yellow-200",
            expired: "bg-red-100 text-red-800 border-red-200",
            invalid: "bg-gray-100 text-gray-800 border-gray-200",
        }

        const labels = {
            valid: "Valid",
            expiring: "Expiring Soon",
            expired: "Expired",
            invalid: "Invalid",
        }

        return (
            <Badge variant="outline" className={variants[status]}>
                {getStatusIcon(status)}
                <span className="ml-1">{labels[status]}</span>
            </Badge>
        )
    }

    const getDaysLeftDisplay = (daysLeft: number, status: Domain["status"]) => {
        if (status === "invalid") return "N/A"
        if (daysLeft < 0) return `${Math.abs(daysLeft)} days ago`
        if (daysLeft === 0) return "Today"
        return `${daysLeft} days`
    }

    const filteredAndSortedDomains = useMemo(() => {
        const filtered = domains.filter((domain) => domain.domain.toLowerCase().includes(searchTerm.toLowerCase()))

        switch (sortBy) {
            case "a-z":
                filtered.sort((a, b) => a.domain.localeCompare(b.domain))
                break
            case "z-a":
                filtered.sort((a, b) => b.domain.localeCompare(a.domain))
                break
            case "up-first":
                filtered.sort((a, b) => {
                    const statusOrder = { valid: 0, expiring: 1, expired: 2, invalid: 3 }
                    return statusOrder[a.status] - statusOrder[b.status]
                })
                break
            case "down-first":
                filtered.sort((a, b) => {
                    const statusOrder = { invalid: 0, expired: 1, expiring: 2, valid: 3 }
                    return statusOrder[a.status] - statusOrder[b.status]
                })
                break
            case "newest-first":
                filtered.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
                break
        }

        return filtered
    }, [domains, searchTerm, sortBy])

    const handleRefreshDomain = (domainId: string) => {
        console.log("Refreshing domain:", domainId)
    }

    const handleViewDetails = (domainId: string) => {
        console.log("Viewing details for domain:", domainId)
    }

    const handleDeleteDomain = (domainId: string) => {
        setDomains(domains.filter((domain) => domain.id !== domainId))
    }

    const getSortLabel = (option: SortOption) => {
        const labels = {
            "a-z": "A → Z",
            "z-a": "Z → A",
            "up-first": "Up First",
            "down-first": "Down First",
            "newest-first": "Newest First",
        }
        return labels[option]
    }

    return (
        <div className="container max-w-7xl mx-auto py-8 px-4">

            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Domains</h1>
                        <p className="text-muted-foreground mt-2">Monitor SSL certificates for your domains</p>
                    </div>
                    <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Domain
                    </Button>
                </div>
            </div>

            {/* Summary Stats */}
            {filteredAndSortedDomains.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-green-600">
                                {filteredAndSortedDomains.filter((d) => d.status === "valid").length}
                            </div>
                            <p className="text-sm text-muted-foreground">Valid</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-yellow-600">
                                {filteredAndSortedDomains.filter((d) => d.status === "expiring").length}
                            </div>
                            <p className="text-sm text-muted-foreground">Expiring</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-red-600">
                                {filteredAndSortedDomains.filter((d) => d.status === "expired").length}
                            </div>
                            <p className="text-sm text-muted-foreground">Expired</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-gray-600">
                                {filteredAndSortedDomains.filter((d) => d.status === "invalid").length}
                            </div>
                            <p className="text-sm text-muted-foreground">Invalid</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Search and Sort Controls */}
            <Card className="mb-6 mt-6">
                <CardContent className="">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Label htmlFor="search" className="sr-only">
                                Search domains
                            </Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Search domains..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="sm:w-48">
                            <Label htmlFor="sort" className="sr-only">
                                Sort by
                            </Label>
                            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="a-z">A → Z</SelectItem>
                                    <SelectItem value="z-a">Z → A</SelectItem>
                                    <SelectItem value="up-first">Up First</SelectItem>
                                    <SelectItem value="down-first">Down First</SelectItem>
                                    <SelectItem value="newest-first">Newest First</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Domains Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        SSL Certificates ({filteredAndSortedDomains.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredAndSortedDomains.length === 0 ? (
                        <div className="text-center py-12">
                            <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No domains found</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm ? "No domains match your search criteria." : "You haven't added any domains yet."}
                            </p>
                            {!searchTerm && (
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Your First Domain
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Domain</TableHead>
                                        <TableHead>Expiry Date</TableHead>
                                        <TableHead>Days Left</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[70px]">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAndSortedDomains.map((domain) => (
                                        <TableRow key={domain.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                                    {domain.domain}
                                                </div>
                                            </TableCell>
                                            <TableCell>{domain.status === "invalid" ? "N/A" : domain.expiryDate}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`font-medium ${domain.daysLeft < 0
                                                            ? "text-red-600"
                                                            : domain.daysLeft <= 30
                                                                ? "text-yellow-600"
                                                                : "text-green-600"
                                                        }`}
                                                >
                                                    {getDaysLeftDisplay(domain.daysLeft, domain.status)}
                                                </span>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(domain.status)}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Open menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleViewDetails(domain.id)}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleRefreshDomain(domain.id)}>
                                                            <RefreshCw className="h-4 w-4 mr-2" />
                                                            Refresh SSL
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteDomain(domain.id)} className="text-red-600">
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
