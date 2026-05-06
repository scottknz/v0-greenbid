'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Users, Plus, MoreHorizontal, Mail, Phone, Building2, Star, Trash2, Crown } from 'lucide-react';
import { internalTeamMembers } from '@/lib/mock-rfp';
import type { RFPTeamMember, RFPTeamRole } from '@/types/rfp';
import { cn } from '@/lib/utils';

interface TeamCardProps {
  team: RFPTeamMember[];
  onChange: (team: RFPTeamMember[]) => void;
}

const ROLE_OPTIONS: RFPTeamRole[] = ['Lead', 'Reviewer', 'Approver', 'Observer'];

const roleStyles: Record<RFPTeamRole, string> = {
  Lead:     'bg-brand-green-light text-brand-green border-brand-green/20',
  Approver: 'bg-info-light text-info border-info/20',
  Reviewer: 'bg-warning-light text-warning border-warning/20',
  Observer: 'bg-surface text-text-secondary border-border',
};

function MemberAvatar({ initials, isLead }: { initials: string; isLead: boolean }) {
  return (
    <div className="relative shrink-0">
      <div className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold',
        isLead
          ? 'bg-brand-green text-white'
          : 'bg-surface-hover text-text-secondary'
      )}>
        {initials}
      </div>
      {isLead && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-warning">
          <Crown className="h-2.5 w-2.5 text-white" />
        </span>
      )}
    </div>
  );
}

export function TeamCard({ team, onChange }: TeamCardProps) {
  const [addingMember, setAddingMember] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<RFPTeamRole>('Reviewer');

  // IDs already on the team
  const assignedIds = team.map((m) => m.id);

  // Unassigned members available to add
  const availableMembers = internalTeamMembers.filter(
    (m) => !assignedIds.includes(m.id)
  );

  const handleAddMember = () => {
    if (!selectedMemberId) return;
    const person = internalTeamMembers.find((m) => m.id === selectedMemberId);
    if (!person) return;

    // If adding as Lead, demote existing lead
    const updatedTeam = selectedRole === 'Lead'
      ? team.map((m) => m.isLead ? { ...m, isLead: false, role: 'Reviewer' as RFPTeamRole } : m)
      : [...team];

    const newMember: RFPTeamMember = {
      ...person,
      role: selectedRole,
      isLead: selectedRole === 'Lead',
    };

    onChange([...updatedTeam, newMember]);
    setSelectedMemberId('');
    setSelectedRole('Reviewer');
    setAddingMember(false);
  };

  const handleRemove = (id: string) => {
    onChange(team.filter((m) => m.id !== id));
  };

  const handleChangeRole = (id: string, role: RFPTeamRole) => {
    const updated = team.map((m) => {
      if (m.id === id) {
        return { ...m, role, isLead: role === 'Lead' };
      }
      // Demote existing lead if a new lead is being set
      if (role === 'Lead' && m.isLead) {
        return { ...m, isLead: false, role: 'Reviewer' as RFPTeamRole };
      }
      return m;
    });
    onChange(updated);
  };

  const handleSetLead = (id: string) => {
    handleChangeRole(id, 'Lead');
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-text-primary flex items-center gap-2">
            <Users className="h-4 w-4 text-brand-green" />
            RFP Team
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setAddingMember(true)}
            disabled={availableMembers.length === 0}
            className="border-border text-text-secondary h-8 text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Member
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Add member row */}
        {addingMember && (
          <div className="flex gap-2 items-center rounded-lg border border-dashed border-brand-green/40 bg-brand-green-light/30 p-3">
            <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
              <SelectTrigger className="flex-1 border-border h-8 text-sm">
                <SelectValue placeholder="Select team member..." />
              </SelectTrigger>
              <SelectContent>
                {availableMembers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    <span className="font-medium">{m.name}</span>
                    <span className="ml-2 text-text-muted text-xs">{m.jobTitle}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as RFPTeamRole)}>
              <SelectTrigger className="w-32 border-border h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              size="sm"
              onClick={handleAddMember}
              disabled={!selectedMemberId}
              className="h-8 bg-brand-green hover:bg-brand-green-mid text-white text-xs px-3"
            >
              Add
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => { setAddingMember(false); setSelectedMemberId(''); }}
              className="h-8 text-xs text-text-muted"
            >
              Cancel
            </Button>
          </div>
        )}

        {/* Empty state */}
        {team.length === 0 && !addingMember && (
          <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-border rounded-lg">
            <Users className="h-8 w-8 text-text-muted mb-2" />
            <p className="text-sm text-text-secondary font-medium">No team members assigned</p>
            <p className="text-xs text-text-muted mt-1">Add a Lead and assign roles to get started</p>
          </div>
        )}

        {/* Team member rows */}
        <div className="space-y-2">
          {/* Lead first */}
          {[...team].sort((a, b) => (b.isLead ? 1 : 0) - (a.isLead ? 1 : 0)).map((member) => (
            <div
              key={member.id}
              className={cn(
                'flex items-start gap-3 rounded-lg border p-3 transition-colors',
                member.isLead ? 'border-brand-green/30 bg-brand-green-light/20' : 'border-border bg-background'
              )}
            >
              <MemberAvatar initials={member.avatarInitials} isLead={member.isLead} />

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-text-primary truncate">{member.name}</span>
                  <Badge
                    className={cn('text-[10px] h-4 px-1.5 border', roleStyles[member.role])}
                  >
                    {member.role}
                  </Badge>
                </div>
                <p className="text-xs text-text-secondary truncate">{member.jobTitle} &middot; {member.department}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                  <span className="flex items-center gap-1 text-[11px] text-text-muted">
                    <Mail className="h-3 w-3" />{member.email}
                  </span>
                  {member.phone && (
                    <span className="flex items-center gap-1 text-[11px] text-text-muted">
                      <Phone className="h-3 w-3" />{member.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-text-muted hover:text-text-primary shrink-0"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  {!member.isLead && (
                    <DropdownMenuItem onClick={() => handleSetLead(member.id)} className="text-sm">
                      <Crown className="h-3.5 w-3.5 mr-2 text-warning" />
                      Set as Lead
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {ROLE_OPTIONS.filter((r) => r !== member.role).map((role) => (
                    <DropdownMenuItem
                      key={role}
                      onClick={() => handleChangeRole(member.id, role)}
                      className="text-sm"
                    >
                      Change role to {role}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleRemove(member.id)}
                    className="text-sm text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>

        {team.length > 0 && !team.some((m) => m.isLead) && (
          <p className="text-xs text-warning flex items-center gap-1.5 pt-1">
            <Star className="h-3.5 w-3.5" />
            No Lead assigned. Set a Lead to define the primary point of contact.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
