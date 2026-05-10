'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  User,
  Bell,
  Users,
  Building2,
  Globe,
  Download,
  Upload,
  Plus,
  Trash2,
  Edit3,
  X,
  Check,
  AlertTriangle,
  Shield,
  CreditCard,
  Activity,
  Phone,
  MapPin,
  Mail,
  Briefcase,
  Link2,
  FileText,
  Lock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type SettingsSection = 'profile' | 'company' | 'team' | 'notifications' | 'activity' | 'security' | 'billing' | 'system'

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [activityLogLevel, setActivityLogLevel] = useState('all')
  const [showEmailChangeWarning, setShowEmailChangeWarning] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Mock user data
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@greenbid.com',
    jobTitle: 'Procurement Manager',
    phone: '+1 (555) 123-4567',
  })

  // Mock company data
  const [companyData, setCompanyData] = useState({
    name: 'GreenBid Corp',
    industry: 'Sustainable Technology',
    website: 'https://greenbid.com',
    phone: '+1 (555) 987-6543',
    address: '123 Green Street, Suite 400',
    city: 'San Francisco',
    country: 'United States',
    taxId: 'US-123456789',
    about: 'GreenBid Corp is committed to sustainable procurement practices and helping organizations reduce their environmental impact through smarter supplier relationships.',
  })

  const sections: { key: SettingsSection; label: string; icon: React.ReactNode; description: string }[] = [
    { key: 'profile', label: 'Profile', icon: <User className="h-4 w-4" />, description: 'Your personal information' },
    { key: 'company', label: 'Company', icon: <Building2 className="h-4 w-4" />, description: 'Organisation details' },
    { key: 'team', label: 'Team', icon: <Users className="h-4 w-4" />, description: 'Manage team members' },
    { key: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" />, description: 'Email & in-app alerts' },
    { key: 'activity', label: 'Activity Log', icon: <Activity className="h-4 w-4" />, description: 'Logging preferences' },
    { key: 'security', label: 'Security', icon: <Shield className="h-4 w-4" />, description: 'Password & 2FA' },
    { key: 'billing', label: 'Billing', icon: <CreditCard className="h-4 w-4" />, description: 'Subscription & payments' },
    { key: 'system', label: 'System', icon: <Globe className="h-4 w-4" />, description: 'Language & data export' },
  ]

  const handleSectionChange = (section: SettingsSection) => {
    if (hasUnsavedChanges) {
      // Could show a confirmation dialog here
    }
    setActiveSection(section)
    setIsEditing(false)
  }

  const handleSave = () => {
    setIsEditing(false)
    setHasUnsavedChanges(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setHasUnsavedChanges(false)
  }

  const renderFieldRow = (label: string, value: string, icon?: React.ReactNode) => (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        {icon && <span className="text-text-muted">{icon}</span>}
        <div>
          <p className="text-xs text-text-muted">{label}</p>
          <p className="text-sm font-medium text-text-primary">{value || '—'}</p>
        </div>
      </div>
    </div>
  )

  const renderEditableField = (label: string, value: string, onChange: (v: string) => void, type = 'text', icon?: React.ReactNode) => (
    <div className="space-y-1.5">
      <Label className="text-xs text-text-secondary flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <Input 
        type={type}
        value={value} 
        onChange={(e) => {
          onChange(e.target.value)
          setHasUnsavedChanges(true)
        }}
        className="bg-background border-border"
      />
    </div>
  )

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] flex flex-col max-h-[85vh] p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Manage your account, organisation, and preferences</DialogDescription>
          </DialogHeader>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-56 border-r border-border bg-surface/50 py-4 shrink-0 overflow-y-auto">
              <nav className="space-y-1 px-3">
                {sections.map((section) => (
                  <button
                    key={section.key}
                    onClick={() => handleSectionChange(section.key)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                      activeSection === section.key
                        ? 'bg-[#F0FDF4] text-[#16A34A] font-medium'
                        : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                    )}
                  >
                    {section.icon}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{section.label}</p>
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {/* Section Header with Edit Button */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">
                      {sections.find(s => s.key === activeSection)?.label}
                    </h2>
                    <p className="text-sm text-text-muted">
                      {sections.find(s => s.key === activeSection)?.description}
                    </p>
                  </div>
                  {(activeSection === 'profile' || activeSection === 'company') && (
                    <>
                      {!isEditing ? (
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                          <Edit3 className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={handleCancel} className="gap-2">
                            <X className="h-3.5 w-3.5" />
                            Cancel
                          </Button>
                          <Button size="sm" onClick={handleSave} className="gap-2 bg-[#16A34A] hover:bg-[#15803d] text-white">
                            <Check className="h-3.5 w-3.5" />
                            Save
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Profile Section */}
                {activeSection === 'profile' && (
                  <div className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-4 pb-4 border-b border-border">
                      <Avatar className="h-16 w-16 border-2 border-border">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-[#F0FDF4] text-[#16A34A] text-lg font-semibold">
                          {userData.firstName[0]}{userData.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button variant="outline" size="sm" className="gap-2">
                          <Upload className="h-4 w-4" />
                          Change Photo
                        </Button>
                      )}
                    </div>

                    {/* Fields */}
                    {!isEditing ? (
                      <div className="space-y-1">
                        {renderFieldRow('First Name', userData.firstName, <User className="h-4 w-4" />)}
                        {renderFieldRow('Last Name', userData.lastName)}
                        {renderFieldRow('Email', userData.email, <Mail className="h-4 w-4" />)}
                        {renderFieldRow('Job Title', userData.jobTitle, <Briefcase className="h-4 w-4" />)}
                        {renderFieldRow('Phone', userData.phone, <Phone className="h-4 w-4" />)}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {renderEditableField('First Name', userData.firstName, (v) => setUserData({...userData, firstName: v}), 'text', <User className="h-3.5 w-3.5" />)}
                        {renderEditableField('Last Name', userData.lastName, (v) => setUserData({...userData, lastName: v}))}
                        <div className="col-span-2">
                          <div className="space-y-1.5">
                            <Label className="text-xs text-text-secondary flex items-center gap-2">
                              <Mail className="h-3.5 w-3.5" />
                              Email
                              <Badge variant="outline" className="text-[10px] ml-1 text-amber-600 border-amber-200 bg-amber-50">
                                Requires verification
                              </Badge>
                            </Label>
                            <Input 
                              value={userData.email} 
                              onChange={(e) => {
                                setUserData({...userData, email: e.target.value})
                                setShowEmailChangeWarning(true)
                                setHasUnsavedChanges(true)
                              }}
                              className="bg-background border-border"
                            />
                          </div>
                        </div>
                        {renderEditableField('Job Title', userData.jobTitle, (v) => setUserData({...userData, jobTitle: v}), 'text', <Briefcase className="h-3.5 w-3.5" />)}
                        {renderEditableField('Phone', userData.phone, (v) => setUserData({...userData, phone: v}), 'tel', <Phone className="h-3.5 w-3.5" />)}
                      </div>
                    )}

                    {showEmailChangeWarning && isEditing && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50">
                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-amber-800">
                          <p className="font-medium">Email change requires verification</p>
                          <p>A confirmation link will be sent to your new email address.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Company Section */}
                {activeSection === 'company' && (
                  <div className="space-y-6">
                    {/* Logo */}
                    <div className="flex items-center gap-4 pb-4 border-b border-border">
                      <div className="h-16 w-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-surface">
                        <Building2 className="h-6 w-6 text-text-muted" />
                      </div>
                      {isEditing && (
                        <div>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Upload className="h-4 w-4" />
                            Upload Logo
                          </Button>
                          <p className="text-xs text-text-muted mt-1">Used on supplier communications</p>
                        </div>
                      )}
                    </div>

                    {/* Fields */}
                    {!isEditing ? (
                      <div className="space-y-1">
                        {renderFieldRow('Company Name', companyData.name, <Building2 className="h-4 w-4" />)}
                        {renderFieldRow('Industry', companyData.industry, <Briefcase className="h-4 w-4" />)}
                        {renderFieldRow('Website', companyData.website, <Link2 className="h-4 w-4" />)}
                        {renderFieldRow('Phone', companyData.phone, <Phone className="h-4 w-4" />)}
                        {renderFieldRow('Address', `${companyData.address}, ${companyData.city}`, <MapPin className="h-4 w-4" />)}
                        {renderFieldRow('Country', companyData.country, <Globe className="h-4 w-4" />)}
                        {renderFieldRow('Tax ID / ABN', companyData.taxId, <FileText className="h-4 w-4" />)}
                        <div className="py-3">
                          <p className="text-xs text-text-muted mb-1">About</p>
                          <p className="text-sm text-text-secondary">{companyData.about}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {renderEditableField('Company Name', companyData.name, (v) => setCompanyData({...companyData, name: v}), 'text', <Building2 className="h-3.5 w-3.5" />)}
                          {renderEditableField('Industry', companyData.industry, (v) => setCompanyData({...companyData, industry: v}), 'text', <Briefcase className="h-3.5 w-3.5" />)}
                          {renderEditableField('Website', companyData.website, (v) => setCompanyData({...companyData, website: v}), 'url', <Link2 className="h-3.5 w-3.5" />)}
                          {renderEditableField('Phone', companyData.phone, (v) => setCompanyData({...companyData, phone: v}), 'tel', <Phone className="h-3.5 w-3.5" />)}
                        </div>
                        {renderEditableField('Address', companyData.address, (v) => setCompanyData({...companyData, address: v}), 'text', <MapPin className="h-3.5 w-3.5" />)}
                        <div className="grid grid-cols-2 gap-4">
                          {renderEditableField('City', companyData.city, (v) => setCompanyData({...companyData, city: v}))}
                          <div className="space-y-1.5">
                            <Label className="text-xs text-text-secondary flex items-center gap-2">
                              <Globe className="h-3.5 w-3.5" />
                              Country
                            </Label>
                            <Select value={companyData.country} onValueChange={(v) => setCompanyData({...companyData, country: v})}>
                              <SelectTrigger className="bg-background border-border">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="United States">United States</SelectItem>
                                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                <SelectItem value="Australia">Australia</SelectItem>
                                <SelectItem value="Canada">Canada</SelectItem>
                                <SelectItem value="New Zealand">New Zealand</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        {renderEditableField('Tax ID / ABN', companyData.taxId, (v) => setCompanyData({...companyData, taxId: v}), 'text', <FileText className="h-3.5 w-3.5" />)}
                        <div className="space-y-1.5">
                          <Label className="text-xs text-text-secondary">About (visible to suppliers)</Label>
                          <textarea
                            value={companyData.about}
                            onChange={(e) => {
                              setCompanyData({...companyData, about: e.target.value})
                              setHasUnsavedChanges(true)
                            }}
                            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30"
                            rows={4}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Team Section */}
                {activeSection === 'team' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-text-muted">Manage who has access to your organisation</p>
                      <Button size="sm" className="gap-2 bg-[#16A34A] hover:bg-[#15803d] text-white">
                        <Plus className="h-4 w-4" />
                        Invite Member
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-surface/50">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-[#F0FDF4] text-[#16A34A] font-semibold">JD</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">John Doe</p>
                              <Badge className="bg-[#16A34A] text-white text-[10px]">You</Badge>
                            </div>
                            <p className="text-xs text-text-muted">john.doe@greenbid.com</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="border-[#16A34A] text-[#16A34A]">Owner</Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">JS</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">Jane Smith</p>
                            <p className="text-xs text-text-muted">jane.smith@greenbid.com</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select defaultValue="editor">
                            <SelectTrigger className="w-[110px] h-8 text-xs border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">MB</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">Mike Brown</p>
                            <p className="text-xs text-text-muted">mike.brown@greenbid.com</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select defaultValue="viewer">
                            <SelectTrigger className="w-[110px] h-8 text-xs border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-text-muted">
                        <span className="font-medium">Role permissions:</span> Admins can manage settings and team. Editors can create and edit RFPs. Viewers can only view.
                      </p>
                    </div>
                  </div>
                )}

                {/* Notifications Section */}
                {activeSection === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Email Notifications</h3>
                      <div className="space-y-2">
                        {[
                          { label: 'New Responses', desc: 'When suppliers submit responses to your RFPs' },
                          { label: 'Q&A Updates', desc: 'When there are new or pending questions' },
                          { label: 'Deadline Reminders', desc: '7 days before RFP deadlines' },
                          { label: 'Award Notifications', desc: 'When an RFP is awarded or closed' },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-surface-hover transition-colors">
                            <div>
                              <p className="text-sm font-medium">{item.label}</p>
                              <p className="text-xs text-text-muted">{item.desc}</p>
                            </div>
                            <Checkbox defaultChecked />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <h3 className="text-sm font-medium mb-3">In-App Notifications</h3>
                      <div className="space-y-2">
                        {[
                          { label: 'Response Alerts', desc: 'Desktop notifications for new responses' },
                          { label: 'Message Notifications', desc: 'Alerts for new supplier messages' },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-surface-hover transition-colors">
                            <div>
                              <p className="text-sm font-medium">{item.label}</p>
                              <p className="text-xs text-text-muted">{item.desc}</p>
                            </div>
                            <Checkbox defaultChecked />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Activity Log Section */}
                {activeSection === 'activity' && (
                  <div className="space-y-4">
                    <p className="text-sm text-text-muted">Choose what activities are saved to your audit log</p>
                    <RadioGroup value={activityLogLevel} onValueChange={setActivityLogLevel}>
                      <div className="space-y-2">
                        {[
                          { value: 'all', label: 'All Activities', desc: 'Every action including views, edits, creates, deletes, and system events' },
                          { value: 'major', label: 'Major Activities Only', desc: 'Creates, deletes, submissions, awards, and significant changes' },
                          { value: 'none', label: 'No Logging', desc: 'Activity log will not record any actions' },
                        ].map((item) => (
                          <label
                            key={item.value}
                            className={cn(
                              'flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors',
                              activityLogLevel === item.value 
                                ? 'border-[#16A34A] bg-[#F0FDF4]' 
                                : 'border-border hover:bg-surface-hover'
                            )}
                          >
                            <RadioGroupItem value={item.value} />
                            <div>
                              <p className="text-sm font-medium">{item.label}</p>
                              <p className="text-xs text-text-muted">{item.desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </RadioGroup>

                    {activityLogLevel === 'none' && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50">
                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-amber-800">
                          <p className="font-medium">Compliance Warning</p>
                          <p>Disabling activity logging may affect audit compliance requirements.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Security Section */}
                {activeSection === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Password</h3>
                      <div className="space-y-3 p-4 rounded-lg border border-border">
                        <div className="space-y-2">
                          <Label className="text-xs text-text-secondary">Current Password</Label>
                          <Input type="password" className="bg-background border-border" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-text-secondary">New Password</Label>
                          <Input type="password" className="bg-background border-border" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-text-secondary">Confirm New Password</Label>
                          <Input type="password" className="bg-background border-border" />
                        </div>
                        <Button className="bg-[#16A34A] hover:bg-[#15803d] text-white">
                          Update Password
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <h3 className="text-sm font-medium mb-3">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Lock className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">2FA is not enabled</p>
                            <p className="text-xs text-text-muted">Add extra security to your account</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Enable 2FA</Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <h3 className="text-sm font-medium mb-3 text-red-600">Danger Zone</h3>
                      <div className="p-4 rounded-lg border border-red-200 bg-red-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-red-800">Delete Account</p>
                            <p className="text-xs text-red-600">Permanently delete your account and all data</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-red-300 text-red-600 hover:bg-red-100"
                            onClick={() => setShowDeleteConfirm(true)}
                          >
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Billing Section */}
                {activeSection === 'billing' && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-lg border border-[#16A34A] bg-[#F0FDF4]">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-[#16A34A] text-white">Pro Plan</Badge>
                          </div>
                          <p className="text-sm text-text-muted mt-1">$99/month, billed annually</p>
                        </div>
                        <Button variant="outline" size="sm">Change Plan</Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-3">Payment Method</h3>
                      <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-14 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                            VISA
                          </div>
                          <div>
                            <p className="text-sm font-medium">Visa ending in 4242</p>
                            <p className="text-xs text-text-muted">Expires 12/2027</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Update</Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-3">Billing History</h3>
                      <div className="space-y-2">
                        {[
                          { date: 'May 1, 2026', amount: '$99.00', status: 'Paid' },
                          { date: 'Apr 1, 2026', amount: '$99.00', status: 'Paid' },
                          { date: 'Mar 1, 2026', amount: '$99.00', status: 'Paid' },
                        ].map((invoice, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                            <div className="flex items-center gap-4">
                              <p className="text-sm">{invoice.date}</p>
                              <p className="text-sm font-medium">{invoice.amount}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[#16A34A] border-[#16A34A]">{invoice.status}</Badge>
                              <Button variant="ghost" size="sm" className="text-xs">
                                <Download className="h-3.5 w-3.5 mr-1" />
                                PDF
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* System Section */}
                {activeSection === 'system' && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-sm font-medium">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger className="bg-background border-border mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Timezone</Label>
                      <Select defaultValue="pst">
                        <SelectTrigger className="bg-background border-border mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                          <SelectItem value="est">EST (Eastern)</SelectItem>
                          <SelectItem value="cst">CST (Central)</SelectItem>
                          <SelectItem value="pst">PST (Pacific)</SelectItem>
                          <SelectItem value="gmt">GMT (Greenwich)</SelectItem>
                          <SelectItem value="aest">AEST (Australian Eastern)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <h3 className="text-sm font-medium mb-3">Data Export</h3>
                      <p className="text-xs text-text-muted mb-3">Download your data in CSV format for backup or migration</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="justify-start gap-2">
                          <Download className="h-4 w-4" />
                          RFP History
                        </Button>
                        <Button variant="outline" className="justify-start gap-2">
                          <Download className="h-4 w-4" />
                          Activity Log
                        </Button>
                        <Button variant="outline" className="justify-start gap-2">
                          <Download className="h-4 w-4" />
                          Team Data
                        </Button>
                        <Button variant="outline" className="justify-start gap-2">
                          <Download className="h-4 w-4" />
                          All Data
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Delete Account
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              This will permanently delete your account and all associated data including:
            </p>
            <ul className="text-sm text-text-secondary list-disc pl-5 space-y-1">
              <li>All RFPs and responses</li>
              <li>Company information and branding</li>
              <li>Team members and permissions</li>
              <li>Activity logs and history</li>
            </ul>
            <div className="flex items-start gap-3 p-3 rounded-lg border border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs text-red-800 font-medium">
                This action cannot be undone. Type &quot;DELETE&quot; to confirm.
              </p>
            </div>
            <Input placeholder="Type DELETE to confirm" className="border-red-200 focus:ring-red-500" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
