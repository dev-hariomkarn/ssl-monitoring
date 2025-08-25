import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Clock, AlertTriangle, CheckCircle, Bell, BarChart3, Globe, Lock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SSLMonitoringLanding() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <Shield className="w-3 h-3 mr-1" />
                    SSL Certificate Monitoring
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Never Let Your SSL Certificates Expire Again
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl">
                    Monitor your SSL certificates 24/7 and get instant alerts before they expire. Protect your website's
                    security and maintain customer trust with automated SSL monitoring.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Start Free Trial
                  </Button>
                  <Button variant="outline" size="lg">
                    View Demo
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Free 14-day trial</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>No credit card required</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Image
                    src="/images/ssl.webp"
                    width="400"
                    height="400"
                    alt="SSL Monitoring Dashboard"
                  />
                  {/* <div className="absolute -top-4 -right-4 bg-green-600 text-white p-2 rounded-full">
                    <Shield className="w-6 h-6" />
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Complete SSL Certificate Management</h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to monitor, manage, and maintain your SSL certificates across all your domains.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <Clock className="w-10 h-10 text-green-600" />
                  <CardTitle>Real-time Monitoring</CardTitle>
                  <CardDescription>
                    Monitor your SSL certificates 24/7 with real-time status updates and instant notifications.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Bell className="w-10 h-10 text-green-600" />
                  <CardTitle>Smart Alerts</CardTitle>
                  <CardDescription>
                    Get notified via email, SMS, or Slack before your certificates expire. Customizable alert timing.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <BarChart3 className="w-10 h-10 text-green-600" />
                  <CardTitle>Detailed Analytics</CardTitle>
                  <CardDescription>
                    Track certificate health, expiration dates, and security grades with comprehensive reporting.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Globe className="w-10 h-10 text-green-600" />
                  <CardTitle>Multi-Domain Support</CardTitle>
                  <CardDescription>
                    Monitor unlimited domains and subdomains from a single dashboard. Perfect for agencies and
                    enterprises.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Lock className="w-10 h-10 text-green-600" />
                  <CardTitle>Security Scanning</CardTitle>
                  <CardDescription>
                    Advanced security checks including cipher strength, protocol versions, and vulnerability detection.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <AlertTriangle className="w-10 h-10 text-green-600" />
                  <CardTitle>Issue Detection</CardTitle>
                  <CardDescription>
                    Automatically detect SSL configuration issues, mixed content warnings, and certificate chain
                    problems.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Trusted by Thousands of Websites</h2>
                  <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Join thousands of businesses that trust SSLGuard to keep their websites secure and their customers
                    protected.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-600">50,000+</div>
                    <div className="text-sm text-gray-600">Certificates Monitored</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-600">99.9%</div>
                    <div className="text-sm text-gray-600">Uptime Guarantee</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-600">5,000+</div>
                    <div className="text-sm text-gray-600">Happy Customers</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-600">24/7</div>
                    <div className="text-sm text-gray-600">Monitoring</div>
                  </div>
                </div>
              </div>
              <Image
                src="/images/ssl-monitoring.jpg"
                width="500"
                height="400"
                alt="SSL Monitoring Statistics"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover shadow-lg lg:order-last"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-600">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                  Ready to Secure Your Website?
                </h2>
                <p className="mx-auto max-w-[600px] text-green-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Start monitoring your SSL certificates today. Get instant alerts, detailed reports, and peace of mind.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex gap-2">
                  <Input type="email" placeholder="Enter your email" className="max-w-lg flex-1 bg-white" />
                  <Button type="submit" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                    Get Started
                  </Button>
                </form>
                <p className="text-xs text-green-100">
                  Start your free 14-day trial. No credit card required.{" "}
                  <Link href="/terms" className="underline underline-offset-2 hover:text-white">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                  Start Free Trial
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
                >
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Customers Say</h2>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      "SSLGuard saved us from a major outage. We got alerted 30 days before our certificate expired and
                      were able to renew it in time."
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600">JD</span>
                      </div>
                      <div>
                        <div className="font-medium">John Doe</div>
                        <div className="text-sm text-gray-600">CTO, TechCorp</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      "The dashboard is incredibly intuitive. I can monitor all our client websites from one place.
                      Highly recommended!"
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600">SM</span>
                      </div>
                      <div>
                        <div className="font-medium">Sarah Miller</div>
                        <div className="text-sm text-gray-600">Agency Owner</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      "Great service with excellent support. The automated alerts give us peace of mind knowing our
                      certificates are always monitored."
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600">MJ</span>
                      </div>
                      <div>
                        <div className="font-medium">Mike Johnson</div>
                        <div className="text-sm text-gray-600">DevOps Engineer</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
