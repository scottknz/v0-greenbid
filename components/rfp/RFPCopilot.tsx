'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Paperclip,
  ArrowUp,
  Sparkles,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  Loader2,
  Settings2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RFPDocument, RFPChatMessage } from '@/types/rfp';

interface RFPCopilotProps {
  rfp: RFPDocument;
  onSendMessage: (message: string) => void;
}

interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickActions = [
  { label: 'Improve tone', prompt: 'Make the content more professional and formal in tone.' },
  { label: 'Add more detail', prompt: 'Expand with more specific details and requirements.' },
  { label: 'Simplify language', prompt: 'Simplify the language to be clearer and more accessible.' },
  { label: 'Check consistency', prompt: 'Review the document for consistency in style and terminology.' },
];

export function RFPCopilot({ rfp, onSendMessage }: RFPCopilotProps) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Welcome! I'm your RFP copilot for "${rfp.title}". I can help you with general questions about your RFP, suggest improvements, or provide guidance on best practices. How can I assist you?`,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      const userMessage: CopilotMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: inputValue.trim(),
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');
      setIsLoading(true);
      onSendMessage(inputValue.trim());

      // Simulate AI response
      setTimeout(() => {
        const assistantMessage: CopilotMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: generateMockResponse(inputValue.trim(), rfp.title),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (prompt: string) => {
    setInputValue(prompt);
    textareaRef.current?.focus();
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-white">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green-light text-brand-green">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary text-sm">General Copilot</h3>
            <p className="text-xs text-text-muted">Ask anything about your RFP</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'flex-row-reverse' : ''
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                  message.role === 'user'
                    ? 'bg-surface border border-border text-text-primary'
                    : 'bg-brand-green-light text-brand-green border border-brand-green/20'
                )}
              >
                {message.role === 'user' ? 'U' : <Sparkles className="h-4 w-4" />}
              </div>

              {/* Content */}
              <div
                className={cn(
                  'flex-1 space-y-2',
                  message.role === 'user' ? 'flex flex-col items-end' : ''
                )}
              >
                <div
                  className={cn(
                    'rounded-lg p-3 text-sm leading-relaxed',
                    message.role === 'user'
                      ? 'bg-brand-green text-white rounded-tr-none max-w-[85%]'
                      : 'bg-surface border border-border text-text-primary rounded-tl-none'
                  )}
                >
                  {message.content}
                </div>

                {/* Copy button for assistant messages */}
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(message.content, message.id)}
                      className="h-7 text-xs text-text-muted hover:text-text-primary"
                    >
                      {copiedId === message.id ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <Copy className="h-3 w-3 mr-1" />
                      )}
                      {copiedId === message.id ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-green-light text-brand-green border border-brand-green/20">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-border">
                <span className="text-sm text-text-muted">Thinking</span>
                <span className="flex gap-1">
                  <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-border">
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action.prompt)}
              disabled={isLoading}
              className="h-7 text-xs border-border hover:border-brand-green hover:text-brand-green"
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-white">
        <div className="relative flex items-end gap-2 rounded-xl border border-border bg-surface p-2 focus-within:border-brand-green focus-within:ring-1 focus-within:ring-brand-green transition-all">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your RFP..."
            className="flex-1 resize-none border-0 bg-transparent py-1.5 text-sm placeholder:text-text-muted focus-visible:ring-0 min-h-[32px] max-h-[120px]"
            rows={1}
          />
          
          <Button
            type="button"
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="h-8 w-8 p-0 bg-brand-green text-white hover:bg-brand-green-mid disabled:opacity-50"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-center text-[11px] text-text-muted mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

// Mock response generator
function generateMockResponse(question: string, rfpTitle: string): string {
  const responses = [
    `Based on your question about "${question.slice(0, 30)}...", I recommend focusing on clarity and specificity. For "${rfpTitle}", ensure each section clearly defines expectations and requirements.`,
    `Great question! When working on RFPs like "${rfpTitle}", it's important to maintain consistency across all sections. Consider reviewing the terminology you've used throughout.`,
    `I can help with that. For professional RFPs, I suggest using active voice and being specific about deliverables, timelines, and evaluation criteria.`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}
