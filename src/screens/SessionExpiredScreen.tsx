import { JourneyStatusScreen } from '../components/JourneyStatusScreen'

export default function SessionExpiredScreen() {
  return (
    <JourneyStatusScreen
      title="Session Expired"
      expectedRoute="SessionExpired"
      description="Authentication session expired. Refresh attempts to recover the correct route from backend status, or sign out to login again."
    />
  )
}
