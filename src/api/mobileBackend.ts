import { setTokens } from '../auth/storage'
import { apiFetch } from './http'

export type JourneyStatus = {
  employeeOnboardingId: number
  employeeRef: string
  status: string
  corporateClientId: number | null
}

export type TokenResponse = {
  accessToken: string
  refreshToken: string
}

export type QuizQuestion = {
  questionId: string
  prompt: string
  options: string[]
}

export type QuizTemplate = {
  templateId: string
  passingScorePercent: number
  questions: QuizQuestion[]
}

export type FormField = {
  key: string
  label: string
  inputType: string
  required: boolean
}

export type FormSchema = {
  templateId: string
  fields: FormField[]
}

export type MobilePolicy = {
  minSupportedVersion: string
  forceUpdate: boolean
}

export async function mobileLogin(employeeRef: string): Promise<TokenResponse> {
  const body = await apiFetch<TokenResponse>(
    '/auth/login',
    'POST',
    {
      body: { employeeRef },
      auth: false,
      mobileDevSecretHeader: true,
    },
  )
  await setTokens(body.accessToken, body.refreshToken)
  return body
}

export async function getJourneyStatus(): Promise<JourneyStatus> {
  return apiFetch<JourneyStatus>('/status', 'GET', { auth: true })
}

export async function issueOtp(
  employeeOnboardingId: number,
  destinationMasked: string,
): Promise<{ otp?: string | null }> {
  return apiFetch<{ otp?: string | null }>('/auth/otp/issue', 'POST', {
    body: { employeeOnboardingId, destinationMasked },
    auth: true,
  })
}

export async function verifyOtp(
  employeeOnboardingId: number,
  otp: string,
): Promise<{ verified: boolean }> {
  return apiFetch<{ verified: boolean }>('/auth/otp/verify', 'POST', {
    body: { employeeOnboardingId, otp },
    auth: true,
  })
}

export async function getMobilePolicy(): Promise<MobilePolicy> {
  return apiFetch<MobilePolicy>('/policy', 'GET', { auth: false })
}

export async function submitCnicFront(imagePath: string): Promise<JourneyStatus> {
  return apiFetch<JourneyStatus>('/kyc/cnic/front', 'POST', {
    body: { imagePath },
    auth: true,
  })
}

export async function submitCnicBack(imagePath: string): Promise<JourneyStatus> {
  return apiFetch<JourneyStatus>('/kyc/cnic/back', 'POST', {
    body: { imagePath },
    auth: true,
  })
}

export async function submitLiveness(
  sessionId: string,
  vendorRef: string,
  score: number,
  result: string,
): Promise<JourneyStatus> {
  return apiFetch<JourneyStatus>('/kyc/liveness/submit', 'POST', {
    body: { sessionId, vendorRef, score, result },
    auth: true,
  })
}

export async function submitFaceMatch(
  selfieImagePath: string,
  score: number,
  result: string,
): Promise<JourneyStatus> {
  return apiFetch<JourneyStatus>('/kyc/face-match/submit', 'POST', {
    body: { selfieImagePath, score, result },
    auth: true,
  })
}

export async function submitFingerprint(
  templateRef: string,
  capturePath: string,
  qualityScore: number,
  result: string,
): Promise<JourneyStatus> {
  return apiFetch<JourneyStatus>('/kyc/fingerprint/submit', 'POST', {
    body: { templateRef, capturePath, qualityScore, result },
    auth: true,
  })
}

export async function getQuizTemplate(): Promise<QuizTemplate> {
  return apiFetch<QuizTemplate>('/quiz', 'GET', { auth: true })
}

export async function submitQuiz(
  templateId: string,
  answers: Array<{ questionId: string; answer: string }>,
): Promise<JourneyStatus> {
  return apiFetch<JourneyStatus>('/quiz/submit', 'POST', {
    body: { templateId, answers },
    auth: true,
  })
}

export async function getFormSchema(): Promise<FormSchema> {
  return apiFetch<FormSchema>('/form/schema', 'GET', { auth: true })
}

export async function submitForm(data: Record<string, unknown>): Promise<JourneyStatus> {
  return apiFetch<JourneyStatus>('/form/submit', 'POST', {
    body: { data },
    auth: true,
  })
}

export async function submitReview(productCode: string, currency: string): Promise<JourneyStatus> {
  return apiFetch<JourneyStatus>('/review/submit', 'POST', {
    body: { productCode, currency },
    auth: true,
  })
}
