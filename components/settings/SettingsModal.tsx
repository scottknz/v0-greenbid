'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  User,
  Bell,
  Users,
  Palette,
  Globe,
  Download,
  Upload,
  Plus,
  Trash2,
  Copy,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState('profile')
  const [activityLogLevel, setActivityLogLevel] = useState('all')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] flex flex-col max-h-[85vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage your account, preferences, and organisation settings</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent px-6 py-0 h-auto gap-0">
              <TabsTrigger
                value="profile"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#16A34A] data-[state=active]:bg-transparent px-4 py-3"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#16A34A] data-[state=active]:bg-transparent px-4 py-3"
              >
                <Copy className="h-4 w-4 mr-2" />
                Activity Log
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#16A34A] data-[state=active]:bg-transparent px-4 py-3"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="team"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#16A34A] data-[state=active]:bg-transparent px-4 py-3"
              >
                <Users className="h-4 w-4 mr-2" />
                Team
              </TabsTrigger>
              <TabsTrigger
                value="branding"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#16A34A] data-[state=active]:bg-transparent px-4 py-3"
              >
                <Palette className="h-4 w-4 mr-2" />
                Branding
              </TabsTrigger>
              <TabsTrigger
                value="system"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#16A34A] data-[state=active]:bg-transparent px-4 py-3"
              >
                <Globe className="h-4 w-4 mr-2" />
                System
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              {/* Profile Tab */}
              <TabsContent value="profile" className="px-6 py-4 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-end gap-4">
                    <Avatar className="h-16 w-16 border-2 border-border">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-[#F0FDF4] text-[#16A34A] text-lg font-semibold">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-text-secondary">First Name</Label>
                      <Input defaultValue="John" className="bg-background border-border" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-text-secondary">Last Name</Label>
                      <Input defaultValue="Doe" className="bg-background border-border" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-text-secondary">Email</Label>
                    <Input defaultValue="john.doe@example.com" className="bg-background border-border" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-text-secondary">Job Title</Label>
                    <Input defaultValue="Procurement Manager" className="bg-background border-border" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-text-secondary">Company / Organisation Name</Label>
                    <Input defaultValue="GreenBid Corp" className="bg-background border-border" />
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Label className="text-sm font-medium">Change Password</Label>
                    <div className="space-y-3 mt-3">
                      <div className="space-y-2">
                        <Label className="text-xs text-text-secondary">Current Password</Label>
                        <Input type="password" className="bg-background border-border" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-text-secondary">New Password</Label>
                        <Input type="password" className="bg-background border-border" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-text-secondary">Confirm Password</Label>
                        <Input type="password" className="bg-background border-border" />
                      </div>
                      <Button className="w-full bg-[#16A34A] hover:bg-[#15803d] text-white">
                        Update Password
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Activity Log Tab */}
              <TabsContent value="activity" className="px-6 py-4 space-y-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-3">What activities should be saved to your activity log?</p>
                    <RadioGroup value={activityLogLevel} onValueChange={setActivityLogLevel}>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-surface-hover cursor-pointer">
                          <RadioGroupItem value="all" id="activity-all" />
                          <Label htmlFor="activity-all" className="flex-1 cursor-pointer">
                            <div className="font-medium text-sm">All Activities</div>
                            <p className="text-xs text-text-secondary">Saves all actions: creates, edits, deletes, responses, Q&A, awards</p>
                          </Label>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-surface-hover cursor-pointer">
                          <RadioGroupItem value="major" id="activity-major" />
                          <Label htmlFor="activity-major" className="flex-1 cursor-pointer">
                            <div className="font-medium text-sm">Major Activities Only</div>
                            <p className="text-xs text-text-secondary">Saves significant actions: creates, deletes, responses, awards</p>
                          </Label>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-surface-hover cursor-pointer">
                          <RadioGroupItem value="none" id="activity-none" />
                          <Label htmlFor="activity-none" className="flex-1 cursor-pointer">
                            <div className="font-medium text-sm">No Activity Logging</div>
                            <p className="text-xs text-text-secondary">Activity log will not be saved</p>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="px-6 py-4 space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-3">Email Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div>
                          <p className="text-sm font-medium">New Responses</p>
                          <p className="text-xs text-text-secondary">Notified when suppliers submit responses</p>
                        </div>
                        <Checkbox defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div>
                          <p className="text-sm font-medium">Q&A Updates</p>
                          <p className="text-xs text-text-secondary">Notified when there are pending questions</p>
                        </div>
                        <Checkbox defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div>
                          <p className="text-sm font-medium">Deadline Reminders</p>
                          <p className="text-xs text-text-secondary">Notified 7 days before RFP deadline</p>
                        </div>
                        <Checkbox defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div>
                          <p className="text-sm font-medium">Award Notifications</p>
                          <p className="text-xs text-text-secondary">Notified when an RFP is awarded</p>
                        </div>
                        <Checkbox defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h3 className="font-medium mb-3">In-App Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div>
                          <p className="text-sm font-medium">Response Alerts</p>
                          <p className="text-xs text-text-secondary">Show in-app alerts for new responses</p>
                        </div>
                        <Checkbox defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div>
                          <p className="text-sm font-medium">Message Notifications</p>
                          <p className="text-xs text-text-secondary">Show in-app alerts for new messages</p>
                        </div>
                        <Checkbox defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Team Tab */}
              <TabsContent value="team" className="px-6 py-4 space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">Team Members</h3>
                      <Button size="sm" className="gap-2 bg-[#16A34A] hover:bg-[#15803d] text-white">
                        <Plus className="h-4 w-4" />
                        Invite Member
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
                              JD
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">John Doe</p>
                            <p className="text-xs text-text-secondary">john@example.com</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-[#16A34A] text-white">Admin</Badge>
                          <span className="text-xs text-text-muted">Owner</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-semibold">
                              JS
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">Jane Smith</p>
                            <p className="text-xs text-text-secondary">jane@example.com</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select defaultValue="editor">
                            <SelectTrigger className="w-[120px] h-8 text-xs border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Branding Tab */}
              <TabsContent value="branding" className="px-6 py-4 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Company Logo</Label>
                    <p className="text-xs text-text-secondary mb-3">Used on supplier-facing documents and communications</p>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-surface">
                        <Palette className="h-6 w-6 text-text-muted" />
                      </div>
                      <Button variant="outline" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Upload Logo
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Label className="text-sm font-medium">Organisation Details</Label>
                    <div className="space-y-3 mt-3">
                      <div className="space-y-2">
                        <Label className="text-xs text-text-secondary">Organisation Name</Label>
                        <Input defaultValue="GreenBid Corp" className="bg-background border-border" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-text-secondary">Website URL</Label>
                        <Input defaultValue="https://greenbid.com" className="bg-background border-border" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-text-secondary">About (visible to suppliers)</Label>
                        <textarea
                          className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30"
                          rows={4}
                          defaultValue="GreenBid Corp is committed to sustainable procurement..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* System Tab */}
              <TabsContent value="system" className="px-6 py-4 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger className="bg-background border-border mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español (Spanish)</SelectItem>
                        <SelectItem value="fr">Français (French)</SelectItem>
                        <SelectItem value="de">Deutsch (German)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Timezone</Label>
                    <Select defaultValue="utc">
                      <SelectTrigger className="bg-background border-border mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                        <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                        <SelectItem value="cst">CST (Central Standard Time)</SelectItem>
                        <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                        <SelectItem value="gmt">GMT (Greenwich Mean Time)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Label className="text-sm font-medium">Data Export</Label>
                    <p className="text-xs text-text-secondary mb-3">Download your data in CSV format</p>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Download className="h-4 w-4" />
                        Export RFP History
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Download className="h-4 w-4" />
                        Export Activity Log
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Download className="h-4 w-4" />
                        Export Team Information
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="border-t border-border px-6 py-4 flex justify-end gap-2 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-[#16A34A] hover:bg-[#15803d] text-white">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
