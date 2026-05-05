'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  CheckCircle2, 
  ArrowRight,
  Sparkles 
} from 'lucide-react';
import type { RFPTemplate, RFPProjectInfo } from '@/types/rfp';

interface InterviewMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  questionKey?: string;
}

interface InterviewQuestion {
  key: string;
  question: string;
  followUp?: string;
  required: boolean;
  category: 'overview' | 'scope' | 'requirements' | 'timeline' | 'evaluation';
}

const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    key: 'project_overview',
    question: "Let's start with the basics. Can you describe the main purpose of this RFP? What problem are you trying to solve or what service are you looking to procure?",
    required: true,
    category: 'overview',
  },
  {
    key: 'company_context',
    question: "Tell me about your organization's context. What industry are you in, and what relevant background should suppliers understand about your company?",
    required: true,
    category: 'overview',
  },
  {
    key: 'scope_details',
    question: "What specific deliverables or outcomes do you expect from the selected supplier? Please describe the scope of work in detail.",
    required: true,
    category: 'scope',
  },
  {
    key: 'technical_requirements',
    question: "Are there any specific technical requirements, standards, or certifications that suppliers must meet? Include any regulatory or compliance requirements.",
    required: true,
    category: 'requirements',
  },
  {
    key: 'budget_constraints',
    question: "What is your expected budget range for this project? Is there any flexibility in the budget, or are there constraints I should know about?",
    followUp: "If you prefer to keep the budget confidential, just let me know.",
    required: false,
    category: 'requirements',
  },
  {
    key: 'timeline_expectations',
    question: "What is your ideal timeline for this project? Include any critical deadlines, milestones, or phases you have in mind.",
    required: true,
    category: 'timeline',
  },
  {
    key: 'evaluation_priorities',
    question: "How do you plan to evaluate proposals? What factors are most important to you (e.g., price, experience, methodology, sustainability credentials)?",
    required: true,
    category: 'evaluation',
  },
  {
    key: 'additional_context',
    question: "Is there anything else I should know to help create a comprehensive RFP? Any specific concerns, preferences, or unique requirements?",
    required: false,
    category: 'overview',
  },
];

interface RFPInterviewProps {
  template: RFPTemplate;
  projectInfo: Partial<RFPProjectInfo>;
  onComplete: (interviewData: Record<string, string>) => void;
  onSkip: () => void;
}

export function RFPInterview({ 
  template, 
  projectInfo, 
  onComplete, 
  onSkip 
}: RFPInterviewProps) {
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Start the interview with an intro message
  useEffect(() => {
    // Prevent double initialization in React strict mode
    if (messages.length > 0) return;

    const introMessage: InterviewMessage = {
      id: `intro-${Date.now()}`,
      role: 'assistant',
      content: `Hello! I'm here to help you create a professional ${template.name}. I'll ask you a series of questions to gather all the information needed to generate a comprehensive RFP document.\n\nYou can answer in as much detail as you like - the more context you provide, the better the resulting document will be.\n\nLet's begin!`,
      timestamp: new Date(),
    };

    setMessages([introMessage]);

    // Ask the first question after a short delay
    setTimeout(() => {
      askQuestion(0);
    }, 1000);
  }, [template.name]);

  const askQuestion = (index: number) => {
    if (index >= INTERVIEW_QUESTIONS.length) {
      // Interview complete
      completeInterview();
      return;
    }

    setIsTyping(true);
    const question = INTERVIEW_QUESTIONS[index];

    setTimeout(() => {
      const questionMessage: InterviewMessage = {
        id: `q-${index}-${Date.now()}`,
        role: 'assistant',
        content: question.followUp 
          ? `${question.question}\n\n${question.followUp}`
          : question.question,
        timestamp: new Date(),
        questionKey: question.key,
      };

      setMessages((prev) => [...prev, questionMessage]);
      setIsTyping(false);
      setCurrentQuestionIndex(index);
      inputRef.current?.focus();
    }, 800);
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) return;

    const currentQuestion = INTERVIEW_QUESTIONS[currentQuestionIndex];
    
    // Add user's response
    const userMessage: InterviewMessage = {
      id: `a-${currentQuestionIndex}-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.key]: inputValue,
    }));
    setInputValue('');

    // Move to next question
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < INTERVIEW_QUESTIONS.length) {
      setTimeout(() => {
        // Add acknowledgment
        const ackMessage: InterviewMessage = {
          id: `ack-${currentQuestionIndex}-${Date.now()}`,
          role: 'assistant',
          content: getAcknowledgment(currentQuestion.category),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, ackMessage]);

        // Ask next question
        setTimeout(() => {
          askQuestion(nextIndex);
        }, 600);
      }, 300);
    } else {
      completeInterview();
    }
  };

  const getAcknowledgment = (category: string): string => {
    const acks: Record<string, string[]> = {
      overview: [
        "Great, that gives me a clear picture.",
        "Understood. This context will be helpful.",
        "Perfect, I have a good understanding now.",
      ],
      scope: [
        "Excellent detail on the scope.",
        "That's very comprehensive, thank you.",
        "Clear deliverables - this will translate well.",
      ],
      requirements: [
        "Noted. These requirements are important.",
        "Good to know these specifications.",
        "I'll make sure these are clearly stated.",
      ],
      timeline: [
        "Timeline noted.",
        "I'll structure the milestones accordingly.",
        "Clear timeline expectations.",
      ],
      evaluation: [
        "Good evaluation criteria.",
        "This will help suppliers understand priorities.",
        "Clear priorities for evaluation.",
      ],
    };

    const options = acks[category] || acks.overview;
    return options[Math.floor(Math.random() * options.length)];
  };

  const completeInterview = () => {
    setIsTyping(true);
    
    setTimeout(() => {
      const completionMessage: InterviewMessage = {
        id: `complete-${Date.now()}`,
        role: 'assistant',
        content: "Thank you for providing all that information! I now have everything I need to generate your RFP document. Click the button below to proceed, and I'll create a comprehensive draft based on your responses.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, completionMessage]);
      setIsTyping(false);
      setIsComplete(true);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const progress = ((currentQuestionIndex + (isComplete ? 1 : 0)) / INTERVIEW_QUESTIONS.length) * 100;

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[700px]">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-secondary">
            Interview Progress
          </span>
          <span className="text-sm font-medium text-text-primary">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 bg-surface-hover rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-green transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Chat Messages */}
      <Card className="flex-1 overflow-hidden border-border bg-white">
        <div className="h-full overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-green-light flex items-center justify-center">
                  <Bot className="w-4 h-4 text-brand-green" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] rounded-lg px-4 py-3',
                  message.role === 'user'
                    ? 'bg-brand-green text-white'
                    : 'bg-surface text-text-primary'
                )}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </p>
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center">
                  <User className="w-4 h-4 text-text-secondary" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-green-light flex items-center justify-center">
                <Bot className="w-4 h-4 text-brand-green" />
              </div>
              <div className="bg-surface rounded-lg px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </Card>

      {/* Input Area */}
      <div className="mt-4">
        {!isComplete ? (
          <div className="flex gap-2">
            <Textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your response..."
              className="min-h-[80px] resize-none border-border"
              disabled={isTyping}
            />
            <Button
              onClick={handleSubmit}
              disabled={!inputValue.trim() || isTyping}
              className="bg-brand-green hover:bg-brand-green/90 text-white self-end"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Button
              onClick={() => onComplete(answers)}
              className="flex-1 bg-brand-green hover:bg-brand-green/90 text-white gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate RFP Document
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {!isComplete && (
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-text-muted">
              Press Enter to send, Shift+Enter for new line
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="text-text-muted hover:text-text-secondary"
            >
              Skip interview and edit manually
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
