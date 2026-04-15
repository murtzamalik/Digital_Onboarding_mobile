import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useEffect, useState } from 'react'
import { getJourneyStatus, getQuizTemplate, submitQuiz, type QuizTemplate } from '../api/mobileBackend'
import { AppInput, ErrorText, FieldGroup, Hint, LinkButton, PrimaryButton, Screen, Title } from '../components/ui'
import { getResumeRouteForStatus } from '../navigation/getResumeRouteForStatus'
import type { RootStackParamList } from '../navigation/types'
import { toUserMessage } from '../utils/error'

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function QuizScreen() {
  const navigation = useNavigation<Nav>()
  const [quiz, setQuiz] = useState<QuizTemplate | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const q = await getQuizTemplate()
        if (!cancelled) setQuiz(q)
      } catch (e) {
        if (!cancelled) setError(toUserMessage(e, 'Could not load quiz'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  async function onSubmit() {
    if (!quiz) return
    const missing = quiz.questions.some((q) => !(answers[q.questionId] ?? '').trim())
    if (missing) {
      setError('Please answer all quiz questions before submitting.')
      return
    }
    setError(null)
    setBusy(true)
    try {
      const payload = quiz.questions.map((q) => ({ questionId: q.questionId, answer: answers[q.questionId] ?? '' }))
      const status = await submitQuiz(quiz.templateId, payload)
      navigation.reset({ index: 0, routes: [{ name: getResumeRouteForStatus(status.status) }] })
    } catch (e) {
      setError(toUserMessage(e, 'Could not submit quiz'))
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
      <Title>Knowledge Quiz</Title>
      {loading ? <Hint>Loading quiz…</Hint> : null}
      {quiz?.questions.map((q) => (
        <FieldGroup key={q.questionId} label={q.prompt} helper={`Options: ${q.options.join(' / ')}`}>
          <AppInput
            value={answers[q.questionId] ?? ''}
            onChangeText={(v) => setAnswers((prev) => ({ ...prev, [q.questionId]: v }))}
            placeholder="Enter your answer"
          />
        </FieldGroup>
      ))}
      {error ? <ErrorText>{error}</ErrorText> : null}
      <PrimaryButton label={busy ? 'Submitting…' : 'Submit quiz'} onPress={onSubmit} disabled={busy || !quiz} />
      <LinkButton label="Refresh journey status" onPress={refreshFromServer} disabled={busy} />
    </Screen>
  )
}
