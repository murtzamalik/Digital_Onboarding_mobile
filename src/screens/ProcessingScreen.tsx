import { JourneyStatusScreen } from '../components/JourneyStatusScreen'

export default function ProcessingScreen() {
  return (
    <JourneyStatusScreen
      title="Processing"
      expectedRoute="Processing"
      description="Backend processing is in progress (validation, AML, or core banking). Refresh checks current status and auto-routes when a concrete step becomes available."
    />
  )
}
