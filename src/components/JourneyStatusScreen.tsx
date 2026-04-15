import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { StyleSheet, Text } from 'react-native'
import { getJourneyStatus } from '../api/mobileBackend'
import { clearTokens } from '../auth/storage'
import { getResumeRouteForStatus } from '../navigation/getResumeRouteForStatus'
import type { RootStackParamList } from '../navigation/types'
import { toUserMessage } from '../utils/error'
import { ErrorText, Hint, LinkButton, PrimaryButton, Screen, Title } from './ui'

type Nav = NativeStackNavigationProp<RootStackParamList>

type Props = {
  title: string
  expectedRoute: keyof RootStackParamList
  description: string
}

export function JourneyStatusScreen({ title, expectedRoute, description }: Props) {
  const navigation = useNavigation<Nav>()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusLabel, setStatusLabel] = useState<string | null>(null)
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null)

  async function onRefresh() {
    setBusy(true)
    setError(null)
    try {
      const status = await getJourneyStatus()
      setStatusLabel(status.status)
      setLastSyncedAt(new Date().toLocaleTimeString())
      const route = getResumeRouteForStatus(status.status)
      if (route !== expectedRoute) {
        if (route === 'Otp') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Otp', params: { onboardingId: status.employeeOnboardingId } }],
          })
          return
        }
        navigation.reset({ index: 0, routes: [{ name: route }] })
      }
    } catch (e) {
      setError(toUserMessage(e, 'Could not load journey status'))
    } finally {
      setBusy(false)
    }
  }

  async function onSignOut() {
    await clearTokens()
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
  }

  return (
    <Screen>
      <Title>{title}</Title>
      <Hint>{description}</Hint>
      {statusLabel ? <Text style={styles.status}>Latest status: {statusLabel}</Text> : null}
      {lastSyncedAt ? <Text style={styles.synced}>Last synced: {lastSyncedAt}</Text> : null}
      {error ? <ErrorText>{error}</ErrorText> : null}
      <PrimaryButton label={busy ? 'Refreshing…' : 'Refresh status'} disabled={busy} onPress={onRefresh} />
      <LinkButton label="Sign out" onPress={onSignOut} />
    </Screen>
  )
}

const styles = StyleSheet.create({
  status: { fontSize: 14, color: '#111827' },
  synced: { fontSize: 12, color: '#6b7280' },
})
