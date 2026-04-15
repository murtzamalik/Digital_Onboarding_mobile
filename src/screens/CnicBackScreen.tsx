import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { getJourneyStatus, submitCnicBack } from '../api/mobileBackend'
import { AppInput, ErrorText, Hint, LinkButton, PrimaryButton, Screen, SecondaryButton, Title } from '../components/ui'
import { getResumeRouteForStatus } from '../navigation/getResumeRouteForStatus'
import type { RootStackParamList } from '../navigation/types'
import { toUserMessage } from '../utils/error'

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function CnicBackScreen() {
  const navigation = useNavigation<Nav>()
  const [imagePath, setImagePath] = useState('mobile://cnic/back.jpg')
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
      quality: 0.7,
    })
    if (!result.canceled && result.assets.length > 0) {
      setImagePath(result.assets[0].uri)
    }
  }

  async function onSubmit() {
    setError(null)
    setBusy(true)
    try {
      const status = await submitCnicBack(imagePath.trim())
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
      <Hint>Submits capture and runs NADRA verification.</Hint>
      <AppInput value={imagePath} onChangeText={setImagePath} />
      <SecondaryButton label="Capture from camera" onPress={captureFromCamera} disabled={busy} />
      {error ? <ErrorText>{error}</ErrorText> : null}
      <PrimaryButton
        label={busy ? 'Submitting…' : 'Submit back capture'}
        onPress={onSubmit}
        disabled={busy || !imagePath.trim()}
      />
      <LinkButton label="Refresh journey status" onPress={refreshFromServer} disabled={busy} />
    </Screen>
  )
}
