import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { Text } from 'react-native'
import { getJourneyStatus, submitCnicBack } from '../api/mobileBackend'
import { ErrorText, Hint, LinkButton, PrimaryButton, Screen, SecondaryButton, Title } from '../components/ui'
import { getResumeRouteForStatus } from '../navigation/getResumeRouteForStatus'
import type { RootStackParamList } from '../navigation/types'
import { toUserMessage } from '../utils/error'
import { readImageUriAsBase64 } from '../utils/imageBase64'

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function CnicBackScreen() {
  const navigation = useNavigation<Nav>()
  const [captureUri, setCaptureUri] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function captureFromCamera() {
    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (!permission.granted) {
      setError('Camera permission is required to capture CNIC images')
      return
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.75,
    })
    if (!result.canceled && result.assets.length > 0) {
      setCaptureUri(result.assets[0].uri)
      setError(null)
    }
  }

  async function onSubmit() {
    if (!captureUri) {
      setError('Capture the back of your CNIC first')
      return
    }
    setError(null)
    setBusy(true)
    try {
      const base64Image = await readImageUriAsBase64(captureUri)
      const status = await submitCnicBack(base64Image)
      navigation.reset({ index: 0, routes: [{ name: getResumeRouteForStatus(status.status) }] })
    } catch (e) {
      setError(toUserMessage(e, 'Could not submit back capture'))
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
      <Title>CNIC Back Capture</Title>
      <Hint>Image is sent for OCR, then NADRA verification runs on the server.</Hint>
      {captureUri ? <Text style={{ color: '#374151', marginBottom: 8 }}>Image ready to submit.</Text> : null}
      <SecondaryButton label="Capture from camera" onPress={captureFromCamera} disabled={busy} />
      {error ? <ErrorText>{error}</ErrorText> : null}
      <PrimaryButton
        label={busy ? 'Submitting…' : 'Submit back (OCR + NADRA)'}
        onPress={onSubmit}
        disabled={busy || !captureUri}
      />
      <LinkButton label="Refresh journey status" onPress={refreshFromServer} disabled={busy} />
    </Screen>
  )
}
