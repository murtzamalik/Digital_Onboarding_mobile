import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import * as LocalAuthentication from 'expo-local-authentication'
import { useState } from 'react'
import { getJourneyStatus, submitFingerprint } from '../api/mobileBackend'
import { AppInput, ErrorText, LinkButton, PrimaryButton, Screen, SecondaryButton, Title } from '../components/ui'
import { getResumeRouteForStatus } from '../navigation/getResumeRouteForStatus'
import type { RootStackParamList } from '../navigation/types'
import { toUserMessage } from '../utils/error'

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function FingerprintScreen() {
  const navigation = useNavigation<Nav>()
  const [templateRef, setTemplateRef] = useState('FP-TEMPLATE-1')
  const [capturePath, setCapturePath] = useState('mobile://finger/capture.dat')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function captureFingerprint() {
    const hasHardware = await LocalAuthentication.hasHardwareAsync()
    const isEnrolled = await LocalAuthentication.isEnrolledAsync()
    if (!hasHardware || !isEnrolled) {
      setError('Biometric hardware or enrollment is unavailable on this device')
      return
    }
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Capture fingerprint for onboarding',
      disableDeviceFallback: false,
    })
    if (result.success) {
      const nonce = Date.now()
      setTemplateRef(`FP-TEMPLATE-${nonce}`)
      setCapturePath(`mobile://finger/${nonce}.dat`)
      setError(null)
    } else {
      setError('Fingerprint authentication failed')
    }
  }

  async function onSubmit(result: 'MATCHED' | 'FAILED') {
    setError(null)
    setBusy(true)
    try {
      const status = await submitFingerprint(templateRef.trim(), capturePath.trim(), result === 'MATCHED' ? 0.95 : 0.2, result)
      navigation.reset({ index: 0, routes: [{ name: getResumeRouteForStatus(status.status) }] })
    } catch (e) {
      setError(toUserMessage(e, 'Could not submit fingerprint'))
    } finally {
      setBusy(false)
    }
  }

  async function refreshFromServer() {
    setError(null)
    setBusy(true)
    try {
      const status = await getJourneyStatus()
      navigation.reset({ index: 0, routes: [{ name: getResumeRouteForStatus(status.status) }] })
    } catch (e) {
      setError(toUserMessage(e, 'Could not refresh journey status'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Screen>
      <Title>Fingerprint Verification</Title>
      <AppInput value={templateRef} onChangeText={setTemplateRef} placeholder="Template ref" />
      <AppInput value={capturePath} onChangeText={setCapturePath} placeholder="Capture path" />
      <SecondaryButton label="Capture with biometrics" onPress={captureFingerprint} disabled={busy} />
      <PrimaryButton
        label="Mark Fingerprint Matched"
        onPress={() => onSubmit('MATCHED')}
        disabled={busy || !templateRef.trim() || !capturePath.trim()}
      />
      <PrimaryButton
        label="Mark Fingerprint Failed"
        onPress={() => onSubmit('FAILED')}
        disabled={busy || !templateRef.trim() || !capturePath.trim()}
      />
      <LinkButton label="Refresh journey status" onPress={refreshFromServer} disabled={busy} />
      {error ? <ErrorText>{error}</ErrorText> : null}
    </Screen>
  )
}
