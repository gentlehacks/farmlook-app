import Input from '@/components/Input';
import { useLanguageStore } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Alert,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LanguageWelcomeModal from '@/components/LanguageModal';

const API_URL = 'https://farmlook.onrender.com';

const Login = () => {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // New state for language modal
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [checkingFirstTime, setCheckingFirstTime] = useState(true);

  /* ---------------- FIRST TIME CHECK ---------------- */

  useEffect(() => {
    const checkFirstTimeUser = async () => {
      try {
        // Check if user has already selected language (first time check)
        const hasSelectedLanguage = await AsyncStorage.getItem('has_selected_language');

        if (!hasSelectedLanguage) {
          // First time user - show language modal
          setShowLanguageModal(true);
        }
      } catch (error) {
        console.error('Error checking first time:', error);
        // If error, default to showing modal
        setShowLanguageModal(true);
      } finally {
        setCheckingFirstTime(false);
      }
    };

    checkFirstTimeUser();
  }, []);

  /* ---------------- LANGUAGE SELECTION ---------------- */

  const handleLanguageSelect = async (selectedLang: 'english' | 'hausa' | 'yoruba' | 'igbo' | 'nupe') => {
    try {
      // Save to Zustand store (which auto-persists via AsyncStorage)
      setLanguage(selectedLang);

      // Mark that user has selected language (so we don't show modal again)
      await AsyncStorage.setItem('has_selected_language', 'true');

      // Close modal
      setShowLanguageModal(false);
    } catch (error) {
      console.error('Error saving language:', error);
      Alert.alert('Error', 'Failed to save language preference');
    }
  };

  /* ---------------- AUTO-LOGIN CHECK ---------------- */

  useEffect(() => {
    const getToken = async () => {
      const response = await AsyncStorage.getItem("token");
      setToken(response);
    };

    getToken();
  }, []);

  if (token) {
    router.replace("/(tabs)/select");
    return null;
  }

  /* ---------------- VALIDATION HELPERS ---------------- */

  const normalizePhone = (phone: string) => {
    const cleaned = phone.replace(/\s+/g, '');

    if (cleaned.startsWith('+234')) return cleaned;
    if (cleaned.startsWith('0')) return `+234${cleaned.slice(1)}`;
    if (/^\d{10}$/.test(cleaned)) return `+234${cleaned}`;

    return null;
  };

  const validateInputs = () => {
    const phone = normalizePhone(phoneNumber);

    if (!phone) {
      Alert.alert(
        language === 'english' ? 'Error' : 'Kuskure',
        language === 'english' ? 'Enter a valid Nigerian phone number' : 'Shigar da lambar waya ta Najeriya mai inganci'
      );
      return null;
    }

    if (!password || password.length < 6) {
      Alert.alert(
        language === 'english' ? 'Error' : 'Kuskure',
        language === 'english' ? 'Password must be at least 6 characters' : 'Kalmar sirri dole ta zama aƙalla harafi 6'
      );
      return null;
    }

    return phone;
  };

  /* ---------------- LOGIN HANDLER ---------------- */

  const handleLogin = async () => {
    if (loading) return;

    const normalizedPhone = validateInputs();
    if (!normalizedPhone) return;

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: normalizedPhone,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        Alert.alert(
          language === 'english' ? 'Login Failed' : 'Shiga bai yi nasara ba',
          data.error || (language === 'english' ? 'Invalid credentials' : 'Bayanan shiga mara inganci')
        );
        return;
      }

      // Save access token and user's info
      await AsyncStorage.setItem('token', data.session.access_token);
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user.id,
          name: data.user.user_metadata?.name,
          state: data.user.user_metadata?.state,
        })
      );

      Alert.alert(
        language === 'english' ? 'Success' : 'Nasara',
        language === 'english' ? 'Login successful' : 'An shiga cikin nasara'
      );

      // Navigate to main app
      router.replace('/(tabs)/select');
    } catch (err) {
      console.log(err);
      Alert.alert(
        language === 'english' ? 'Network Error' : 'Kuskuren Cibiyar Sadarwa',
        language === 'english' ? 'Unable to connect to server' : 'Ba za a iya haɗawa da uwar garken ba'
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOADING STATE ---------------- */

  if (checkingFirstTime) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-gray-600">Loading...</Text>
      </View>
    );
  }

  /* ---------------- MAIN UI ---------------- */

  return (
    <>
      <LanguageWelcomeModal visible={showLanguageModal} onClose={() => setShowLanguageModal(false)} />

      <ScrollView className="w-full">
        <View className="w-full h-screen items-center justify-center p-6 bg-gray-50">
          <View className="items-center mb-8">
            <View className="w-[80px] h-[80px] bg-green-500/10 rounded-3xl items-center justify-center mb-3">
              <Ionicons name="leaf" size={40} color="#22C55E" />
            </View>

            <Text className="font-bold text-3xl text-gray-800 mb-2">
              FarmLook
            </Text>

            <Text className="font-medium text-lg text-center text-gray-400">
              {language === 'english'
                ? 'Welcome Back, Farmer'
                : 'Barka da Komowa, Manomi'}
            </Text>

            <Text className="font-medium text-lg text-center text-gray-400">
              {language === 'english'
                ? "Let's check your crops today!"
                : 'Bari mu duba amfanin gonarka yau!'}
            </Text>
          </View>

          <KeyboardAvoidingView className="w-full">
            <TouchableOpacity
              onPress={() => router.push('/select')}
              className="flex-row justify-center items-center mb-6"
            >
              <Text className="text-lg text-green-500">
                {language === 'english'
                  ? 'Continue as Guest'
                  : 'Ci gaba a matsayin Baƙo'}
              </Text>
              <Ionicons
                name="arrow-forward"
                size={15}
                color="rgb(0,200,10)"
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity>

            <Input
              label={language === 'english' ? 'Phone Number' : 'Lambar Waya'}
              value={phoneNumber}
              setValue={setPhoneNumber}
              placeholder={language === 'english' ? 'Enter Phone Number' : 'Shiga Da Lambar Waya'}
              icon="phone"
            />

            <Input
              label={language === 'english' ? 'Password' : 'Kalmar Sirri'}
              value={password}
              setValue={setPassword}
              placeholder={language === 'english' ? 'Enter Password' : 'Shiga Da Kalmar Sirri'}
              icon="lock"
              type="password"
            />

            <Text className="text-right self-end text-green-600 font-medium mb-4">
              {language === 'english'
                ? 'Forgot Password?'
                : 'Manta Kalmar Sirri?'}
            </Text>

            <TouchableOpacity
              disabled={loading}
              onPress={handleLogin}
              className={`w-full py-4 rounded-full flex-row justify-center items-center mt-6 ${loading ? 'bg-gray-400' : 'bg-green-600'
                }`}
            >
              <Text className="text-white text-lg font-semibold">
                {loading
                  ? (language === 'english' ? 'Logging in...' : 'Ana shiga...')
                  : language === 'english'
                    ? 'Log in'
                    : 'Shiga ciki'}
              </Text>

              <Ionicons
                name="arrow-forward"
                size={20}
                color="white"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>

            <View className="items-center mt-6">
              <Text className="text-gray-500 text-lg">
                {language === 'english'
                  ? "Don't have an account?"
                  : 'Baka da asusu?'}{' '}
                <Link
                  href="/(auth)/signup"
                  className="text-green-600 font-semibold"
                >
                  {language === 'english' ? 'Sign up' : 'Yi rijista'}
                </Link>
              </Text>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </>
  );
};

export default Login;