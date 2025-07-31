"use client"

import { useState } from "react"
import Link from "next/link"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { googleLogin, login } from "../_redux/authApi"
import { useRouter } from "next/navigation"
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
})

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()
  const ClientId = process.env.NEXT_PUBLIC_GOOGLE_CID!


  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const data = {
        email: values.email,
        password: values.password
      }
      const res = await dispatch(login(data))
      if (!res.error) {
        router.push("/user-dashboard")
      }
    },
  })

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    console.log('credentialResponse', credentialResponse)
    try {
      if (credentialResponse.credential) {
        const data = {
          credential: credentialResponse.credential,
        }
        console.log('data', data)

        const res = await dispatch(googleLogin(data))
        console.log('res', res)
        // if (!res.error) {
        //   router.push("/user-dashboard")
        // }
      }
    } catch (error) {
      console.error("Google login error:", error)
    }
  }

  const handleGoogleError = () => {
    console.error("Google login failed")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-green-600 ">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...formik.getFieldProps("email")}
                className={formik.touched.email && formik.errors.email ? "border-red-500" : ""}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-red-500">{formik.errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...formik.getFieldProps("password")}
                  className={formik.touched.password && formik.errors.password ? "border-red-500 pr-10" : "pr-10"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-sm text-red-500">{formik.errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Link href="/forgot-password" className="text-sm text-green-600 font-bold">
                Forgot your password?
              </Link>
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 cursor-pointer" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">or continue with</span>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <GoogleOAuthProvider clientId={ClientId}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  width="100%"
                  text="signin_with"
                />
              </GoogleOAuthProvider>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            {"Don't have an account? "}
            <Link href="/register" className="text-sm text-green-600 font-bold">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
