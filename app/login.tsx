import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Screen, Text, Card, Input, Button } from '@/components/ui';
import { spacing } from '@/theme/tokens';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Completa este campo.');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      // Navigation will be handled automatically by auth state change
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo ingresar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll={false}>
      <View style={styles.container}>
        <Text variant="h1" style={styles.header}>
          Ingresar
        </Text>

        <Card style={styles.card}>
          <Text variant="h2" style={styles.cardTitle}>
            Tu cuenta
          </Text>

          <Input
            label=""
            placeholder="Correo"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            style={styles.input}
          />

          <Input
            label=""
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            style={styles.input}
          />

          <Button onPress={handleLogin} loading={loading} style={styles.button}>
            Continuar
          </Button>
        </Card>

        <Text variant="caption" color="textSecondary" style={styles.footer}>
          Tus datos se usan para darte recomendaciones. Tú decides qué registrar.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.gap * 2,
  },
  card: {
    marginBottom: spacing.gap * 2,
  },
  cardTitle: {
    marginBottom: spacing.gap * 2,
  },
  input: {
    marginBottom: spacing.gap,
  },
  button: {
    marginTop: spacing.gap,
  },
  footer: {
    textAlign: 'center',
  },
});
