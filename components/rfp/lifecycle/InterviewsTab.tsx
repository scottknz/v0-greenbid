'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  Clock,
  Plus,
  MoreHorizontal,
  Video,
  MapPin,
  Users,
  MessageSquare,
  Star,
  ChevronRight,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RFPInterview, InterviewType, InterviewStatus, InterviewNote, RFPResponse } from '@/types/rfp';
import { INTERVIEW_TYPE_LABELS, INTERVIEW_STATUS_LABELS } from '@/types/rfp';

interface InterviewsTabProps {
  rfpId: string;
  interviews: RFPInterview[];
  responses: RFPResponse[];
  onScheduleInterview: (interview: Partial<RFPInterview>) => void;
  onUpdateInterview: (id: string, updates: Partial<RFPInterview>) => void;
  onAddNote: (interviewId: string, note: Partial<InterviewNote>) => void;
  onCancelInterview: (id: string) => void;
}

const statusConfig: Record<InterviewStatus, { color: string; icon: React.ElementType }> = {
  scheduled: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Calendar },
  confirmed: { color: 'bg-brand-green-light text-brand-green border-brand-green/20', icon: CheckCircle },
  in_progress: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
  completed: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: CheckCircle },
  cancelled: { color: 'bg-gray-100 text-gray-500 border-gray-200', icon: XCircle },
  rescheduled: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: AlertCircle },
  no_show: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
};

const noteCategories = [
  { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-700' },
  { value: 'strength', label: 'Strength', color: 'bg-green-100 text-green-700' },
  { value: 'concern', label: 'Concern', color: 'bg-amber-100 text-amber-700' },
  { value: 'question', label: 'Question', color: 'bg-blue-100 text-blue-700' },
  { value: 'action_item', label: 'Action Item', color: 'bg-purple-100 text-purple-700' },
];

export function InterviewsTab({
  rfpId,
  interviews,
  responses,
  onScheduleInterview,
  onUpdateInterview,
  onAddNote,
  onCancelInterview,
}: InterviewsTabProps) {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<RFPInterview | null>(null);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [newNote, setNewNote] = useState({ content: '', category: 'general' as InterviewNote['category'] });
  
  // Schedule form state
  const [scheduleForm, setScheduleForm] = useState({
    responseId: '',
    title: '',
    interviewType: 'discovery' as InterviewType,
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    meetingLink: '',
    agenda: '',
  });

  const shortlistedResponses = responses.filter(r => 
    r.status === 'shortlisted' || r.status === 'finalist' || r.status === 'evaluated'
  );

  const upcomingInterviews = interviews.filter(i => 
    i.status === 'scheduled' || i.status === 'confirmed'
  ).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

  const completedInterviews = interviews.filter(i => i.status === 'completed');
  const cancelledInterviews = interviews.filter(i => i.status === 'cancelled' || i.status === 'no_show');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSchedule = () => {
    const response = responses.find(r => r.id === scheduleForm.responseId);
    if (!response) return;

    onScheduleInterview({
      rfpId,
      responseId: scheduleForm.responseId,
      supplierId: response.supplierId,
      supplierName: response.supplierName,
      title: scheduleForm.title,
      interviewType: scheduleForm.interviewType,
      scheduledDate: scheduleForm.scheduledDate,
      scheduledTime: scheduleForm.scheduledTime,
      duration: scheduleForm.duration,
      meetingLink: scheduleForm.meetingLink,
      agenda: scheduleForm.agenda,
      status: 'scheduled',
      buyerAttendees: [],
      supplierAttendees: [],
      notes: [],
    });

    setShowScheduleModal(false);
    setScheduleForm({
      responseId: '',
      title: '',
      interviewType: 'discovery',
      scheduledDate: '',
      scheduledTime: '',
      duration: 60,
      meetingLink: '',
      agenda: '',
    });
  };

  const handleAddNote = () => {
    if (!selectedInterview || !newNote.content.trim()) return;
    
    onAddNote(selectedInterview.id, {
      content: newNote.content,
      category: newNote.category,
      author: 'Current User',
      authorId: 'user-1',
      timestamp: new Date().toISOString(),
      isPrivate: false,
    });

    setNewNote({ content: '', category: 'general' });
  };

  const renderInterviewCard = (interview: RFPInterview) => {
    const StatusIcon = statusConfig[interview.status]?.icon || Calendar;
    
    return (
      <Card 
        key={interview.id} 
        className={cn(
          'border-border bg-background hover:shadow-sm transition-shadow cursor-pointer',
          selectedInterview?.id === interview.id && 'ring-2 ring-brand-green'
        )}
        onClick={() => {
          setSelectedInterview(interview);
          setShowNotesPanel(true);
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge 
                  variant="outline" 
                  className={cn('text-xs', statusConfig[interview.status]?.color)}
                >
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {INTERVIEW_STATUS_LABELS[interview.status]}
                </Badge>
                <Badge variant="outline" className="text-xs border-border">
                  {INTERVIEW_TYPE_LABELS[interview.interviewType]}
                </Badge>
              </div>
              
              <h4 className="font-medium text-text-primary mb-1 truncate">
                {interview.title}
              </h4>
              
              <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-[10px] bg-surface">
                    {getInitials(interview.supplierName)}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{interview.supplierName}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-text-muted">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(interview.scheduledDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(interview.scheduledTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{interview.buyerAttendees.length + interview.supplierAttendees.length}</span>
                </div>
              </div>

              {interview.meetingLink && (
                <a 
                  href={interview.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-sm text-brand-green hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Video className="h-4 w-4" />
                  Join Meeting
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              {interview.overallRating && (
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        'h-4 w-4',
                        star <= interview.overallRating! ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                      )}
                    />
                  ))}
                </div>
              )}
              
              {interview.notes.length > 0 && (
                <div className="flex items-center gap-1 text-sm text-text-muted">
                  <MessageSquare className="h-4 w-4" />
                  <span>{interview.notes.length} notes</span>
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Interview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onCancelInterview(interview.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Cancel Interview
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className={cn('flex-1 space-y-6', showNotesPanel && 'max-w-[calc(100%-400px)]')}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Interviews</h3>
            <p className="text-sm text-text-muted">
              {upcomingInterviews.length} upcoming, {completedInterviews.length} completed
            </p>
          </div>
          <Button
            onClick={() => setShowScheduleModal(true)}
            className="bg-brand-green hover:bg-brand-green-mid text-white gap-2"
          >
            <Plus className="h-4 w-4" />
            Schedule Interview
          </Button>
        </div>

        {/* Upcoming Interviews */}
        {upcomingInterviews.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
              Upcoming
            </h4>
            <div className="grid gap-4">
              {upcomingInterviews.map(renderInterviewCard)}
            </div>
          </div>
        )}

        {/* Completed Interviews */}
        {completedInterviews.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
              Completed
            </h4>
            <div className="grid gap-4">
              {completedInterviews.map(renderInterviewCard)}
            </div>
          </div>
        )}

        {/* Empty State */}
        {interviews.length === 0 && (
          <Card className="border-border bg-background">
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 text-text-muted mx-auto mb-3" />
              <p className="text-text-secondary font-medium">No interviews scheduled</p>
              <p className="text-sm text-text-muted mt-1">
                Schedule interviews with shortlisted suppliers
              </p>
              <Button
                onClick={() => setShowScheduleModal(true)}
                className="mt-4 bg-brand-green hover:bg-brand-green-mid text-white"
              >
                Schedule First Interview
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Notes Panel */}
      {showNotesPanel && selectedInterview && (
        <div className="w-96 shrink-0 border-l border-border pl-6">
          <div className="sticky top-0">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-text-primary">Interview Notes</h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setShowNotesPanel(false);
                  setSelectedInterview(null);
                }}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>

            <Card className="border-border bg-surface mb-4">
              <CardContent className="p-3">
                <p className="font-medium text-text-primary text-sm">{selectedInterview.title}</p>
                <p className="text-xs text-text-muted mt-1">
                  {selectedInterview.supplierName} - {formatDate(selectedInterview.scheduledDate)}
                </p>
              </CardContent>
            </Card>

            {/* Add Note Form */}
            <div className="space-y-3 mb-4">
              <Textarea
                placeholder="Add a note..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="min-h-[80px] bg-background border-border"
              />
              <div className="flex items-center gap-2">
                <Select
                  value={newNote.category}
                  onValueChange={(value) => setNewNote({ ...newNote, category: value as InterviewNote['category'] })}
                >
                  <SelectTrigger className="w-32 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {noteCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  onClick={handleAddNote}
                  disabled={!newNote.content.trim()}
                  className="bg-brand-green hover:bg-brand-green-mid text-white"
                >
                  Add Note
                </Button>
              </div>
            </div>

            {/* Notes List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {selectedInterview.notes.map((note) => {
                const category = noteCategories.find(c => c.value === note.category);
                return (
                  <div key={note.id} className="p-3 rounded-lg bg-background border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={cn('text-xs', category?.color)}>
                        {category?.label}
                      </Badge>
                      <span className="text-xs text-text-muted">
                        {new Date(note.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-text-primary">{note.content}</p>
                    <p className="text-xs text-text-muted mt-2">- {note.author}</p>
                  </div>
                );
              })}
              
              {selectedInterview.notes.length === 0 && (
                <p className="text-sm text-text-muted text-center py-4">
                  No notes yet. Add your first note above.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Supplier</Label>
              <Select
                value={scheduleForm.responseId}
                onValueChange={(value) => {
                  const response = responses.find(r => r.id === value);
                  setScheduleForm({
                    ...scheduleForm,
                    responseId: value,
                    title: response ? `Interview - ${response.supplierName}` : '',
                  });
                }}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {shortlistedResponses.map((response) => (
                    <SelectItem key={response.id} value={response.id}>
                      {response.supplierName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Interview Title</Label>
              <Input
                value={scheduleForm.title}
                onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                placeholder="e.g., Technical Deep Dive"
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Interview Type</Label>
              <Select
                value={scheduleForm.interviewType}
                onValueChange={(value) => setScheduleForm({ ...scheduleForm, interviewType: value as InterviewType })}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(INTERVIEW_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={scheduleForm.scheduledDate}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledDate: e.target.value })}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input
                  type="time"
                  value={scheduleForm.scheduledTime}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledTime: e.target.value })}
                  className="bg-background border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Duration (minutes)</Label>
              <Select
                value={scheduleForm.duration.toString()}
                onValueChange={(value) => setScheduleForm({ ...scheduleForm, duration: parseInt(value) })}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Meeting Link (optional)</Label>
              <Input
                value={scheduleForm.meetingLink}
                onChange={(e) => setScheduleForm({ ...scheduleForm, meetingLink: e.target.value })}
                placeholder="https://meet.example.com/..."
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Agenda (optional)</Label>
              <Textarea
                value={scheduleForm.agenda}
                onChange={(e) => setScheduleForm({ ...scheduleForm, agenda: e.target.value })}
                placeholder="Topics to cover..."
                className="bg-background border-border min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSchedule}
              disabled={!scheduleForm.responseId || !scheduleForm.scheduledDate || !scheduleForm.scheduledTime}
              className="bg-brand-green hover:bg-brand-green-mid text-white"
            >
              Schedule Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
