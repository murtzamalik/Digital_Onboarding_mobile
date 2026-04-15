import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { getJourneyStatus, getMobilePolicy } from '../api/mobileBackend'
import { getAccessToken } from '../auth/storage'
import { getResumeRouteForStatus } from '../navigation/getResumeRouteForStatus'
import type { RootStackParamList } from '../navigation/types'

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function SplashScreen() {
  const navigation = useNavigation<Nav>()
  const [message, setMessage] = useState('Starting…')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const token = await getAccessToken()
      if (!token) {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
        return
      }
      try {
        setMessage('Checking app policy…')
        const policy = await getMobilePolicy()
        if (cancelled) return
        if (policy.forceUpdate) {
          navigation.reset({ index: 0, routes: [{ name: 'ForceUpdate' }] })
          return
        }
        setMessage('Loading journey status…')
        const status = await getJourneyStatus()
        if (cancelled) return
        const route = getResumeRouteForStatus(status.status)
        if (route === 'Otp') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Otp', params: { onboardingId: status.employeeOnboardingId } }],
          })
          return
        }
        navigation.reset({ index: 0, routes: [{ name: route }] })
      } catch {
        if (!cancelled) {
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [navigation])

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.text}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    gap: 12,
  },
  text: { color: '#555' },
})
