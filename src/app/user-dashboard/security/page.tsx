"use client"

import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"
import { useDispatch } from "react-redux"
import { changePassword } from "../_redux/userApi"

// Password validation schema
const passwordSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
})

interface PasswordFormValues {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function SecurityPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const dispatch = useDispatch()

  const initialValues: PasswordFormValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  }

  const handlePasswordSubmit = async (values: PasswordFormValues, { setSubmitting, resetForm, setFieldError }: any) => {
    const data = {
      oldPassword: values.currentPassword,
      password: values.newPassword
    }
    const res = await dispatch(changePassword(data))
    if(res?.payload?.success){
      resetForm()
    }
  }

  const getPasswordStrength = (password: string) => {
    const requirements = [
      { test: password.length >= 8, label: "At least 8 characters" },
      { test: /[a-z]/.test(password), label: "One lowercase letter" },
      { test: /[A-Z]/.test(password), label: "One uppercase letter" },
      { test: /\d/.test(password), label: "One number" },
      { test: /[!@#$%^&*(),.?":{}|<>]/.test(password), label: "One special character" },
    ]

    const passedRequirements = requirements.filter((req) => req.test).length
    return { requirements, strength: passedRequirements }
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Security</h1>
        <p className="text-muted-foreground mt-2">Manage your account security and password</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <Formik initialValues={initialValues} validationSchema={passwordSchema} onSubmit={handlePasswordSubmit}>
            {({ isSubmitting, errors, touched, values }) => {
              const { requirements, strength } = getPasswordStrength(values.newPassword)

              return (
                <Form className="space-y-6">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Field name="currentPassword">
                        {({ field }: any) => (
                          <Input
                            {...field}
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Enter your current password"
                            className={`pr-10 ${errors.currentPassword && touched.currentPassword ? "border-destructive" : ""
                              }`}
                          />
                        )}
                      </Field>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <ErrorMessage name="currentPassword" component="p" className="text-sm text-destructive" />
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Field name="newPassword">
                        {({ field }: any) => (
                          <Input
                            {...field}
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter your new password"
                            className={`pr-10 ${errors.newPassword && touched.newPassword ? "border-destructive" : ""}`}
                          />
                        )}
                      </Field>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <ErrorMessage name="newPassword" component="p" className="text-sm text-destructive" />

                    {/* Password Requirements */}
                    {values.newPassword && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-md">
                        <p className="text-sm font-medium mb-2">Password Requirements:</p>
                        <div className="space-y-1">
                          {requirements.map((req, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              {req.test ? (
                                <CheckCircle className="h-3 w-3 text-green-600" />
                              ) : (
                                <XCircle className="h-3 w-3 text-muted-foreground" />
                              )}
                              <span className={req.test ? "text-green-600" : "text-muted-foreground"}>{req.label}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Strength:</span>
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${strength <= 2 ? "bg-red-500" : strength <= 4 ? "bg-yellow-500" : "bg-green-500"
                                  }`}
                                style={{ width: `${(strength / 5) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {strength <= 2 ? "Weak" : strength <= 4 ? "Medium" : "Strong"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Field name="confirmPassword">
                        {({ field }: any) => (
                          <Input
                            {...field}
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your new password"
                            className={`pr-10 ${errors.confirmPassword && touched.confirmPassword ? "border-destructive" : ""
                              }`}
                          />
                        )}
                      </Field>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <ErrorMessage name="confirmPassword" component="p" className="text-sm text-destructive" />
                  </div>

                  {/* Security Tips */}
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <strong>Security Tips:</strong> Use a unique password that you don't use elsewhere. Consider using
                      a password manager to generate and store strong passwords securely.
                    </AlertDescription>
                  </Alert>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Changing Password..." : "Save Password"}
                  </Button>
                </Form>
              )
            }}
          </Formik>
        </CardContent>
      </Card>
    </div>
  )
}
