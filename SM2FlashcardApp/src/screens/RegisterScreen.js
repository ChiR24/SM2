import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { spacing, borderRadius, shadows } from '../styles/spacing';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, loading, error, isAuthenticated, isOfflineMode } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace('Main');
    }
  }, [isAuthenticated, navigation]);

  const handleRegister = async () => {
    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register({ username, email, password });

      if (!result.success) {
        Alert.alert('Registration Failed', result.error || 'Could not create account');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error('Registration error:', err);
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
            <Text style={styles.logoText}>SM2</Text>
            <Text style={styles.title}>Flashcards</Text>
          </View>

          {/* Register Card */}
          <Card style={styles.cardContainer} elevation="medium">
            <Text style={styles.subtitle}>Create Account</Text>
            <Text style={styles.description}>Join to start your learning journey</Text>

            {isOfflineMode && (
              <View style={styles.offlineBanner}>
                <Text style={styles.offlineBannerText}>
                  You are in offline mode. Registration will create a local account only.
                </Text>
              </View>
            )}

            <ConnectionStatus />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <FormWrapper onSubmit={handleRegister}>
              <Input
                label="Username"
                value={username}
                onChangeText={setUsername}
                placeholder="Choose a username"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.inputContainer}
              />

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
                placeholder="Create a password"
                secureTextEntry
                style={styles.inputContainer}
              />

              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry
                style={styles.inputContainer}
              />

              <Button
                title="Register"
                onPress={handleRegister}
                disabled={isSubmitting || loading}
                loading={isSubmitting || loading}
                variant="primary"
                size="large"
                fullWidth
                style={styles.registerButton}
              />
            </FormWrapper>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <Button
                title="Login"
                onPress={() => navigation.navigate('Login')}
                variant="text"
                style={styles.loginButton}
                textStyle={styles.loginButtonText}
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
    paddingTop: height * 0.08,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoText: {
    ...typography.h1,
    color: colors.textLight,
    fontWeight: 'bold',
    fontSize: 48,
  },
  title: {
    ...typography.h2,
    color: colors.textLight,
    marginTop: -spacing.xs,
  },
  cardContainer: {
    padding: spacing.lg,
    marginTop: spacing.md,
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
  registerButton: {
    marginTop: spacing.md,
  },
  errorText: {
    ...typography.body2,
    color: colors.danger,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  loginText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  loginButton: {
    marginLeft: 0,
    paddingVertical: 0,
    paddingHorizontal: spacing.xs,
  },
  loginButtonText: {
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

export default RegisterScreen;
