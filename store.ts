import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type LanguageType = "english" | "hausa" | "yoruba" | "igbo" | "nupe";

interface LanguageState {
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "english", 
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "user-language", 
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
);
