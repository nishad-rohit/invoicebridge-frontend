export type ValidationRunStatus = 'PASSED' | 'FAILED'
export type ValidationSeverity = 'ERROR' | 'WARNING'

export interface ValidationIssue {
  severity: ValidationSeverity | string
  code: string
  fieldName: string | null
  message: string
}

export interface InvoiceValidation {
  validationRunId: string
  invoiceId: string
  status: ValidationRunStatus | string
  valid: boolean
  errorCount: number
  warningCount: number
  issues: ValidationIssue[]
}

export interface ReadinessIssue {
  code: string
  message: string
}

export interface InvoiceReadiness {
  invoiceId: string
  ready: boolean
  score: number
  issues: ReadinessIssue[]
}
