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

interface SupplierCopilotProps {
  rfpTitle: string;
  onSendMessage: (message: string) => void;
}

interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickActions = [
  { label: 'Improve clarity', prompt: 'Make this response more clear and professional.' },
  { label: 'Strengthen value', prompt: 'Highlight the value proposition and competitive advantages.' },
  { label: 'Add evidence', prompt: 'Add specific examples and case studies to support this.' },
  { label: 'Check compliance', prompt: 'Verify this response meets all RFP requirements.' },
];

export function SupplierCopilot({ rfpTitle, onSendMessage }: SupplierCopilotProps) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Welcome! I'm your proposal copilot for "${rfpTitle}". I can help you craft compelling responses, ensure compliance with RFP requirements, and strengthen your proposal. How can I assist you?`,
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
          content: generateMockResponse(inputValue.trim(), rfpTitle),
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
            <h3 className="font-semibold text-text-primary text-sm">Proposal Copilot</h3>
            <p className="text-xs text-text-muted">Strengthen your response</p>
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
            placeholder="Ask for help with your proposal..."
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

// Mock response generator for supplier proposals
function generateMockResponse(question: string, rfpTitle: string): string {
  const responses = [
    `Great question about "${question.slice(0, 30)}...". When responding to "${rfpTitle}", focus on demonstrating how your solution directly addresses the buyer's specific requirements and provides measurable value.`,
    `For best results in this proposal, ensure you include: specific examples from similar projects, clear timelines with deliverables, and evidence of your team's expertise. This strengthens your competitive position.`,
    `I recommend highlighting your unique differentiators in response to this. For "${rfpTitle}", consider emphasizing your technical capabilities, proven track record, and dedicated support model to stand out.`,
    `To improve compliance with this RFP requirement, make sure to explicitly reference the buyer's stated criteria and map your capabilities directly to each requirement mentioned.`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}
