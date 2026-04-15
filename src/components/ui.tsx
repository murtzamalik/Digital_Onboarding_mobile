import type { ComponentProps, ReactNode } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

export function Screen({ children }: { children: ReactNode }) {
  return <View style={styles.screen}>{children}</View>
}

export function Title({ children }: { children: ReactNode }) {
  return <Text style={styles.title}>{children}</Text>
}

export function Hint({ children }: { children: ReactNode }) {
  return <Text style={styles.hint}>{children}</Text>
}

export function ErrorText({ children }: { children: ReactNode }) {
  return <Text style={styles.error}>{children}</Text>
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string
  onPress: () => void
  disabled?: boolean
}) {
  return (
    <Pressable style={[styles.button, disabled ? styles.buttonDisabled : null]} onPress={onPress} disabled={disabled}>
      <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
  )
}

export function SecondaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string
  onPress: () => void
  disabled?: boolean
}) {
  return (
    <Pressable
      style={[styles.buttonSecondary, disabled ? styles.buttonDisabled : null]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonLabelSecondary}>{label}</Text>
    </Pressable>
  )
}

export function LinkButton({
  label,
  onPress,
  disabled,
}: {
  label: string
  onPress: () => void
  disabled?: boolean
}) {
  return (
    <Pressable style={styles.linkButton} onPress={onPress} disabled={disabled}>
      <Text style={styles.linkLabel}>{label}</Text>
    </Pressable>
  )
}

export function AppInput(props: ComponentProps<typeof TextInput>) {
  return <TextInput style={[styles.input, props.style]} {...props} />
}

export function FieldGroup({
  label,
  helper,
  children,
}: {
  label: string
  helper?: string
  children: ReactNode
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {helper ? <Hint>{helper}</Hint> : null}
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
    gap: 12,
  },
  title: { fontSize: 22, fontWeight: '600', color: '#111827' },
  hint: { fontSize: 14, color: '#6b7280' },
  error: { color: '#b91c1c', fontSize: 14 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonLabel: { color: '#fff', fontWeight: '600', fontSize: 15 },
  buttonLabelSecondary: { color: '#111827', fontWeight: '600', fontSize: 15 },
  linkButton: { paddingVertical: 8, alignItems: 'center' },
  linkLabel: { color: '#374151', textDecorationLine: 'underline' },
  fieldGroup: { gap: 6 },
  fieldLabel: { fontSize: 14, fontWeight: '500', color: '#111827' },
})
