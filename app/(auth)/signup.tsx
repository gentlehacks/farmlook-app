import Input from '@/components/Input';
import { NIGERIA_STATES } from "@/constants/nigeriaStates";
import { useLanguageStore } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = 'https://farmlook.onrender.com';

const Signup = () => {
  const [token, setToken] = useState<string | null>(null)
  const language = useLanguageStore((state) => state.language);

  const [fullname, setFullname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [state, setState] = useState("");
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if theres Token Stored An login Automatically
  useEffect(() => {
    const getToken = async () => {
      const response = await AsyncStorage.getItem("token");
      setToken(response)
    }

    getToken();
  })

  if (token) {
    router.push("/select");
    return;
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
    if (!fullname.trim()) {
      Alert.alert('Error', 'Full name is required');
      return false;
    }

    const phone = normalizePhone(phoneNumber);
    if (!phone) {
      Alert.alert(
        'Error',
        'Enter a valid Nigerian phone number'
      );
      return false;
    }

    if (!state) {
      Alert.alert("Validation Error", "Please select your state");
      return;
    }


    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (!agree) {
      Alert.alert('Error', 'You must agree to the terms');
      return false;
    }

    return phone;
  };

  /* ---------------- SIGNUP HANDLER ---------------- */

  const handleSignup = async () => {
    if (loading) return;

    const normalizedPhone = validateInputs();
    if (!normalizedPhone) return;

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullname.trim(),
          phone: normalizedPhone,
          password,
          state,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        Alert.alert('Signup Failed', data.error || 'Something went wrong');
        return;
      }

      Alert.alert('Success', 'Account created successfully');
      router.replace('/login');
    } catch (err) {
      console.log(err)
      Alert.alert('Network Error', 'Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <View className="relative w-full h-screen bg-gray-50">
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute z-20 top-8 left-2 p-4 bg-white rounded-full"
      >
        <Ionicons name="arrow-back" size={25} />
      </TouchableOpacity>

      <ScrollView className="w-full px-6">
        <View className="items-center mt-20 mb-10">
          <View className="w-16 h-16 bg-green-500/10 rounded-full items-center justify-center mb-3">
            <FontAwesome6 name="plant-wilt" size={30} color="green" />
          </View>

          <Text className="text-3xl font-bold text-center">
            {language === 'english' ? 'Join FarmLook' : 'Shiga FarmLook'}
          </Text>

          <Text className="text-center text-gray-500 text-lg mt-2">
            {language === 'english'
              ? 'Create an account to start managing your farm better.'
              : 'Ƙirƙiri asusu don fara sarrafa gonarka mafi kyau.'}
          </Text>
        </View>

        <KeyboardAvoidingView className="space-y-4 mb-6">
          <Input
            label={language === 'english' ? 'Full Name' : 'Cikakken Suna'}
            placeholder={language === 'english' ? 'e.g John Doe' : 'misali Aliyu Suleiman'}
            icon="person"
            value={fullname}
            setValue={setFullname}
          />

          <Input
            label={language === 'english' ? 'Phone Number' : 'Lambar Waya'}
            placeholder={language === 'english' ? 'e.g 08012345678' : 'misali 08012345678'}
            icon="phone"
            value={phoneNumber}
            setValue={setPhoneNumber}
          />

          {/* State Picker */}
          <View className='w-full flex flex-col  mb-4'>
            <Text className='font-medium text-lg text-gray-700 mb-2'>
              {language === "english" ? "Select Your State" : "Zaɓi Jihar Ku"}
            </Text>
            <View className="border border-gray-300  rounded-lg px-2">
              <Picker
                selectedValue={state}
                onValueChange={(value: any) => setState(value)}
                style={{ color: state ? "black" : "gray" }}
              >
                <Picker.Item style={{ color: "gray" }} label={language === "english" ? "Select your state" : "Zaɓi jihar ku"} value="" />
                {NIGERIA_STATES.map((st) => (
                  <Picker.Item  style={{ color: "rgb(0,0,0)" }} key={st} label={st} value={st} />
                ))}
              </Picker>
            </View>
          </View>


          <Input
            label={language === 'english' ? 'Password' : 'Kalmar Sirri'}
            placeholder={language === 'english' ? 'Enter your password' : 'Shigar da kalmar sirri'}
            icon="lock"
            type="password"
            value={password}
            setValue={setPassword}
          />

          <Input
            label={language === 'english' ? 'Confirm Password' : 'Tabbatar da Kalmar Sirri'}
            placeholder={language === 'english' ? 'Confirm your password' : 'Tabbatar da kalmar sirri'}
            icon="lock"
            type="password"
            value={confirmPassword}
            setValue={setConfirmPassword}
          />
        </KeyboardAvoidingView>

        <View className="flex-row items-center mb-8">
          <TouchableOpacity
            onPress={() => setAgree(!agree)}
            className="w-5 h-5 border border-gray-400 rounded mr-3 items-center justify-center"
          >
            {agree && <Ionicons name="checkmark" size={15} style={{ color: "rgb(0,150,10)" }} />}
          </TouchableOpacity>

          <Text className="text-gray-500">
            {language === "english" ? "I agree to the" : "Na amince da"}{' '}
            <Text className="text-green-600 underline">
              Terms and Conditions
            </Text>
          </Text>
        </View>

        <TouchableOpacity
          disabled={loading}
          onPress={handleSignup}
          className={`w-full py-4 rounded-full items-center ${loading ? 'bg-gray-400' : 'bg-green-600'
            }`}
        >
          <Text className="text-white text-lg font-semibold">
            {loading && language === 'english' ? 'Creating...' : loading && language === 'hausa' ? 'Ana ƙirƙira...' : language === 'english' ? 'Sign Up' : 'Yi Rajista'}
          </Text>
        </TouchableOpacity>

        <Text className="text-gray-500 text-lg text-center my-10">
          {language === "english" ? "Already have an account?" : "Ana da asusu?"}{' '}
          <Link href="/login" className="text-green-600 font-medium">
            {language === "english" ? "Login" : "Shiga"}  
          </Link>
        </Text>
      </ScrollView>
    </View>
  );
};

export default Signup;
