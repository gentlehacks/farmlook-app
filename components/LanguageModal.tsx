import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguageStore } from '@/store';

interface LanguageWelcomeModalProps {
  visible: boolean;
  onClose: () => void;
}

const LanguageWelcomeModal = ({ visible, onClose }: LanguageWelcomeModalProps) => {
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const handleLanguageSelect = async (lang: 'english' | 'hausa') => {
    try {
      // Update Zustand store (auto-persists)
      setLanguage(lang);

      // Mark as selected
      await AsyncStorage.setItem('has_selected_language', 'true');

      onClose();
    } catch (error) {
      console.error('Error selecting language:', error);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-6">
        <View className="bg-white rounded-3xl p-8 w-full max-w-sm">
          <View className="items-center mb-6">
            <View className="w-20 h-20 bg-green-100 rounded-2xl items-center justify-center mb-4">
              <Text className="text-3xl">🌱</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-800">FarmLook</Text>
          </View>

          <Text className="text-lg text-center text-gray-600 mb-2">
            Welcome! Let's get started
          </Text>
          <Text className="text-base text-center text-gray-500 mb-8">
            Barka da zuwa! Mu fara
          </Text>

          {/* Language Options */}
          <TouchableOpacity
            className="bg-green-50 border-2 border-green-200 rounded-xl p-5 mb-4 active:bg-green-100"
            onPress={() => handleLanguageSelect('english')}
          >
            <Text className="text-xl font-bold text-green-800">English</Text>
            <Text className="text-gray-600">Continue in English</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-green-50 border-2 border-green-200 rounded-xl p-5 mb-6 active:bg-green-100"
            onPress={() => handleLanguageSelect('hausa')}
          >
            <Text className="text-xl font-bold text-green-800">Hausa</Text>
            <Text className="text-gray-600">Ci gaba da Hausa</Text>
          </TouchableOpacity>

          <Text className="text-center text-gray-400 text-sm">
            You can change language later in settings
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default LanguageWelcomeModal;