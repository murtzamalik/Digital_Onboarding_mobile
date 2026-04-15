import { JourneyStatusScreen } from '../components/JourneyStatusScreen'

export default function ExpiredScreen() {
  return (
    <JourneyStatusScreen
      title="Journey Expired"
      expectedRoute="Expired"
      description="The onboarding invite/session has expired. Refresh verifies whether a new invitation has been issued."
    />
  )
}
