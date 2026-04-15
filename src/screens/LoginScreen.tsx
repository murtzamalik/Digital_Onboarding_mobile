import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { mobileLogin } from '../api/mobileBackend'
import { AppInput, ErrorText, Hint, PrimaryButton, Screen, Title } from '../components/ui'
import type { RootStackParamList } from '../navigation/types'
import { toUserMessage } from '../utils/error'

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function LoginScreen() {
  const navigation = useNavigation<Nav>()
  const [employeeRef, setEmployeeRef] = useState('E2E-EMP-001')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit() {
    setError(null)
    setBusy(true)
    try {
      await mobileLogin(employeeRef.trim())
      navigation.reset({ index: 0, routes: [{ name: 'Splash' }] })
    } catch (e) {
      setError(
        toUserMessage(
          e,
          'Login failed. Set EXPO_PUBLIC_CEBOS_MOBILE_DEV_SECRET and backend CEBOS_MOBILE_DEV_SECRET.',
        ),
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <Screen>
      <Title>Employee sign in</Title>
      <Hint>
        Dev only: requires matching mobile dev secret on the server and in{' '}
        EXPO_PUBLIC_CEBOS_MOBILE_DEV_SECRET.
      </Hint>
      <AppInput
        value={employeeRef}
        onChangeText={setEmployeeRef}
        autoCapitalize="none"
        placeholder="Employee ref"
      />
      {error ? <ErrorText>{error}</ErrorText> : null}
      <PrimaryButton label={busy ? 'Signing in…' : 'Continue'} onPress={onSubmit} disabled={busy} />
    </Screen>
  )
}
