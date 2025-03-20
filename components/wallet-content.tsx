"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon, DollarSign, CreditCard, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { addFundsToAccount } from "@/lib/utils/account-manager"

export function WalletContent() {
  const [accountCash, setAccountCash] = useState("0")
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [transferAmount, setTransferAmount] = useState("")
  const [status, setStatus] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    // Get account information
    const cash = localStorage.getItem("accountCash") || "0"
    setAccountCash(cash)

    // Get user email
    const email = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail") || ""
    setUserEmail(email)

    // Get transaction history
    const storedTransactions = localStorage.getItem(`transactions_${email}`)
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions))
    } else {
      // Initialize with empty array
      setTransactions([])
    }
  }, [])

  const handleDeposit = () => {
    if (!depositAmount || isNaN(Number.parseFloat(depositAmount)) || Number.parseFloat(depositAmount) <= 0) {
      setStatus("Please enter a valid deposit amount")
      return
    }

    const amount = Number.parseFloat(depositAmount)

    // Add funds to account
    const newBalance = addFundsToAccount(userEmail, amount)
    setAccountCash(newBalance.toString())

    // Record transaction
    const transaction = {
      type: "deposit",
      amount,
      date: new Date().toISOString(),
      status: "completed",
      description: "Deposit to trading account",
    }

    const updatedTransactions = [transaction, ...transactions]
    setTransactions(updatedTransactions)
    localStorage.setItem(`transactions_${userEmail}`, JSON.stringify(updatedTransactions))

    setStatus(`Successfully deposited $${amount.toLocaleString()}`)
    setDepositAmount("")
  }

  const handleWithdraw = () => {
    if (!withdrawAmount || isNaN(Number.parseFloat(withdrawAmount)) || Number.parseFloat(withdrawAmount) <= 0) {
      setStatus("Please enter a valid withdrawal amount")
      return
    }

    const amount = Number.parseFloat(withdrawAmount)
    const currentBalance = Number.parseFloat(accountCash)

    if (amount > currentBalance) {
      setStatus("Insufficient funds for withdrawal")
      return
    }

    // Remove funds from account
    const newBalance = addFundsToAccount(userEmail, -amount)
    setAccountCash(newBalance.toString())

    // Record transaction
    const transaction = {
      type: "withdrawal",
      amount,
      date: new Date().toISOString(),
      status: "completed",
      description: "Withdrawal from trading account",
    }

    const updatedTransactions = [transaction, ...transactions]
    setTransactions(updatedTransactions)
    localStorage.setItem(`transactions_${userEmail}`, JSON.stringify(updatedTransactions))

    setStatus(`Successfully withdrew $${amount.toLocaleString()}`)
    setWithdrawAmount("")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Cash</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Number.parseFloat(accountCash).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Available for trading and withdrawals</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="deposit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deposit Funds</CardTitle>
              <CardDescription>Add funds to your trading account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deposit-amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="deposit-amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-8"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer bg-primary/5">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div className="flex-1">Credit Card</div>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer">
                    <Wallet className="h-5 w-5" />
                    <div className="flex-1">Bank Transfer</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleDeposit} className="w-full">
                Deposit Funds
              </Button>
            </CardFooter>
          </Card>

          {status && (
            <Alert variant="default">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>{status}</AlertDescription>
            </Alert>
          )}

          <Alert variant="outline">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>This is a demo account. No real money will be deposited or withdrawn.</AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="withdraw" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Funds</CardTitle>
              <CardDescription>Withdraw funds from your trading account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdraw-amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-8"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Withdrawal Method</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer">
                    <CreditCard className="h-5 w-5" />
                    <div className="flex-1">Credit Card</div>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer bg-primary/5">
                    <Wallet className="h-5 w-5 text-primary" />
                    <div className="flex-1">Bank Transfer</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleWithdraw} className="w-full">
                Withdraw Funds
              </Button>
            </CardFooter>
          </Card>

          {status && (
            <Alert variant="default">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>{status}</AlertDescription>
            </Alert>
          )}

          <Alert variant="outline">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>This is a demo account. No real money will be deposited or withdrawn.</AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View your recent transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">No transactions yet</div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-full ${transaction.type === "deposit" ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"}`}
                        >
                          {transaction.type === "deposit" ? (
                            <ArrowUpRight
                              className={`h-4 w-4 ${transaction.type === "deposit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                            />
                          ) : (
                            <ArrowDownRight
                              className={`h-4 w-4 ${transaction.type === "deposit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                        </div>
                      </div>
                      <div
                        className={`text-sm font-medium ${transaction.type === "deposit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                      >
                        {transaction.type === "deposit" ? "+" : "-"}${transaction.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

