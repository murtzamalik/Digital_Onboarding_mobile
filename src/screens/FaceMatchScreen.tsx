import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { Text } from 'react-native'
import { getJourneyStatus, submitFaceMatch } from '../api/mobileBackend'
import { ErrorText, Hint, LinkButton, PrimaryButton, Screen, SecondaryButton, Title } from '../components/ui'
import { getResumeRouteForStatus } from '../navigation/getResumeRouteForStatus'
import type { RootStackParamList } from '../navigation/types'
import { toUserMessage } from '../utils/error'
import { readImageUriAsBase64 } from '../utils/imageBase64'

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function FaceMatchScreen() {
  const navigation = useNavigation<Nav>()
  const [selfieUri, setSelfieUri] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function captureSelfie() {
    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (!permission.granted) {
      setError('Camera permission is required for face matching')
      return
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    })
    if (!result.canceled && result.assets.length > 0) {
      setSelfieUri(result.assets[0].uri)
      setError(null)
    }
  }

  async function onSubmit() {
    if (!selfieUri) {
      setError('Take a selfie first')
      return
    }
    setError(null)
    setBusy(true)
    try {
      const selfieBase64 = await readImageUriAsBase64(selfieUri)
      const status = await submitFaceMatch(selfieBase64)
      navigation.reset({ index: 0, routes: [{ name: getResumeRouteForStatus(status.status) }] })
    } catch (e) {
      setError(toUserMessage(e, 'Face verification failed'))
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
      <Title>Face match</Title>
      <Hint>
        Your selfie is compared with the CNIC front photo on the server using the BBS face-match API.
      </Hint>
      {selfieUri ? <Text style={{ color: '#374151', marginBottom: 8 }}>Selfie ready to verify.</Text> : null}
      <SecondaryButton label="Capture selfie" onPress={captureSelfie} disabled={busy} />
      <PrimaryButton
        label={busy ? 'Verifying…' : 'Submit for face verification'}
        onPress={onSubmit}
        disabled={busy || !selfieUri}
      />
      <LinkButton label="Refresh journey status" onPress={refreshFromServer} disabled={busy} />
      {error ? <ErrorText>{error}</ErrorText> : null}
    </Screen>
  )
}
