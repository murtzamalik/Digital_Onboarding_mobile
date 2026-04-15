import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RouteProp } from '@react-navigation/native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import { getJourneyStatus, issueOtp, verifyOtp } from '../api/mobileBackend'
import { AppInput, ErrorText, Hint, PrimaryButton, Screen, Title } from '../components/ui'
import { getResumeRouteForStatus } from '../navigation/getResumeRouteForStatus'
import type { RootStackParamList } from '../navigation/types'
import { toUserMessage } from '../utils/error'

type Nav = NativeStackNavigationProp<RootStackParamList>
type R = RouteProp<RootStackParamList, 'Otp'>

const MASKED = '*****4567'

export default function OtpScreen() {
  const navigation = useNavigation<Nav>()
  const route = useRoute<R>()
  const onboardingId = route.params.onboardingId
  const [otp, setOtp] = useState('')
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const goNextFromStatus = useCallback(
    async () => {
      const s = await getJourneyStatus()
      const next = getResumeRouteForStatus(s.status)
      if (next === 'Otp') {
        navigation.replace('Otp', { onboardingId: s.employeeOnboardingId })
      } else {
        navigation.reset({ index: 0, routes: [{ name: next }] })
      }
    },
    [navigation],
  )

  async function onIssue() {
    setError(null)
    setBusy(true)
    try {
      const res = await issueOtp(onboardingId, MASKED)
      if (__DEV__ && res.otp) {
        setDevOtpHint(res.otp)
      }
    } catch (e) {
      setError(toUserMessage(e, 'Could not send OTP'))
    } finally {
      setBusy(false)
    }
  }

  async function onVerify() {
    setError(null)
    setBusy(true)
    try {
      await verifyOtp(onboardingId, otp.trim())
      await goNextFromStatus()
    } catch (e) {
      setError(toUserMessage(e, 'Invalid OTP'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Screen>
      <Title>OTP</Title>
      <Hint>Onboarding #{onboardingId}</Hint>
      <PrimaryButton label="Send OTP" onPress={onIssue} disabled={busy} />
      {devOtpHint ? (
        <Hint>Dev OTP (never in prod): {devOtpHint}</Hint>
      ) : null}
      <AppInput
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        placeholder="Enter OTP"
      />
      <PrimaryButton label={busy ? 'Verifying…' : 'Verify'} onPress={onVerify} disabled={busy || !otp.trim()} />
      {error ? <ErrorText>{error}</ErrorText> : null}
    </Screen>
  )
}
