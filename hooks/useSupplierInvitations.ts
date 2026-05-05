import { useState, useCallback } from 'react'
import { Supplier, EngagementRecord } from '@/types/supplier'

export interface InvitationRecord {
  supplierIds: string[]
  rfpId: string
  invitedAt: string
  invitedBy?: string
}

export function useSupplierInvitations() {
  const [invitationHistory, setInvitationHistory] = useState<
    InvitationRecord[]
  >([])

  const recordInvitations = useCallback(
    (
      suppliers: Supplier[],
      rfpId: string,
      onUpdate?: (updatedSuppliers: Supplier[]) => void
    ) => {
      // Record the invitation in history
      const invitation: InvitationRecord = {
        supplierIds: suppliers.map((s) => s.id),
        rfpId,
        invitedAt: new Date().toISOString(),
      }

      setInvitationHistory((prev) => [...prev, invitation])

      // Auto-update supplier engagement records
      const updatedSuppliers = suppliers.map((supplier) => {
        const newRecord: EngagementRecord = {
          id: `eng-${Date.now()}-${Math.random()}`,
          date: new Date().toISOString(),
          type: 'rfp_invitation',
          notes: `Invited to submit proposal for RFP: ${rfpId}`,
          relatedRFP: rfpId,
        }

        return {
          ...supplier,
          engagementHistory: [
            newRecord,
            ...supplier.engagementHistory,
          ],
          lastContacted: new Date().toISOString(),
        }
      })

      // Call the update callback if provided
      if (onUpdate) {
        onUpdate(updatedSuppliers)
      }

      return updatedSuppliers
    },
    []
  )

  const getInvitationsByRFP = useCallback(
    (rfpId: string): string[] => {
      const record = invitationHistory.find((i) => i.rfpId === rfpId)
      return record?.supplierIds || []
    },
    [invitationHistory]
  )

  const getInvitationHistory = useCallback(() => {
    return invitationHistory
  }, [invitationHistory])

  return {
    recordInvitations,
    getInvitationsByRFP,
    getInvitationHistory,
  }
}
