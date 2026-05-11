import type {
  RFPResponse,
  RFPInterview,
  EvaluationCriteria,
  ProposalEvaluation,
  RFPAward,
  PostAwardCommunication,
  SupplierRanking,
  RFPLifecycleStats,
} from '@/types/rfp';

// =====================================================
// MOCK RESPONSES
// =====================================================

export const mockResponses: RFPResponse[] = [
  {
    id: 'resp-001',
    rfpId: '1',
    supplierId: 'sup-001',
    supplierName: 'EcoSolutions Ltd',
    supplierLogo: undefined,
    submittedAt: '2026-05-01T14:30:00Z',
    submittedBy: 'Sarah Johnson',
    status: 'shortlisted',
    priceAnswers: [
      { priceLineItemId: 'price-1', label: 'Total Contract Value', value: 125000, currency: 'USD', notes: 'Includes all deliverables' },
      { priceLineItemId: 'price-2', label: 'Annual Maintenance', value: 15000, currency: 'USD' },
    ],
    questionAnswers: [
      { questionId: 'q-1', label: 'Implementation Timeline', value: '12 weeks', fieldType: 'text' },
      { questionId: 'q-2', label: 'Team Size', value: 8, fieldType: 'number' },
    ],
    attachments: [
      { id: 'att-1', name: 'Technical Proposal.pdf', type: 'application/pdf', size: 2456000, uploadedAt: '2026-05-01T14:25:00Z', url: '#' },
      { id: 'att-2', name: 'Company Profile.pdf', type: 'application/pdf', size: 1234000, uploadedAt: '2026-05-01T14:26:00Z', url: '#' },
    ],
    totalScore: 82,
    rank: 1,
    evaluationStatus: 'complete',
    lastUpdatedAt: '2026-05-05T10:00:00Z',
    shortlistedAt: '2026-05-03T09:00:00Z',
    evaluatedAt: '2026-05-05T10:00:00Z',
  },
  {
    id: 'resp-002',
    rfpId: '1',
    supplierId: 'sup-002',
    supplierName: 'GreenTech Industries',
    submittedAt: '2026-05-02T09:15:00Z',
    submittedBy: 'Michael Chen',
    status: 'shortlisted',
    priceAnswers: [
      { priceLineItemId: 'price-1', label: 'Total Contract Value', value: 142000, currency: 'USD' },
      { priceLineItemId: 'price-2', label: 'Annual Maintenance', value: 18000, currency: 'USD' },
    ],
    questionAnswers: [
      { questionId: 'q-1', label: 'Implementation Timeline', value: '10 weeks', fieldType: 'text' },
      { questionId: 'q-2', label: 'Team Size', value: 12, fieldType: 'number' },
    ],
    attachments: [
      { id: 'att-3', name: 'Proposal Document.pdf', type: 'application/pdf', size: 3456000, uploadedAt: '2026-05-02T09:10:00Z', url: '#' },
    ],
    totalScore: 78,
    rank: 2,
    evaluationStatus: 'complete',
    lastUpdatedAt: '2026-05-05T11:00:00Z',
    shortlistedAt: '2026-05-03T09:15:00Z',
    evaluatedAt: '2026-05-05T11:00:00Z',
  },
  {
    id: 'resp-003',
    rfpId: '1',
    supplierId: 'sup-003',
    supplierName: 'Sustainable Partners Co',
    submittedAt: '2026-05-02T16:45:00Z',
    submittedBy: 'Emma Williams',
    status: 'evaluated',
    priceAnswers: [
      { priceLineItemId: 'price-1', label: 'Total Contract Value', value: 118000, currency: 'USD' },
      { priceLineItemId: 'price-2', label: 'Annual Maintenance', value: 12000, currency: 'USD' },
    ],
    questionAnswers: [
      { questionId: 'q-1', label: 'Implementation Timeline', value: '14 weeks', fieldType: 'text' },
      { questionId: 'q-2', label: 'Team Size', value: 6, fieldType: 'number' },
    ],
    attachments: [
      { id: 'att-4', name: 'Full Proposal.pdf', type: 'application/pdf', size: 4567000, uploadedAt: '2026-05-02T16:40:00Z', url: '#' },
    ],
    totalScore: 71,
    rank: 3,
    evaluationStatus: 'complete',
    lastUpdatedAt: '2026-05-05T12:00:00Z',
    evaluatedAt: '2026-05-05T12:00:00Z',
  },
  {
    id: 'resp-004',
    rfpId: '1',
    supplierId: 'sup-004',
    supplierName: 'EnviroTech Solutions',
    submittedAt: '2026-05-03T11:20:00Z',
    submittedBy: 'David Brown',
    status: 'submitted',
    priceAnswers: [
      { priceLineItemId: 'price-1', label: 'Total Contract Value', value: 135000, currency: 'USD' },
      { priceLineItemId: 'price-2', label: 'Annual Maintenance', value: 16500, currency: 'USD' },
    ],
    questionAnswers: [
      { questionId: 'q-1', label: 'Implementation Timeline', value: '11 weeks', fieldType: 'text' },
      { questionId: 'q-2', label: 'Team Size', value: 10, fieldType: 'number' },
    ],
    attachments: [],
    evaluationStatus: 'pending',
    lastUpdatedAt: '2026-05-03T11:20:00Z',
  },
  {
    id: 'resp-005',
    rfpId: '1',
    supplierId: 'sup-005',
    supplierName: 'CleanFuture Inc',
    submittedAt: '2026-05-04T08:00:00Z',
    submittedBy: 'Lisa Anderson',
    status: 'clarifications_requested',
    priceAnswers: [
      { priceLineItemId: 'price-1', label: 'Total Contract Value', value: 128000, currency: 'USD' },
    ],
    questionAnswers: [],
    attachments: [
      { id: 'att-5', name: 'Initial Proposal.pdf', type: 'application/pdf', size: 1890000, uploadedAt: '2026-05-04T07:55:00Z', url: '#' },
    ],
    evaluationStatus: 'pending',
    lastUpdatedAt: '2026-05-04T14:00:00Z',
  },
];

// =====================================================
// MOCK INTERVIEWS
// =====================================================

export const mockInterviews: RFPInterview[] = [
  {
    id: 'int-001',
    rfpId: '1',
    responseId: 'resp-001',
    supplierId: 'sup-001',
    supplierName: 'EcoSolutions Ltd',
    scheduledDate: '2026-05-12',
    scheduledTime: '10:00',
    duration: 60,
    timezone: 'America/New_York',
    interviewType: 'technical',
    status: 'completed',
    title: 'Technical Deep Dive - EcoSolutions',
    agenda: '1. Review technical architecture\n2. Discuss integration approach\n3. Q&A on sustainability metrics',
    meetingLink: 'https://meet.example.com/abc123',
    buyerAttendees: [
      { id: 'ba-1', name: 'John Smith', email: 'john@buyer.com', role: 'Technical Lead', isRequired: true, rsvpStatus: 'accepted' },
      { id: 'ba-2', name: 'Maria Garcia', email: 'maria@buyer.com', role: 'Project Manager', isRequired: true, rsvpStatus: 'accepted' },
    ],
    supplierAttendees: [
      { id: 'sa-1', name: 'Sarah Johnson', email: 'sarah@ecosolutions.com', role: 'Account Director', isRequired: true, rsvpStatus: 'accepted' },
      { id: 'sa-2', name: 'Tom Lee', email: 'tom@ecosolutions.com', role: 'Technical Architect', isRequired: true, rsvpStatus: 'accepted' },
    ],
    notes: [
      { id: 'note-1', author: 'John Smith', authorId: 'user-1', timestamp: '2026-05-12T11:05:00Z', content: 'Strong technical team with clear understanding of our requirements. Architecture proposal is solid.', category: 'strength', isPrivate: false },
      { id: 'note-2', author: 'Maria Garcia', authorId: 'user-2', timestamp: '2026-05-12T11:10:00Z', content: 'Timeline seems aggressive but they have done similar projects before.', category: 'concern', isPrivate: false },
      { id: 'note-3', author: 'John Smith', authorId: 'user-1', timestamp: '2026-05-12T11:15:00Z', content: 'Follow up on their API rate limiting approach', category: 'action_item', isPrivate: false },
    ],
    overallRating: 4,
    recommendation: 'proceed',
    createdAt: '2026-05-06T09:00:00Z',
    createdBy: 'user-1',
    completedAt: '2026-05-12T11:00:00Z',
    lastUpdatedAt: '2026-05-12T11:15:00Z',
  },
  {
    id: 'int-002',
    rfpId: '1',
    responseId: 'resp-002',
    supplierId: 'sup-002',
    supplierName: 'GreenTech Industries',
    scheduledDate: '2026-05-13',
    scheduledTime: '14:00',
    duration: 60,
    timezone: 'America/New_York',
    interviewType: 'technical',
    status: 'completed',
    title: 'Technical Review - GreenTech',
    agenda: '1. Technical capabilities\n2. Team structure\n3. Reference projects',
    meetingLink: 'https://meet.example.com/def456',
    buyerAttendees: [
      { id: 'ba-1', name: 'John Smith', email: 'john@buyer.com', role: 'Technical Lead', isRequired: true, rsvpStatus: 'accepted' },
    ],
    supplierAttendees: [
      { id: 'sa-3', name: 'Michael Chen', email: 'michael@greentech.com', role: 'Sales Director', isRequired: true, rsvpStatus: 'accepted' },
    ],
    notes: [
      { id: 'note-4', author: 'John Smith', authorId: 'user-1', timestamp: '2026-05-13T15:05:00Z', content: 'Larger team available, good for scaling if needed.', category: 'strength', isPrivate: false },
      { id: 'note-5', author: 'John Smith', authorId: 'user-1', timestamp: '2026-05-13T15:10:00Z', content: 'Higher price point needs justification - request detailed breakdown', category: 'question', isPrivate: false },
    ],
    overallRating: 3,
    recommendation: 'needs_follow_up',
    createdAt: '2026-05-06T09:30:00Z',
    createdBy: 'user-1',
    completedAt: '2026-05-13T15:00:00Z',
    lastUpdatedAt: '2026-05-13T15:10:00Z',
  },
  {
    id: 'int-003',
    rfpId: '1',
    responseId: 'resp-001',
    supplierId: 'sup-001',
    supplierName: 'EcoSolutions Ltd',
    scheduledDate: '2026-05-20',
    scheduledTime: '09:00',
    duration: 90,
    timezone: 'America/New_York',
    interviewType: 'final',
    status: 'scheduled',
    title: 'Final Presentation - EcoSolutions',
    agenda: '1. Final proposal presentation\n2. Commercial terms\n3. Contract discussion',
    meetingLink: 'https://meet.example.com/ghi789',
    buyerAttendees: [
      { id: 'ba-1', name: 'John Smith', email: 'john@buyer.com', role: 'Technical Lead', isRequired: true, rsvpStatus: 'accepted' },
      { id: 'ba-2', name: 'Maria Garcia', email: 'maria@buyer.com', role: 'Project Manager', isRequired: true, rsvpStatus: 'accepted' },
      { id: 'ba-3', name: 'Robert Taylor', email: 'robert@buyer.com', role: 'CFO', isRequired: true, rsvpStatus: 'pending' },
    ],
    supplierAttendees: [
      { id: 'sa-1', name: 'Sarah Johnson', email: 'sarah@ecosolutions.com', role: 'Account Director', isRequired: true, rsvpStatus: 'accepted' },
      { id: 'sa-4', name: 'James Wilson', email: 'james@ecosolutions.com', role: 'CEO', isRequired: true, rsvpStatus: 'accepted' },
    ],
    notes: [],
    createdAt: '2026-05-14T10:00:00Z',
    createdBy: 'user-1',
    lastUpdatedAt: '2026-05-14T10:00:00Z',
  },
];

// =====================================================
// MOCK EVALUATION CRITERIA
// =====================================================

export const mockEvaluationCriteria: EvaluationCriteria[] = [
  {
    id: 'crit-001',
    rfpId: '1',
    name: 'Technical Capability',
    description: 'Ability to deliver technical requirements',
    weight: 20,
    maxScore: 10,
    rubric: '10: Exceeds all requirements\n8-9: Meets all requirements with some exceeding\n6-7: Meets most requirements\n4-5: Meets some requirements\n1-3: Does not meet requirements',
    order: 1,
    isRequired: true,
  },
  {
    id: 'crit-006',
    rfpId: '1',
    name: 'Content and Quality',
    description: 'Quality and completeness of proposal content',
    weight: 20,
    maxScore: 10,
    rubric: '10: Exceptional quality, comprehensive and well-structured\n8-9: High quality, complete response\n6-7: Good quality, mostly complete\n4-5: Acceptable quality, missing some details\n1-3: Poor quality or incomplete',
    order: 2,
    isRequired: true,
  },
  {
    id: 'crit-004',
    rfpId: '1',
    name: 'Delivery and Timeline',
    description: 'Ability to meet project timeline',
    weight: 15,
    maxScore: 10,
    rubric: '10: Exceeds timeline requirements\n8-9: Meets timeline comfortably\n6-7: Meets timeline\n4-5: Tight timeline\n1-3: Unable to meet timeline',
    order: 3,
    isRequired: true,
  },
  {
    id: 'crit-003',
    rfpId: '1',
    name: 'Sustainability',
    description: 'Environmental and sustainability practices',
    weight: 15,
    maxScore: 10,
    rubric: '10: Industry-leading sustainability\n8-9: Strong sustainability practices\n6-7: Good sustainability practices\n4-5: Basic sustainability\n1-3: Limited sustainability focus',
    order: 4,
    isRequired: true,
  },
  {
    id: 'crit-005',
    rfpId: '1',
    name: 'References and Track Record',
    description: 'Past performance and client references',
    weight: 15,
    maxScore: 10,
    rubric: '10: Exceptional references\n8-9: Strong references\n6-7: Good references\n4-5: Limited references\n1-3: Poor or no references',
    order: 5,
    isRequired: true,
  },
  {
    id: 'crit-002',
    rfpId: '1',
    name: 'Price',
    description: 'Value for money and pricing structure',
    weight: 15,
    maxScore: 10,
    rubric: '10: Most competitive price\n8-9: Competitive price\n6-7: Average price\n4-5: Above average price\n1-3: Significantly above average',
    order: 6,
    isRequired: true,
  },
];

// =====================================================
// MOCK EVALUATIONS
// =====================================================

export const mockEvaluations: ProposalEvaluation[] = [
  {
    id: 'eval-001',
    rfpId: '1',
    responseId: 'resp-001',
    supplierId: 'sup-001',
    supplierName: 'EcoSolutions Ltd',
    scores: [
      { id: 'score-1', responseId: 'resp-001', evaluatorId: 'user-1', evaluatorName: 'John Smith', criteriaId: 'crit-001', score: 9, maxScore: 10, comment: 'Excellent technical approach with strong team', timestamp: '2026-05-05T09:00:00Z', isFinalized: true },
      { id: 'score-1b', responseId: 'resp-001', evaluatorId: 'user-1', evaluatorName: 'John Smith', criteriaId: 'crit-006', score: 9, maxScore: 10, comment: 'Well-structured and comprehensive proposal', timestamp: '2026-05-05T09:05:00Z', isFinalized: true },
      { id: 'score-2', responseId: 'resp-001', evaluatorId: 'user-1', evaluatorName: 'John Smith', criteriaId: 'crit-004', score: 8, maxScore: 10, comment: 'Reasonable delivery timeline', timestamp: '2026-05-05T09:10:00Z', isFinalized: true },
      { id: 'score-3', responseId: 'resp-001', evaluatorId: 'user-1', evaluatorName: 'John Smith', criteriaId: 'crit-003', score: 9, maxScore: 10, comment: 'Strong sustainability credentials', timestamp: '2026-05-05T09:15:00Z', isFinalized: true },
      { id: 'score-4', responseId: 'resp-001', evaluatorId: 'user-1', evaluatorName: 'John Smith', criteriaId: 'crit-005', score: 8, maxScore: 10, comment: 'Good references from similar projects', timestamp: '2026-05-05T09:20:00Z', isFinalized: true },
      { id: 'score-5', responseId: 'resp-001', evaluatorId: 'user-1', evaluatorName: 'John Smith', criteriaId: 'crit-002', score: 7, maxScore: 10, comment: 'Competitive but not the lowest price', timestamp: '2026-05-05T09:25:00Z', isFinalized: true },
    ],
    totalWeightedScore: 82,
    maxPossibleScore: 100,
    percentageScore: 82,
    status: 'finalized',
    evaluators: [
      { evaluatorId: 'user-1', evaluatorName: 'John Smith', assignedAt: '2026-05-04T09:00:00Z', status: 'submitted', submittedAt: '2026-05-05T10:00:00Z' },
    ],
    consensusScore: 82,
    startedAt: '2026-05-05T09:00:00Z',
    completedAt: '2026-05-05T10:00:00Z',
    lastUpdatedAt: '2026-05-05T10:00:00Z',
  },
  {
    id: 'eval-002',
    rfpId: '1',
    responseId: 'resp-002',
    supplierId: 'sup-002',
    supplierName: 'GreenTech Industries',
    scores: [
      { id: 'score-6', responseId: 'resp-002', evaluatorId: 'user-1', evaluatorName: 'John Smith', criteriaId: 'crit-001', score: 8, maxScore: 10, comment: 'Good technical capability', timestamp: '2026-05-05T10:00:00Z', isFinalized: true },
      { id: 'score-6b', responseId: 'resp-002', evaluatorId: 'user-1', evaluatorName: 'John Smith', criteriaId: 'crit-006', score: 8, maxScore: 10, comment: 'Clear and well-organized proposal', timestamp: '2026-05-05T10:05:00Z', isFinalized: true },
      { id: 'score-7', responseId: 'resp-002', evaluatorId: 'user-1', evaluatorName: 'John Smith', criteriaId: 'crit-004', score: 9, maxScore: 10, comment: 'Fast delivery timeline', timestamp: '2026-05-05T10:10:00Z', isFinalized: true },
      { id: 'score-8', responseId: 'resp-002', evaluatorId: 'user-1', evaluatorName: 'John Smith', criteriaId: 'crit-003', score: 8, maxScore: 10, comment: 'Good sustainability focus', timestamp: '2026-05-05T10:15:00Z', isFinalized: true },
      { id: 'score-9', responseId: 'resp-002', evaluatorId: 'user-1', evaluatorName: 'John Smith', criteriaId: 'crit-005', score: 7, maxScore: 10, comment: 'Solid references', timestamp: '2026-05-05T10:20:00Z', isFinalized: true },
      { id: 'score-10', responseId: 'resp-002', evaluatorId: 'user-1', evaluatorName: 'John Smith', criteriaId: 'crit-002', score: 6, maxScore: 10, comment: 'Higher price point', timestamp: '2026-05-05T10:25:00Z', isFinalized: true },
    ],
    totalWeightedScore: 78,
    maxPossibleScore: 100,
    percentageScore: 78,
    status: 'finalized',
    evaluators: [
      { evaluatorId: 'user-1', evaluatorName: 'John Smith', assignedAt: '2026-05-04T09:00:00Z', status: 'submitted', submittedAt: '2026-05-05T11:00:00Z' },
    ],
    consensusScore: 78,
    startedAt: '2026-05-05T10:00:00Z',
    completedAt: '2026-05-05T11:00:00Z',
    lastUpdatedAt: '2026-05-05T11:00:00Z',
  },
];

// =====================================================
// MOCK RANKINGS
// =====================================================

export const mockRankings: SupplierRanking[] = [
  {
    responseId: 'resp-001',
    supplierId: 'sup-001',
    supplierName: 'EcoSolutions Ltd',
    rank: 1,
    totalScore: 82,
    percentageScore: 82,
    priceTotal: 140000,
    interviewsCompleted: 1,
    interviewRating: 4,
    recommendation: 'highly_recommended',
    notes: 'Strong overall proposal with excellent sustainability credentials',
  },
  {
    responseId: 'resp-002',
    supplierId: 'sup-002',
    supplierName: 'GreenTech Industries',
    rank: 2,
    totalScore: 78,
    percentageScore: 78,
    priceTotal: 160000,
    interviewsCompleted: 1,
    interviewRating: 3,
    recommendation: 'recommended',
    notes: 'Good technical team, higher price needs consideration',
  },
  {
    responseId: 'resp-003',
    supplierId: 'sup-003',
    supplierName: 'Sustainable Partners Co',
    rank: 3,
    totalScore: 71,
    percentageScore: 71,
    priceTotal: 130000,
    interviewsCompleted: 0,
    recommendation: 'neutral',
    notes: 'Lowest price but longer timeline',
  },
];

// =====================================================
// MOCK LIFECYCLE STATS
// =====================================================

export const mockLifecycleStats: RFPLifecycleStats = {
  rfpId: '1',
  totalResponses: 5,
  shortlistedCount: 2,
  interviewsScheduled: 3,
  interviewsCompleted: 2,
  evaluationsComplete: 3,
  currentPhase: 'evaluation',
  phaseHistory: [
    { phase: 'draft', enteredAt: '2026-04-01T09:00:00Z', exitedAt: '2026-04-15T10:00:00Z', enteredBy: 'user-1' },
    { phase: 'published', enteredAt: '2026-04-15T10:00:00Z', exitedAt: '2026-04-16T09:00:00Z', enteredBy: 'user-1' },
    { phase: 'accepting_responses', enteredAt: '2026-04-16T09:00:00Z', exitedAt: '2026-05-05T00:00:00Z', enteredBy: 'system' },
    { phase: 'response_review', enteredAt: '2026-05-05T00:00:00Z', exitedAt: '2026-05-06T09:00:00Z', enteredBy: 'system' },
    { phase: 'interviews_in_progress', enteredAt: '2026-05-06T09:00:00Z', exitedAt: '2026-05-14T10:00:00Z', enteredBy: 'user-1' },
    { phase: 'evaluation', enteredAt: '2026-05-14T10:00:00Z', enteredBy: 'user-1' },
  ],
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

export function getResponsesByRfpId(rfpId: string): RFPResponse[] {
  return mockResponses.filter(r => r.rfpId === rfpId);
}

export function getInterviewsByRfpId(rfpId: string): RFPInterview[] {
  return mockInterviews.filter(i => i.rfpId === rfpId);
}

export function getInterviewsByResponseId(responseId: string): RFPInterview[] {
  return mockInterviews.filter(i => i.responseId === responseId);
}

export function getEvaluationByResponseId(responseId: string): ProposalEvaluation | undefined {
  return mockEvaluations.find(e => e.responseId === responseId);
}

export function getRankingsByRfpId(rfpId: string): SupplierRanking[] {
  return mockRankings;
}

export function getLifecycleStatsByRfpId(rfpId: string): RFPLifecycleStats {
  return mockLifecycleStats;
}
