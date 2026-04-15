import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { getJourneyStatus, submitFaceMatch } from '../api/mobileBackend'
import { AppInput, ErrorText, LinkButton, PrimaryButton, Screen, SecondaryButton, Title } from '../components/ui'
import { getResumeRouteForStatus } from '../navigation/getResumeRouteForStatus'
import type { RootStackParamList } from '../navigation/types'
import { toUserMessage } from '../utils/error'

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function FaceMatchScreen() {
  const navigation = useNavigation<Nav>()
  const [selfiePath, setSelfiePath] = useState('mobile://selfie/live.jpg')
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
      quality: 0.7,
    })
    if (!result.canceled && result.assets.length > 0) {
      setSelfiePath(result.assets[0].uri)
      setError(null)
    }
  }

  async function onSubmit(result: 'MATCHED' | 'FAILED') {
    setError(null)
    setBusy(true)
    try {
      const status = await submitFaceMatch(selfiePath.trim(), result === 'MATCHED' ? 0.89 : 0.2, result)
      navigation.reset({ index: 0, routes: [{ name: getResumeRouteForStatus(status.status) }] })
    } catch (e) {
      setError(toUserMessage(e, 'Could not submit face match'))
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
      <Title>Face Match</Title>
      <AppInput value={selfiePath} onChangeText={setSelfiePath} />
      <SecondaryButton label="Capture selfie" onPress={captureSelfie} disabled={busy} />
      <PrimaryButton label="Mark Face Matched" onPress={() => onSubmit('MATCHED')} disabled={busy || !selfiePath.trim()} />
      <PrimaryButton label="Mark Face Failed" onPress={() => onSubmit('FAILED')} disabled={busy || !selfiePath.trim()} />
      <LinkButton label="Refresh journey status" onPress={refreshFromServer} disabled={busy} />
      {error ? <ErrorText>{error}</ErrorText> : null}
    </Screen>
  )
}
