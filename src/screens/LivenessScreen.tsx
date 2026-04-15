import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { StyleSheet, Text } from 'react-native'
import { getJourneyStatus, submitLiveness } from '../api/mobileBackend'
import { ErrorText, Hint, LinkButton, PrimaryButton, Screen, SecondaryButton, Title } from '../components/ui'
import { getResumeRouteForStatus } from '../navigation/getResumeRouteForStatus'
import type { RootStackParamList } from '../navigation/types'
import { toUserMessage } from '../utils/error'

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function LivenessScreen() {
  const navigation = useNavigation<Nav>()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [captureUri, setCaptureUri] = useState<string | null>(null)

  async function onSubmit(result: 'PASSED' | 'FAILED') {
    setError(null)
    setBusy(true)
    try {
      const status = await submitLiveness('LIV-SESSION-1', 'MOBILE', result === 'PASSED' ? 0.92 : 0.2, result)
      navigation.reset({ index: 0, routes: [{ name: getResumeRouteForStatus(status.status) }] })
    } catch (e) {
      setError(toUserMessage(e, 'Could not submit liveness'))
    } finally {
      setBusy(false)
    }
  }

  async function captureLiveness() {
    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (!permission.granted) {
      setError('Camera permission is required for liveness capture')
      return
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    })
    if (!result.canceled && result.assets.length > 0) {
      setCaptureUri(result.assets[0].uri)
      setError(null)
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
      <Title>Liveness Verification</Title>
      <Hint>Capture selfie video/photo metadata and submit liveness result.</Hint>
      <SecondaryButton label="Capture liveness sample" onPress={captureLiveness} disabled={busy} />
      {captureUri ? <Text style={styles.capture}>Captured: {captureUri}</Text> : null}
      <PrimaryButton label="Mark Liveness Passed" onPress={() => onSubmit('PASSED')} disabled={busy || !captureUri} />
      <PrimaryButton label="Mark Liveness Failed" onPress={() => onSubmit('FAILED')} disabled={busy || !captureUri} />
      <LinkButton label="Refresh journey status" onPress={refreshFromServer} disabled={busy} />
      {error ? <ErrorText>{error}</ErrorText> : null}
    </Screen>
  )
}

const styles = StyleSheet.create({
  capture: { color: '#111827', fontSize: 12 },
})
