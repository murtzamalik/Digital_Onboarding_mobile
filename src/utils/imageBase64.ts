import { EncodingType, readAsStringAsync } from 'expo-file-system/legacy'

export async function readImageUriAsBase64(uri: string): Promise<string> {
  return readAsStringAsync(uri, { encoding: EncodingType.Base64 })
}
