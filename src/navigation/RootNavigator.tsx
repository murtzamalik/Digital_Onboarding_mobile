import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import LanguageSelectScreen from '../screens/LanguageSelectScreen';
import OtpScreen from '../screens/OtpScreen';
import CnicFrontScreen from '../screens/CnicFrontScreen';
import CnicBackScreen from '../screens/CnicBackScreen';
import LivenessScreen from '../screens/LivenessScreen';
import FaceMatchScreen from '../screens/FaceMatchScreen';
import FingerprintScreen from '../screens/FingerprintScreen';
import QuizScreen from '../screens/QuizScreen';
import FormScreen from '../screens/FormScreen';
import ReviewSubmitScreen from '../screens/ReviewSubmitScreen';
import ProcessingScreen from '../screens/ProcessingScreen';
import SuccessScreen from '../screens/SuccessScreen';
import BlockedScreen from '../screens/BlockedScreen';
import ExpiredScreen from '../screens/ExpiredScreen';
import SessionExpiredScreen from '../screens/SessionExpiredScreen';
import ForceUpdateScreen from '../screens/ForceUpdateScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Stack lists all supported routes. Splash chooses the initial route from backend status.
 * Individual screens refresh status and self-correct route transitions where backend
 * capabilities for a step are still evolving.
 */
export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerTitleAlign: 'center' }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="LanguageSelect" component={LanguageSelectScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="CnicFront" component={CnicFrontScreen} />
      <Stack.Screen name="CnicBack" component={CnicBackScreen} />
      <Stack.Screen name="Liveness" component={LivenessScreen} />
      <Stack.Screen name="FaceMatch" component={FaceMatchScreen} />
      <Stack.Screen name="Fingerprint" component={FingerprintScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="Form" component={FormScreen} />
      <Stack.Screen name="ReviewSubmit" component={ReviewSubmitScreen} />
      <Stack.Screen name="Processing" component={ProcessingScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} />
      <Stack.Screen name="Blocked" component={BlockedScreen} />
      <Stack.Screen name="Expired" component={ExpiredScreen} />
      <Stack.Screen name="SessionExpired" component={SessionExpiredScreen} />
      <Stack.Screen name="ForceUpdate" component={ForceUpdateScreen} />
    </Stack.Navigator>
  );
}
