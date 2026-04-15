import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { clearTokens } from '../auth/storage'
import { Hint, PrimaryButton, Screen, Title } from '../components/ui'
import type { RootStackParamList } from '../navigation/types'

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function SuccessScreen() {
  const navigation = useNavigation<Nav>()

  async function signOut() {
    await clearTokens()
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
  }

  return (
    <Screen>
      <Title>Success</Title>
      <Hint>
        Journey step completed (e.g. OTP verified or account opened). Further steps require M2
        mobile APIs.
      </Hint>
      <PrimaryButton label="Sign out (clear tokens)" onPress={signOut} />
    </Screen>
  )
}
