import AsyncStorage from '@react-native-async-storage/async-storage'

const ACCESS_KEY = 'cebos_mobile_access_token'
const REFRESH_KEY = 'cebos_mobile_refresh_token'

export async function getAccessToken(): Promise<string | null> {
  return AsyncStorage.getItem(ACCESS_KEY)
}

export async function getRefreshToken(): Promise<string | null> {
  return AsyncStorage.getItem(REFRESH_KEY)
}

export async function setTokens(access: string, refresh: string): Promise<void> {
  await AsyncStorage.setItem(ACCESS_KEY, access)
  await AsyncStorage.setItem(REFRESH_KEY, refresh)
}

export async function setAccessToken(access: string): Promise<void> {
  await AsyncStorage.setItem(ACCESS_KEY, access)
}

export async function clearTokens(): Promise<void> {
  await AsyncStorage.removeItem(ACCESS_KEY)
  await AsyncStorage.removeItem(REFRESH_KEY)
}
