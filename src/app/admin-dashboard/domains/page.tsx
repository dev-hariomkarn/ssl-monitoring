"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    Search,
    Globe,
    Eye,
    RefreshCw,
    AlertTriangle,
    CheckCircle,
    XCircle,
    ArrowUpDown,
} from "lucide-react"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { getAllDomainList, refreshDomainSSL } from "../_redux/adminApi"
import { readableDate } from "@/helpers/helper"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"

interface Domain {
    _id: string
    domain: string
    expiryDate: string
    daysLeft: number
    status: "OK" | "Expiring soon" | "Expired"
    issueDate: string
}

type SortOption = "a-z" | "z-a" | "days-asc" | "days-desc";

export default function DomainsPage() {
    const [domains, setDomains] = useState<Domain[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [sortBy, setSortBy] = useState<SortOption>("a-z")
    const dispatch = useDispatch()

    const { domainList } = useSelector((state: any) => state.admin, shallowEqual)

    const getStatusIcon = (status: Domain["status"]) => {
        switch (status) {
            case "OK":
                return <CheckCircle className="h-4 w-4 text-green-600" />
            case "Expiring soon":
                return <AlertTriangle className="h-4 w-4 text-yellow-600" />
            case "Expired":
                return <XCircle className="h-4 w-4 text-red-600" />
            default:
                return null
        }
    }

    const getStatusBadge = (status: Domain["status"]) => {
        const variants: Record<string, string> = {
            OK: "bg-green-100 text-green-800 border-green-200",
            "Expiring soon": "bg-yellow-100 text-yellow-800 border-yellow-200",
            Expired: "bg-red-100 text-red-800 border-red-200",
        }

        const labels: Record<string, string> = {
            OK: "Valid",
            "Expiring soon": "Expiring Soon",
            Expired: "Expired",
        }

        return (
            <Badge variant="outline" className={variants[status] || ""}>
                {getStatusIcon(status)}
                <span className="ml-1">{labels[status] || status}</span>
            </Badge>
        )
    }

    const getDaysLeftDisplay = (daysLeft: number, status: Domain["status"]) => {
        if (daysLeft < 0) return `${Math.abs(daysLeft)} days ago`
        if (daysLeft === 0) return "Today"
        return `${daysLeft} days`
    }

    const filteredAndSortedDomains = useMemo(() => {
        const filtered = domains.filter(domain =>
            domain.domain.toLowerCase().includes(searchTerm.toLowerCase())
        )

        switch (sortBy) {
            case "a-z":
                filtered.sort((a, b) => a.domain.localeCompare(b.domain))
                break
            case "z-a":
                filtered.sort((a, b) => b.domain.localeCompare(a.domain))
                break
            case "days-asc":
                filtered.sort((a, b) => a.daysLeft - b.daysLeft);
                break;
            case "days-desc":
                filtered.sort((a, b) => b.daysLeft - a.daysLeft);
                break;
        }

        return filtered
    }, [domains, searchTerm, sortBy])


    const handleRefreshDomain = async (domainId: string) => {
        const res = await dispatch(refreshDomainSSL(domainId))
        console.log('res', res)
    }

    useEffect(() => {
        dispatch(getAllDomainList())
    }, [])

    useEffect(() => {
        if (domainList && Array.isArray(domainList)) {
            setDomains(domainList)
        }
    }, [domainList])

    return (
        <div className="container max-w-7xl mx-auto py-8 px-4">

            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Domains</h1>
                        <p className="text-muted-foreground mt-2">Monitor SSL certificates for your domains</p>
                    </div>
                </div>
            </div>

            {/* Search and Sort Controls */}
            <div className="flex items-center justify-between mb-4">

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
                </div>
            </div>

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
                                <p>No Domain Added</p>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Domain
                                            <button className="cursor-pointer" onClick={() => setSortBy(sortBy === "a-z" ? "z-a" : "a-z")}>
                                                <ArrowUpDown className="h-4 w-4 ml-2" />
                                            </button>
                                        </TableHead>
                                        <TableHead>Users</TableHead>
                                        <TableHead>Expiry Date</TableHead>
                                        <TableHead>Days Left
                                            <button className="cursor-pointer" onClick={() => setSortBy(sortBy === "days-asc" ? "days-desc" : "days-asc")}>
                                                <ArrowUpDown className="h-4 w-4 ml-2" />
                                            </button>
                                        </TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[70px]">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAndSortedDomains.map((domain: any) => (
                                        <TableRow key={domain._id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                                    {domain.domain}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                                                    {domain.users.slice(0, 2).map((ele: any) => (
                                                        <Tooltip key={ele._id}>
                                                            <TooltipTrigger asChild>
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarImage src={ele?.profileImage} alt="Profile" />
                                                                    <AvatarFallback>{ele?.name?.slice(0, 1)}</AvatarFallback>
                                                                </Avatar>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{ele.name}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    ))}

                                                    {domain.users.length > 2 && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarFallback>+{domain.users.length - 2}</AvatarFallback>
                                                                </Avatar>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                {
                                                                    `${domain.users.length - 2} more users`
                                                                }
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                </div>

                                            </TableCell>
                                            <TableCell>{readableDate(domain.expiryDate)}</TableCell>
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
                                                <Button className="w-7 h-7 cursor-pointer">
                                                    <Link href={`/admin-dashboard/domains/${domain._id}`}>
                                                        <Eye className="w-2" />
                                                    </Link>
                                                </Button>
                                                <Button className="w-7 h-7 cursor-pointer ms-2" onClick={() => handleRefreshDomain(domain._id)}>
                                                    <RefreshCw className="w-2" />
                                                </Button>

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