export type InvoiceSubmissionStatus =
  | 'PENDING'
  | 'SUBMITTING'
  | 'SUBMITTED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'FAILED'

export type SubmissionEventType =
  | 'CREATED'
  | 'SUBMITTING'
  | 'REQUEST_SENT'
  | 'RESPONSE_RECEIVED'
  | 'SUBMITTED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'FAILED'

export interface InvoiceSubmission {
  submissionId: string
  invoiceId: string
  attemptNumber: number
  status: InvoiceSubmissionStatus | string
  externalSubmissionId: string | null
  errorCode: string | null
  errorMessage: string | null
  submittedAt: string | null
  completedAt: string | null
}

export interface SubmissionEvent {
  id: string
  eventType: SubmissionEventType | string
  message: string | null
  externalStatus: string | null
  payload: string | null
  occurredAt: string
}
