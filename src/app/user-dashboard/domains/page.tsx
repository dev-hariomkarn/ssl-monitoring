"use client"

import { useState, useMemo, useEffect } from "react"
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
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { addDomain, deleteDomain, getDomainList } from "../_redux/userApi"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"


interface Domain {
    _id: string
    domain: string
    expiryDate: string
    daysLeft: number
    status: "OK" | "Expiring soon" | "Expired"
    issueDate: string
}

type SortOption = "a-z" | "z-a" | "up-first" | "down-first" | "newest-first"

export default function DomainsPage() {
    const [domains, setDomains] = useState<Domain[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [sortBy, setSortBy] = useState<SortOption>("a-z")
    const dispatch = useDispatch()
    const [showOtpDialog, setShowOtpDialog] = useState(false)

    const { Loading, domainList } = useSelector((state: any) => state.user, shallowEqual)

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

        const statusOrderUp = { OK: 0, "Expiring soon": 1, Expired: 2 }
        const statusOrderDown = { Expired: 0, "Expiring soon": 1, OK: 2 }

        switch (sortBy) {
            case "a-z":
                filtered.sort((a, b) => a.domain.localeCompare(b.domain))
                break
            case "z-a":
                filtered.sort((a, b) => b.domain.localeCompare(a.domain))
                break
            case "up-first":
                filtered.sort((a, b) => (statusOrderUp[a.status] ?? 99) - (statusOrderUp[b.status] ?? 99))
                break
            case "down-first":
                filtered.sort((a, b) => (statusOrderDown[a.status] ?? 99) - (statusOrderDown[b.status] ?? 99))
                break
            case "newest-first":
                filtered.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
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
        const data = {
            domainID: domainId,
        }
        dispatch<any>(deleteDomain(data))
            .then((response: any) => {
                if (response?.payload) {
                    console.log("Domain deleted successfully:", response.payload)
                }
            })
            .catch((error: any) => {
                console.error("Error deleting domain:", error)
            })
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

    useEffect(() => {
        dispatch(getDomainList())
    }, [])

    useEffect(() => {
        if (domainList && Array.isArray(domainList)) {
            setDomains(domainList)
        }
    }, [domainList])


    const readableDate = (isoDate: string) => {
        const date = new Date(isoDate)
        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const initialState = {
        domainName: "",
    }

    const formikScheme = Yup.object({
        domainName: Yup.string().required("Domain name is required")
    })

    const handleSubmit = (values: typeof initialState, { setSubmitting, resetForm }: any) => {
        setSubmitting(true)
        const data = {
            domain: values.domainName.trim(),
        }
        const res = dispatch<any>(addDomain(data))
        setSubmitting(false)
        resetForm()
        setShowOtpDialog(false)
    }

    return (
        <div className="container max-w-7xl mx-auto py-8 px-4">

            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Domains</h1>
                        <p className="text-muted-foreground mt-2">Monitor SSL certificates for your domains</p>
                    </div>
                    <Button className="flex items-center gap-2" onClick={() => setShowOtpDialog(true)}>
                        <Plus className="h-4 w-4" />
                        Add Domain
                    </Button>
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
                                <Button onClick={() => setShowOtpDialog(true)} >
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
                                        <TableRow key={domain._id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                                    {domain.domain}
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
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Open menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleViewDetails(domain._id)}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleRefreshDomain(domain._id)}>
                                                            <RefreshCw className="h-4 w-4 mr-2" />
                                                            Refresh SSL
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteDomain(domain._id)} className="text-red-600">
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

            <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            Add Domain
                        </DialogTitle>
                        <DialogDescription>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus officia iure autem suscipit delectus consectetur maiores amet, vel qui. Nostrum?
                        </DialogDescription>
                    </DialogHeader>
                    <Formik initialValues={initialState} validationSchema={formikScheme} onSubmit={handleSubmit}>
                        {({ isSubmitting, errors, touched, values }) => (
                            <Form className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="domainName">Domain</Label>
                                    <Field name="domainName">
                                        {({ field }: any) => (
                                            <Input
                                                {...field}
                                                id="domainName"
                                                placeholder="Enter domain (e.g., example.com)"
                                                className={errors.domainName && touched.domainName ? "border-destructive" : ""}
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage name="domainName" component="p" className="text-sm text-destructive" />
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowOtpDialog(false)
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting || !values.domainName}>
                                        {isSubmitting ? "Adding..." : "Add Domain"}
                                    </Button>
                                </DialogFooter>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        </div>
    )
}
