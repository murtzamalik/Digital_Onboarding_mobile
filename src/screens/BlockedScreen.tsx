import { JourneyStatusScreen } from '../components/JourneyStatusScreen'

export default function BlockedScreen() {
  return (
    <JourneyStatusScreen
      title="Journey Blocked"
      expectedRoute="Blocked"
      description="Your onboarding is currently blocked by risk/compliance rules. Refresh checks whether backend status has changed."
    />
  )
}
