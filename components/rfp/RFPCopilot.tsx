'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
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
import type { RFPChatMessage, RFPSectionType } from '@/types/rfp';
import { SECTION_TITLES } from '@/types/rfp';

interface RFPCopilotProps {
  messages: RFPChatMessage[];
  onSendMessage: (message: string) => void;
  onAcceptSuggestion: (messageId: string) => void;
  onRejectSuggestion: (messageId: string) => void;
  onRegenerateSuggestion: (messageId: string) => void;
  isLoading: boolean;
  currentSection: RFPSectionType | null;
  onSectionSelect: (section: RFPSectionType) => void;
}

const quickActions = [
  { label: 'Draft this section', prompt: 'Please draft the content for this section based on the project details.' },
  { label: 'Improve tone', prompt: 'Make this section more professional and formal in tone.' },
  { label: 'Add more detail', prompt: 'Expand this section with more specific details and requirements.' },
  { label: 'Simplify language', prompt: 'Simplify the language to be clearer and more accessible.' },
  { label: 'Add requirements', prompt: 'Suggest additional requirements I should include in this section.' },
];

export function RFPCopilot({
  messages,
  onSendMessage,
  onAcceptSuggestion,
  onRejectSuggestion,
  onRegenerateSuggestion,
  isLoading,
  currentSection,
  onSectionSelect,
}: RFPCopilotProps) {
  const [inputValue, setInputValue] = useState('');
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
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (prompt: string) => {
    onSendMessage(prompt);
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
            <h3 className="font-semibold text-text-primary text-sm">RFP Copilot</h3>
            <p className="text-xs text-text-muted">AI-powered writing assistant</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Settings2 className="h-4 w-4 text-text-muted" />
        </Button>
      </div>

      {/* Current Section Indicator */}
      {currentSection && (
        <div className="px-4 py-2 border-b border-border bg-brand-green-light/30">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">Working on:</span>
            <Badge variant="secondary" className="bg-white text-brand-green border border-brand-green/20 text-xs">
              {SECTION_TITLES[currentSection]}
            </Badge>
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-brand-green-light text-brand-green mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h4 className="font-medium text-text-primary mb-2">Ready to help!</h4>
              <p className="text-sm text-text-muted max-w-[240px] mx-auto">
                I can help you draft sections, improve content, or answer questions about your RFP.
              </p>
            </div>
          ) : (
            messages.map((message) => (
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

                  {/* AI Suggestion Actions */}
                  {message.role === 'assistant' && message.suggestedContent && (
                    <div className="flex items-center gap-1 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAcceptSuggestion(message.id)}
                        className="h-7 text-xs text-brand-green hover:text-brand-green hover:bg-brand-green-light"
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Accept
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRejectSuggestion(message.id)}
                        className="h-7 text-xs text-text-muted hover:text-red-500"
                      >
                        <ThumbsDown className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRegenerateSuggestion(message.id)}
                        className="h-7 text-xs text-text-muted hover:text-text-primary"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Regenerate
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(message.suggestedContent!, message.id)}
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
            ))
          )}

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
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-text-muted hover:text-text-primary"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Copilot anything..."
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
          AI can make mistakes. Review suggestions before accepting.
        </p>
      </div>
    </div>
  );
}
