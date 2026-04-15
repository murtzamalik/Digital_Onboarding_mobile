import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useEffect, useState } from 'react'
import { getFormSchema, getJourneyStatus, submitForm, type FormSchema } from '../api/mobileBackend'
import { AppInput, ErrorText, FieldGroup, Hint, LinkButton, PrimaryButton, Screen, Title } from '../components/ui'
import { getResumeRouteForStatus } from '../navigation/getResumeRouteForStatus'
import type { RootStackParamList } from '../navigation/types'
import { toUserMessage } from '../utils/error'

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function FormScreen() {
  const navigation = useNavigation<Nav>()
  const [schema, setSchema] = useState<FormSchema | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const s = await getFormSchema()
        if (!cancelled) setSchema(s)
      } catch (e) {
        if (!cancelled) setError(toUserMessage(e, 'Could not load form schema'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  async function onSubmit() {
    if (!schema) return
    const missingRequired = schema.fields.some(
      (f) => f.required && !(values[f.key] ?? '').trim(),
    )
    if (missingRequired) {
      setError('Please fill all required fields before submitting.')
      return
    }
    setError(null)
    setBusy(true)
    try {
      const payload: Record<string, unknown> = {}
      for (const f of schema.fields) {
        payload[f.key] = values[f.key] ?? ''
      }
      const status = await submitForm(payload)
      navigation.reset({ index: 0, routes: [{ name: getResumeRouteForStatus(status.status) }] })
    } catch (e) {
      setError(toUserMessage(e, 'Could not submit form'))
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
      <Title>Application Form</Title>
      {loading ? <Hint>Loading form…</Hint> : null}
      {schema?.fields.map((field) => (
        <FieldGroup key={field.key} label={field.label}>
          <AppInput
            value={values[field.key] ?? ''}
            onChangeText={(v) => setValues((prev) => ({ ...prev, [field.key]: v }))}
            placeholder={field.key}
          />
        </FieldGroup>
      ))}
      {error ? <ErrorText>{error}</ErrorText> : null}
      <PrimaryButton label={busy ? 'Submitting…' : 'Submit form'} onPress={onSubmit} disabled={busy || !schema} />
      <LinkButton label="Refresh journey status" onPress={refreshFromServer} disabled={busy} />
    </Screen>
  )
}
