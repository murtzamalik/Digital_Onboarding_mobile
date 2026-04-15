export function toUserMessage(error: unknown, fallback: string): string {
  const raw = error instanceof Error ? error.message : fallback
  const normalized = raw.toUpperCase()

  if (normalized.includes('401')) {
    return 'Your session expired. Please sign in again.'
  }
  if (normalized.includes('403')) {
    return 'You are not authorized for this action.'
  }
  if (normalized.includes('409')) {
    return 'This action is no longer valid for your current onboarding status. Refresh and continue from the suggested step.'
  }
  if (normalized.includes('400')) {
    return 'Some input is invalid. Please check and try again.'
  }
  if (normalized.includes('NETWORK') || normalized.includes('FETCH')) {
    return 'Network issue. Check connectivity and retry.'
  }
  return raw || fallback
}
