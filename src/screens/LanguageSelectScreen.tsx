import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useState } from 'react'
import { Hint, PrimaryButton, Screen, SecondaryButton, Title } from '../components/ui'
import type { RootStackParamList } from '../navigation/types'

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function LanguageSelectScreen() {
  const navigation = useNavigation<Nav>()
  const [selected, setSelected] = useState<'en' | 'ur'>('en')

  return (
    <Screen>
      <Title>Language Selection</Title>
      <Hint>Choose your app language and continue.</Hint>
      <SecondaryButton label={`English ${selected === 'en' ? '✓' : ''}`} onPress={() => setSelected('en')} />
      <SecondaryButton label={`Urdu ${selected === 'ur' ? '✓' : ''}`} onPress={() => setSelected('ur')} />
      <PrimaryButton label="Continue" onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Splash' }] })} />
    </Screen>
  )
}
