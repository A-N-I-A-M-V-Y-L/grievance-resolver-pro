import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm here to help you with the grievance system. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Simple rule-based responses for common questions
      const response = getResponse(input.toLowerCase());
      
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response },
        ]);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      toast.error("Failed to get response");
      setIsLoading(false);
    }
  };

  const getResponse = (input: string): string => {
    if (input.includes("submit") || input.includes("grievance")) {
      return "To submit a grievance, go to the 'Submit Grievance' page from your dashboard. Fill in all required details including category, title, and description.";
    } else if (input.includes("status") || input.includes("track")) {
      return "You can track your grievance status from your dashboard. Each grievance has a unique ID and shows its current status (Submitted, In Progress, Resolved, or Closed).";
    } else if (input.includes("category") || input.includes("type")) {
      return "We handle various categories: Academic (courses, exams), Facility (infrastructure, equipment), Examination (scheduling, results), Placement (internships, job opportunities), and Other issues.";
    } else if (input.includes("admin") || input.includes("review")) {
      return "Admins review all submitted grievances and can update their status. You'll be notified when there are updates to your grievance.";
    } else if (input.includes("help") || input.includes("how")) {
      return "I can help you with:\n• Submitting grievances\n• Tracking grievance status\n• Understanding categories\n• General system navigation\n\nWhat would you like to know more about?";
    } else {
      return "I'm here to help with the grievance system. You can ask me about submitting grievances, tracking status, categories, or general help. How can I assist you?";
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg">Support Assistant</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4 py-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-lg px-4 py-2 bg-muted">
                      <p className="text-sm">Typing...</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your question..."
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
