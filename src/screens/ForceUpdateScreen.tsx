import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useState } from 'react'
import { getMobilePolicy } from '../api/mobileBackend'
import { ErrorText, Hint, PrimaryButton, Screen, Title } from '../components/ui'
import type { RootStackParamList } from '../navigation/types'
import { toUserMessage } from '../utils/error'

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function ForceUpdateScreen() {
  const navigation = useNavigation<Nav>()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function checkPolicy() {
    setBusy(true)
    try {
      const p = await getMobilePolicy()
      if (p.forceUpdate) {
        setMessage(`Update required. Minimum supported version: ${p.minSupportedVersion}`)
        return
      }
      navigation.reset({ index: 0, routes: [{ name: 'Splash' }] })
    } catch (e) {
      setMessage(toUserMessage(e, 'Could not verify update policy'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Screen>
      <Title>Update Required</Title>
      <Hint>Checks backend version policy before resuming onboarding.</Hint>
      <PrimaryButton label={busy ? 'Checking…' : 'Check policy'} onPress={checkPolicy} disabled={busy} />
      {message ? <ErrorText>{message}</ErrorText> : null}
    </Screen>
  )
}
