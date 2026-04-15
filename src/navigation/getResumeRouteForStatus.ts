import type { RootStackParamList } from './types';

/**
 * Maps backend {@link com.bank.cebos.enums.OnboardingStatus} names to stack routes.
 * Unknown → Processing (generic wait / dev continuation).
 */
const STATUS_ROUTE_MAP: Record<string, keyof RootStackParamList> = {
  UPLOADED: 'Processing',
  INVALID: 'Blocked',
  VALIDATED: 'Processing',
  INVITED: 'Otp',
  OTP_PENDING: 'Otp',
  OTP_VERIFIED: 'CnicFront',
  OCR_IN_PROGRESS: 'CnicFront',
  OCR_FAILED: 'Blocked',
  NADRA_PENDING: 'CnicBack',
  NADRA_VERIFIED: 'Liveness',
  NADRA_FAILED: 'Blocked',
  LIVENESS_PENDING: 'Liveness',
  LIVENESS_PASSED: 'FaceMatch',
  LIVENESS_FAILED: 'Blocked',
  FACE_MATCH_PENDING: 'FaceMatch',
  FACE_MATCHED: 'Fingerprint',
  FACE_MATCH_FAILED: 'Blocked',
  FINGERPRINT_PENDING: 'Fingerprint',
  FINGERPRINT_MATCHED: 'Quiz',
  FINGERPRINT_FAILED: 'Blocked',
  QUIZ_PENDING: 'Quiz',
  QUIZ_PASSED: 'Form',
  QUIZ_FAILED: 'Blocked',
  FORM_PENDING: 'Form',
  FORM_SUBMITTED: 'ReviewSubmit',
  AML_CHECK_PENDING: 'Processing',
  AML_REJECTED: 'Blocked',
  T24_PENDING: 'Processing',
  T24_FAILED: 'Blocked',
  ACCOUNT_OPENED: 'Success',
  EXPIRED: 'Expired',
  BLOCKED: 'Blocked',
};

export function getResumeRouteForStatus(
  status: string | null | undefined,
): keyof RootStackParamList {
  const normalized = (status ?? '')
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_');

  return STATUS_ROUTE_MAP[normalized] ?? 'Processing';
}
