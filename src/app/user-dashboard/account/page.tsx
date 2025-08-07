"use client"

import { useEffect, useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, Mail, User, Trash2, CircleCheck, CircleAlert, Phone } from "lucide-react"
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { updateDetail } from "../_redux/userApi"
import { toast } from "react-toastify"

// Validation Schemas
const accountInfoSchema = Yup.object({
  fullName: Yup.string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be less than 50 characters")
    .required("Full name is required"),
})

const contactInfoSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required").min(10, "Phone number must be at least 10 digits"),
})

const deleteAccountSchema = Yup.object({
  confirmText: Yup.string().oneOf(["DELETE"], "Please type DELETE to confirm").required("Confirmation is required"),
})

const otpSchema = Yup.object({
  otpCode: Yup.string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP code is required"),
})

export default function AccountDetailsPage() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const userData = useSelector((state: any) => state.auth, shallowEqual)
  const dispatch = useDispatch()
  const [showOtpDialog, setShowOtpDialog] = useState(false)
  const [pendingPhoneNumber, setPendingPhoneNumber] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpType, setOtpType] = useState("")

  // Initial values
  const initialAccountInfo = {
    fullName: userData.name || "",
  }

  const initialContactInfo = {
    email: userData?.email?.value || "",
    phoneNumber: userData?.phone?.value || "",
  }

  const initialOtp = {
    otpCode: "",
  }

  const initialDeleteAccount = {
    confirmText: "",
  }

  const handleAccountInfoSubmit = async (values: typeof initialAccountInfo, { setSubmitting }: any) => {
    const data = {
      name: values.fullName,
      email: userData?.email?.value,
      phone: userData?.phone?.value || ""
    }
    await dispatch(updateDetail(data))
  }

  const handleContactInfoSubmit = async (values: typeof initialContactInfo, { setSubmitting }: any) => {
    const data = {
      name: userData.name,
      email: values.email,
      phone: values.phoneNumber
    }
    await dispatch(updateDetail(data))
  }

  const handleDeleteAccount = async (values: typeof initialDeleteAccount, { setSubmitting }: any) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast.success("Account Deleted")
      setShowDeleteDialog(false)
    } catch (error) {
      console.error("Error deleting account:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      // Simulate resending OTP
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("OTP resent to:", pendingPhoneNumber)
      // Show success message
    } catch (error) {
      console.error("Error resending OTP:", error)
    }
  }

  const handleOtpSubmit = async (values: typeof initialOtp, { setSubmitting, resetForm }: any) => {
    try {
      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setShowOtpDialog(false)
      setOtpSent(false)
      setPendingPhoneNumber("")
      resetForm()
      // Show success message
    } catch (error) {
      console.error("Error verifying OTP:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleGetOtp = async (value: string, type: string) => {
    try {
      setOtpType(type)
      setPendingPhoneNumber(value)
      setShowOtpDialog(true)
      // Simulate sending OTP
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setOtpSent(true)
      console.log("OTP sent to:", value)
    } catch (error) {
      setOtpType("")
      console.error("Error sending OTP:", error)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account details</h1>
        <p className="text-muted-foreground mt-2">Manage your account information and preferences</p>
      </div>

      <div className="space-y-8">
        {/* Account Info Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account info
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={initialAccountInfo}
              validationSchema={accountInfoSchema}
              onSubmit={handleAccountInfoSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Field name="fullName">
                      {({ field }: any) => (
                        <Input
                          {...field}
                          id="fullName"
                          placeholder="Enter your full name"
                          className={errors.fullName && touched.fullName ? "border-destructive" : ""}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="fullName" component="p" className="text-sm text-destructive" />
                    <p className="text-sm text-muted-foreground">
                      Used to display in applications and in all communications with you.
                    </p>
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting ? "Saving..." : "Save changes"}
                  </Button>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>

        {/* Contact Info Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Info
            </CardTitle>
            <CardDescription>Manage your contact information</CardDescription>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={initialContactInfo}
              validationSchema={contactInfoSchema}
              onSubmit={handleContactInfoSubmit}
            >
              {({ isSubmitting, errors, touched, values, setFieldValue }) => (
                <Form className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Field name="email">
                          {({ field }: any) => (
                            <Input
                              {...field}
                              id="email"
                              type="email"
                              placeholder="Enter your email"
                              className={errors.email && touched.email ? "border-destructive" : ""}
                            />
                          )}
                        </Field>
                        <div
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        >
                          {
                            userData?.email?.isVerified ?
                              <span title="Verified">
                                <CircleCheck size={18} fill="green" color="white" />
                              </span> :
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                                onClick={() => handleGetOtp(values.email, "email")}
                              >
                                Verify
                              </Button>
                          }
                        </div>
                      </div>
                      <ErrorMessage name="email" component="p" className="text-sm text-destructive" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <div className="space-y-2">
                        <div className="phone-input-container relative">
                          <PhoneInput
                            international
                            countryCallingCodeEditable={false}
                            defaultCountry="IN"
                            value={values.phoneNumber}
                            onChange={(value) => setFieldValue("phoneNumber", value || "")}
                            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.phoneNumber && touched.phoneNumber ? "border-destructive" : ""
                              }`}
                          />
                          <div
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          >
                            {
                              userData?.phone?.isVerified ?
                                <span title="Verified">
                                  <CircleCheck size={18} fill="green" color="white" />
                                </span> :
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                                  onClick={() => handleGetOtp(values.phoneNumber, "phone")}
                                >
                                  Verify
                                </Button>
                            }
                          </div>
                        </div>
                        <ErrorMessage name="phoneNumber" component="p" className="text-sm text-destructive" />
                      </div>
                    </div>
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting ? "Updating..." : "Update contact info"}
                  </Button>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>

        {/* OTP Verification Dialog */}
        <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {
                  otpType === "phone" ?
                    <>
                      <Phone className="h-5 w-5" />
                      Verify Phone Number
                    </> :
                    <>
                      <Mail className="h-5 w-5" />
                      Verify Email Address
                    </>
                }
              </DialogTitle>
              <DialogDescription>
                We've sent a verification code to {pendingPhoneNumber}. Please enter the code below.
              </DialogDescription>
            </DialogHeader>
            <Formik initialValues={initialOtp} validationSchema={otpSchema} onSubmit={handleOtpSubmit}>
              {({ isSubmitting, errors, touched, values }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otpCode">Verification Code</Label>
                    <Field name="otpCode">
                      {({ field }: any) => (
                        <Input
                          {...field}
                          id="otpCode"
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                          className={errors.otpCode && touched.otpCode ? "border-destructive" : ""}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="otpCode" component="p" className="text-sm text-destructive" />
                  </div>
                  <Button type="button" variant="outline" onClick={handleResendOtp} className="w-full bg-transparent">
                    Resend code
                  </Button>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowOtpDialog(false)
                        setOtpSent(false)
                        setPendingPhoneNumber("")
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting || !values.otpCode || values.otpCode.length !== 6}>
                      {isSubmitting ? "Verifying..." : "Verify"}
                    </Button>
                  </DialogFooter>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>

        <Separator />

        {/* Delete Account Section */}
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Delete account
            </CardTitle>
            <CardDescription>Permanently delete your account and all associated data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Warning: This action cannot be undone. This will permanently delete your account and remove all your
                data from our servers. All your projects, settings, and personal information will be lost forever.
              </AlertDescription>
            </Alert>

            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} className="w-full sm:w-auto">
              Delete account
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all your data from our
              servers.
            </DialogDescription>
          </DialogHeader>
          <Formik
            initialValues={initialDeleteAccount}
            validationSchema={deleteAccountSchema}
            onSubmit={handleDeleteAccount}
          >
            {({ isSubmitting, errors, touched, values }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="confirmText">
                    Type <span className="font-bold text-destructive">DELETE</span> to confirm
                  </Label>
                  <Field name="confirmText">
                    {({ field }: any) => (
                      <Input
                        {...field}
                        id="confirmText"
                        placeholder="Type DELETE"
                        className={errors.confirmText && touched.confirmText ? "border-destructive" : ""}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="confirmText" component="p" className="text-sm text-destructive" />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowDeleteDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={isSubmitting || values.confirmText !== "DELETE"}
                  >
                    {isSubmitting ? "Deleting..." : "Delete account"}
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
