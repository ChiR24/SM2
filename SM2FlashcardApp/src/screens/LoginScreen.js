import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useConnection } from '../context/ConnectionContext';
import ConnectionStatus from '../components/ConnectionStatus';
import FormWrapper from '../components/FormWrapper';

// Import our new UI components
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import AppIcon from '../components/ui/AppIcon';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing, borderRadius, shadows } from '../styles/spacing';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, loading, error, isAuthenticated, isOfflineMode } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace('Main');
    }
  }, [isAuthenticated, navigation]);

  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login({ email, password });

      if (!result.success) {
        Alert.alert('Login Failed', result.error || 'Invalid credentials');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Gradient Background */}
      <View style={styles.gradientBackground} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* App Logo and Title */}
          <View style={styles.logoContainer}>
            <AppIcon size={80} style={styles.appLogo} />
            <Text style={styles.title}>SM2 Flashcards</Text>
          </View>

          {/* Login Card */}
          <Card style={styles.cardContainer} elevation="medium">
            <Text style={styles.subtitle}>Welcome Back</Text>
            <Text style={styles.description}>Login to continue your learning journey</Text>

            {isOfflineMode && (
              <View style={styles.offlineBanner}>
                <Text style={styles.offlineBannerText}>
                  You are in offline mode. Use demo@example.com / password to login.
                </Text>
              </View>
            )}

            <ConnectionStatus />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <FormWrapper onSubmit={handleLogin}>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.inputContainer}
              />

              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                style={styles.inputContainer}
              />

              <Button
                title="Login"
                onPress={handleLogin}
                disabled={isSubmitting || loading}
                loading={isSubmitting || loading}
                variant="primary"
                size="large"
                fullWidth
                style={styles.loginButton}
              />
            </FormWrapper>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account?</Text>
              <Button
                title="Register"
                onPress={() => navigation.navigate('Register')}
                variant="text"
                style={styles.registerButton}
                textStyle={styles.registerButtonText}
              />
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: height * 0.1,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  appLogo: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.textLight,
    marginTop: -spacing.xs,
  },
  cardContainer: {
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  subtitle: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.body1,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  loginButton: {
    marginTop: spacing.md,
  },
  errorText: {
    ...typography.body2,
    color: colors.danger,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  registerText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  registerButton: {
    marginLeft: 0,
    paddingVertical: 0,
    paddingHorizontal: spacing.xs,
  },
  registerButtonText: {
    ...typography.body2,
    color: colors.primary,
    fontWeight: 'bold',
  },
  offlineBanner: {
    backgroundColor: '#d1ecf1',
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#bee5eb',
  },
  offlineBannerText: {
    ...typography.body2,
    color: '#0c5460',
    textAlign: 'center',
  },
});

export default LoginScreen;
