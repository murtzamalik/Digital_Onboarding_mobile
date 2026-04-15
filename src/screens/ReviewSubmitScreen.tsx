import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useState } from 'react'
import { getJourneyStatus, submitReview } from '../api/mobileBackend'
import { AppInput, ErrorText, LinkButton, PrimaryButton, Screen, Title } from '../components/ui'
import { getResumeRouteForStatus } from '../navigation/getResumeRouteForStatus'
import type { RootStackParamList } from '../navigation/types'
import { toUserMessage } from '../utils/error'

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function ReviewSubmitScreen() {
  const navigation = useNavigation<Nav>()
  const [productCode, setProductCode] = useState('SAVINGS')
  const [currency, setCurrency] = useState('PKR')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit() {
    setError(null)
    setBusy(true)
    try {
      const status = await submitReview(productCode.trim(), currency.trim())
      navigation.reset({ index: 0, routes: [{ name: getResumeRouteForStatus(status.status) }] })
    } catch (e) {
      setError(toUserMessage(e, 'Could not submit review'))
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
      <Title>Review & Submit</Title>
      <AppInput value={productCode} onChangeText={setProductCode} placeholder="Product code" />
      <AppInput value={currency} onChangeText={setCurrency} placeholder="Currency" />
      {error ? <ErrorText>{error}</ErrorText> : null}
      <PrimaryButton
        label={busy ? 'Submitting…' : 'Submit for AML/T24'}
        onPress={onSubmit}
        disabled={busy || !productCode.trim() || !currency.trim()}
      />
      <LinkButton label="Refresh journey status" onPress={refreshFromServer} disabled={busy} />
    </Screen>
  )
}
