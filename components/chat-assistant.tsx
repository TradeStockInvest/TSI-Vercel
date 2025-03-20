"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, X, Send, Minimize2, Maximize2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm TSI Assistant. How can I help you with your trading today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I can help you with that! Let me analyze the market conditions for you.",
        "That's a great question about trading. Here's what I can tell you...",
        "Based on current market trends, I'd recommend looking into diversifying your portfolio.",
        "I'm checking the latest data on that stock. One moment please.",
        "Have you considered setting up stop-loss orders for your positions?",
        "The market has been quite volatile lately. It's important to manage your risk carefully.",
        "I can show you how to use our AI trading features if you're interested.",
        "That's a common question! Let me explain how our platform handles that.",
      ]

      const aiMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: responses[Math.floor(Math.random() * responses.length)],
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat button */}
      <Button
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg"
        onClick={toggleChat}
        aria-label="Chat with TSI Assistant"
      >
        <Bot className="h-6 w-6" />
      </Button>

      {/* Chat window */}
      {isOpen && (
        <Card
          className={`fixed bottom-6 right-6 w-80 md:w-96 shadow-xl transition-all duration-200 ${
            isMinimized ? "h-14" : "h-[500px]"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between p-3 border-b">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="TSI Assistant" />
                <AvatarFallback>TSI</AvatarFallback>
              </Avatar>
              <CardTitle className="text-sm">TSI Assistant</CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={toggleMinimize} className="h-7 w-7">
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleChat} className="h-7 w-7">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              <CardContent className="p-0 flex-grow">
                <ScrollArea className="h-[400px] p-4">
                  <div className="flex flex-col gap-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 ${
                            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg px-3 py-2 bg-muted">
                          <div className="flex gap-1">
                            <div
                              className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                              className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-3 border-t">
                <div className="flex w-full items-center gap-2">
                  <Input
                    ref={inputRef}
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleSendMessage} disabled={!input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </>
          )}
        </Card>
      )}
    </>
  )
}

