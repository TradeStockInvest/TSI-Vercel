"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [country, setCountry] = useState("US")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [taxId, setTaxId] = useState("")
  const [employmentStatus, setEmploymentStatus] = useState("")
  const [investmentExperience, setInvestmentExperience] = useState("beginner")
  const [annualIncome, setAnnualIncome] = useState("")
  const [netWorth, setNetWorth] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const [agreeDataProcessing, setAgreeDataProcessing] = useState(false)
  const [receiveMarketingEmails, setReceiveMarketingEmails] = useState(true)
  const [saveLogin, setSaveLogin] = useState(false)
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()

  const validateSignupStep1 = () => {
    if (!email || !password || !confirmPassword || !fullName) {
      setStatus("Please fill in all required fields.")
      return false
    }

    if (password !== confirmPassword) {
      setStatus("Passwords do not match.")
      return false
    }

    if (password.length < 8) {
      setStatus("Password must be at least 8 characters long.")
      return false
    }

    return true
  }

  const validateSignupStep2 = () => {
    if (!dateOfBirth || !address || !city || !state || !zipCode || !country || !phoneNumber) {
      setStatus("Please fill in all required fields.")
      return false
    }

    // Validate date of birth (must be at least 18 years old)
    const dobDate = new Date(dateOfBirth)
    const today = new Date()
    const age = today.getFullYear() - dobDate.getFullYear()
    const monthDiff = today.getMonth() - dobDate.getMonth()

    if (age < 18 || (age === 18 && monthDiff < 0)) {
      setStatus("You must be at least 18 years old to register.")
      return false
    }

    return true
  }

  const validateSignupStep3 = () => {
    if (!taxId || !employmentStatus || !investmentExperience || !annualIncome || !netWorth) {
      setStatus("Please fill in all required fields.")
      return false
    }

    if (!agreeTerms || !agreePrivacy || !agreeDataProcessing) {
      setStatus("You must agree to all terms and conditions to continue.")
      return false
    }

    return true
  }

  const handleNextStep = () => {
    setStatus("")

    if (currentStep === 1 && validateSignupStep1()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validateSignupStep2()) {
      setCurrentStep(3)
    }
  }

  const handlePrevStep = () => {
    setStatus("")
    setCurrentStep(currentStep - 1)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus("Logging in...")

    if (!email || !password) {
      setStatus("Please fill in both email and password.")
      setLoading(false)
      return
    }

    try {
      // Simulate API call to login
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store user credentials based on saveLogin preference
      if (saveLogin) {
        localStorage.setItem("userEmail", email)
        localStorage.setItem("userLoggedIn", "true")
      } else {
        sessionStorage.setItem("userEmail", email)
        sessionStorage.setItem("userLoggedIn", "true")
      }

      // Check if this user has a balance already
      const existingBalance = localStorage.getItem(`balance_${email}`)
      if (!existingBalance) {
        // Initialize with $100,000 if this is a new user
        localStorage.setItem(`balance_${email}`, "100000")
        localStorage.setItem("simulatedCash", "100000")
        localStorage.setItem("accountCash", "100000")
        localStorage.setItem("accountBuyingPower", "100000")
        localStorage.setItem("accountEquity", "100000")
      } else {
        // Use existing balance for returning users
        localStorage.setItem("simulatedCash", existingBalance)
        localStorage.setItem("accountCash", existingBalance)
        localStorage.setItem("accountBuyingPower", existingBalance)
        localStorage.setItem("accountEquity", existingBalance)
      }

      setStatus("Login successful. Redirecting...")
      router.push("/")
    } catch (error) {
      setStatus("Login failed. Please check your credentials.")
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateSignupStep3()) {
      return
    }

    setLoading(true)
    setStatus("Creating your account...")

    try {
      // Simulate API call to create account
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Store user data
      localStorage.setItem("userEmail", email)
      localStorage.setItem("userName", fullName)
      localStorage.setItem("userLoggedIn", "true")

      // Initialize account with $100,000
      localStorage.setItem(`balance_${email}`, "100000")
      localStorage.setItem("simulatedCash", "100000")
      localStorage.setItem("accountCash", "100000")
      localStorage.setItem("accountBuyingPower", "100000")
      localStorage.setItem("accountEquity", "100000")

      // Store marketing preferences
      if (receiveMarketingEmails) {
        localStorage.setItem("marketingEmails", "true")
        // In a real app, you would add the email to your marketing list
      }

      setStatus("Account created successfully. Redirecting...")
      router.push("/")
    } catch (error) {
      setStatus("Account creation failed. Please try again.")
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setStatus("Logging in with Google...")
    // In a real app, you would implement Google OAuth here
    setTimeout(() => {
      const email = "user@gmail.com"
      localStorage.setItem("userEmail", email)
      localStorage.setItem("userName", "Google User")
      localStorage.setItem("userLoggedIn", "true")

      // Check if this user has a balance already
      const existingBalance = localStorage.getItem(`balance_${email}`)
      if (!existingBalance) {
        // Initialize with $100,000 if this is a new user
        localStorage.setItem(`balance_${email}`, "100000")
        localStorage.setItem("simulatedCash", "100000")
        localStorage.setItem("accountCash", "100000")
        localStorage.setItem("accountBuyingPower", "100000")
        localStorage.setItem("accountEquity", "100000")
      } else {
        // Use existing balance for returning users
        localStorage.setItem("simulatedCash", existingBalance)
        localStorage.setItem("accountCash", existingBalance)
        localStorage.setItem("accountBuyingPower", existingBalance)
        localStorage.setItem("accountEquity", existingBalance)
      }

      router.push("/")
    }, 1500)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>TradeStockInvest Account</CardTitle>
        <CardDescription>Manage your trading account</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="save-login"
                  checked={saveLogin}
                  onCheckedChange={(checked) => setSaveLogin(checked === true)}
                />
                <Label htmlFor="save-login" className="text-sm font-normal">
                  Remember me
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin}>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-4">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground mb-4">Step 1 of 3: Account Information</div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Legal Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email Address</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password (min. 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="button" className="w-full" onClick={handleNextStep}>
                  Continue
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground mb-4">Step 2 of 3: Personal Information</div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter your street address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      placeholder="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip/Postal Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="Zip code"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                        <SelectItem value="DE">Germany</SelectItem>
                        <SelectItem value="FR">France</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePrevStep}>
                    Back
                  </Button>
                  <Button type="button" onClick={handleNextStep}>
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="text-sm text-muted-foreground mb-4">Step 3 of 3: Financial Information</div>

                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID / SSN (Last 4 digits)</Label>
                  <Input
                    id="taxId"
                    placeholder="Enter last 4 digits of SSN"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    maxLength={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employmentStatus">Employment Status</Label>
                  <Select value={employmentStatus} onValueChange={setEmploymentStatus}>
                    <SelectTrigger id="employmentStatus">
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employed">Employed</SelectItem>
                      <SelectItem value="self-employed">Self-Employed</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="investmentExperience">Investment Experience</Label>
                  <Select value={investmentExperience} onValueChange={setInvestmentExperience}>
                    <SelectTrigger id="investmentExperience">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                      <SelectItem value="experienced">Experienced (3-5 years)</SelectItem>
                      <SelectItem value="advanced">Advanced (5+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annualIncome">Annual Income</Label>
                  <Select value={annualIncome} onValueChange={setAnnualIncome}>
                    <SelectTrigger id="annualIncome">
                      <SelectValue placeholder="Select annual income" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under25k">Under $25,000</SelectItem>
                      <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                      <SelectItem value="over250k">Over $250,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="netWorth">Estimated Net Worth</Label>
                  <Select value={netWorth} onValueChange={setNetWorth}>
                    <SelectTrigger id="netWorth">
                      <SelectValue placeholder="Select net worth" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under50k">Under $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                      <SelectItem value="250k-1m">$250,000 - $1,000,000</SelectItem>
                      <SelectItem value="over1m">Over $1,000,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreeTerms}
                      onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                      required
                    />
                    <Label htmlFor="terms" className="text-sm font-normal">
                      I agree to the{" "}
                      <a href="#" className="text-primary hover:underline">
                        Terms of Service
                      </a>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="privacy"
                      checked={agreePrivacy}
                      onCheckedChange={(checked) => setAgreePrivacy(checked === true)}
                      required
                    />
                    <Label htmlFor="privacy" className="text-sm font-normal">
                      I agree to the{" "}
                      <a href="#" className="text-primary hover:underline">
                        Privacy Policy
                      </a>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="data-processing"
                      checked={agreeDataProcessing}
                      onCheckedChange={(checked) => setAgreeDataProcessing(checked === true)}
                      required
                    />
                    <Label htmlFor="data-processing" className="text-sm font-normal">
                      I consent to the processing of my personal data
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="marketing"
                      checked={receiveMarketingEmails}
                      onCheckedChange={(checked) => setReceiveMarketingEmails(checked === true)}
                    />
                    <Label htmlFor="marketing" className="text-sm font-normal">
                      I would like to receive marketing emails about products and services
                    </Label>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePrevStep}>
                    Back
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </form>
            )}
          </TabsContent>
        </Tabs>

        {status && (
          <div className="mt-4">
            <Alert variant="default">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>{status}</AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <Alert variant="outline" className="mt-2">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription className="text-xs">
            All accounts start with $100,000 in demo funds. You can add more from the wallet section.
          </AlertDescription>
        </Alert>
      </CardFooter>
    </Card>
  )
}

