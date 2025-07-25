"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Send, Bot, User, HelpCircle, CreditCard, BookOpen, Settings, Zap } from "lucide-react"

interface ChatbotProps {
  isOpen: boolean
  onClose: () => void
}

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  suggestions?: string[]
}

export function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "👋 Hi! I'm your CreatorBlog AI assistant. I can help you with:\n\n• Creating and managing content\n• Payment and subscription questions\n• Platform features and navigation\n• Technical support\n• Community guidelines\n\nWhat would you like to know?",
      sender: "bot",
      timestamp: new Date(),
      suggestions: [
        "How do I create premium content?",
        "What are the payment options?",
        "How do I manage my subscriptions?",
        "Tell me about analytics",
      ],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const quickActions = [
    { icon: CreditCard, label: "Billing Help", query: "I need help with billing" },
    { icon: BookOpen, label: "Content Guide", query: "How do I create content?" },
    { icon: Settings, label: "Account Settings", query: "Help with account settings" },
    { icon: HelpCircle, label: "General Help", query: "I need general help" },
  ]

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(
      () => {
        const botResponse = generateBotResponse(content)
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: botResponse.content,
          sender: "bot",
          timestamp: new Date(),
          suggestions: botResponse.suggestions,
        }

        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  const generateBotResponse = (userInput: string): { content: string; suggestions?: string[] } => {
    const input = userInput.toLowerCase()

    if (input.includes("premium") || input.includes("paid content")) {
      return {
        content:
          "To create premium content, go to your Creator Dashboard and click 'Write New Post'. You can set a price for your content and choose whether to offer a preview. Premium content helps you monetize your expertise!",
        suggestions: [
          "How do I set pricing?",
          "What payment methods are supported?",
          "How do readers access premium content?",
        ],
      }
    }

    if (input.includes("payment") || input.includes("billing")) {
      return {
        content:
          "We support multiple payment methods including credit cards, PayPal, and bank transfers. Creators receive 80% of revenue, and payments are processed weekly. You can manage your payment settings in the Earnings section.",
        suggestions: ["When do I get paid?", "How do I update payment info?", "What are the fees?"],
      }
    }

    if (input.includes("subscription") || input.includes("subscribe")) {
      return {
        content:
          "Subscriptions allow readers to access all your premium content for a monthly fee. You can set different subscription tiers and offer exclusive content to subscribers. Manage subscriptions in your Creator Dashboard.",
        suggestions: ["How do I set subscription prices?", "Can I offer free trials?", "How do I manage subscribers?"],
      }
    }

    if (input.includes("analytics") || input.includes("stats")) {
      return {
        content:
          "Analytics help you understand your audience and content performance. You can view metrics like views, engagement, earnings, and subscriber growth. Access detailed analytics in your dashboard's Analytics tab.",
        suggestions: ["What metrics are available?", "How often is data updated?", "Can I export analytics data?"],
      }
    }

    if (input.includes("content") || input.includes("write") || input.includes("create")) {
      return {
        content:
          "Creating great content is key to success! Use our rich text editor to write engaging posts. You can add images, format text, and even embed videos. Consider your audience and provide value in every post.",
        suggestions: ["What makes content engaging?", "How do I add images?", "Can I schedule posts?"],
      }
    }

    if (input.includes("account") || input.includes("settings") || input.includes("profile")) {
      return {
        content:
          "You can manage your account settings by clicking on your profile in the sidebar. Update your bio, profile picture, notification preferences, and privacy settings. Keep your profile complete to build trust with readers.",
        suggestions: ["How do I change my password?", "Can I update my email?", "How do I delete my account?"],
      }
    }

    // Default response
    return {
      content:
        "I'm here to help! I can assist you with content creation, payments, subscriptions, analytics, and general platform questions. What specific topic would you, payments, subscriptions, analytics, and general platform questions. What specific topic would you like to know more about?",
      suggestions: [
        "How do I get started as a creator?",
        "What are the platform fees?",
        "How do I contact support?",
        "Tell me about community guidelines",
      ],
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleQuickAction = (query: string) => {
    handleSendMessage(query)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 border-2 border-gradient-to-r from-blue-500 to-purple-600">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">CreatorBot AI Assistant</DialogTitle>
                <DialogDescription className="text-sm">
                  Get instant help with platform features & support
                </DialogDescription>
              </div>
            </div>
            <Badge variant="default" className="gap-1 bg-green-500 hover:bg-green-600">
              <Zap className="h-3 w-3" />
              Online & Ready
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "bot" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.suggestions && (
                      <div className="mt-3 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="h-auto p-2 text-xs justify-start w-full"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {messages.length === 1 && (
            <div className="px-6 pb-4">
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="gap-2 h-auto p-3 flex-col bg-transparent"
                    onClick={() => handleQuickAction(action.query)}
                  >
                    <action.icon className="h-4 w-4" />
                    <span className="text-xs">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="p-6 pt-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage(inputValue)
                  }
                }}
                disabled={isTyping}
              />
              <Button
                size="icon"
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
