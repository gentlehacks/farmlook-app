import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLanguageStore } from "@/store";
import React from "react";

interface ChemicalControl {
  product?: string;
  application?: string;
  safetyWarning?: string;
}

interface ChemicalActionPlanProps {
  controls: ChemicalControl[];
  immediateActions?: string[];
}

const ChemicalActionPlan: React.FC<ChemicalActionPlanProps> = ({
  controls = [],
  immediateActions = [],
}) => {
  const language = useLanguageStore((state) => state.language);

  if (controls.length === 0) {
    return (
      <View className="p-4 bg-gray-100 rounded-xl">
        <Text className="text-gray-700 text-center">
          {language === "english"
            ? "No chemical controls available."
            : language === "hausa" && "Babu magungunan sinadarai da ake da su."}
        </Text>
      </View>
    );
  }

  return (
    <View>
      {/* Chemical Controls */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-700 mb-3">
          {language === "english"
            ? "Chemical Action Plan"
            : language === "hausa" && "Shirin Ayyukan Sinadarai"}
        </Text>
        {controls.map((control: ChemicalControl, index: number) => (
          <View key={index} className="mb-4 p-4 bg-red-50 rounded-xl">
            <View className="flex-row items-start">
              <Ionicons
                name="warning"
                size={20}
                color="#EF4444"
                className="mr-3 mt-1"
              />
              <View className="flex-1">
                <Text className="font-bold text-red-800 text-lg mb-1">
                  {control.product || `Chemical Control ${index + 1}`}
                </Text>
                <Text className="text-red-700 mb-2">
                  {control.application ||
                    "Apply as directed with proper safety equipment."}
                </Text>
                {control.safetyWarning && (
                  <Text className="text-red-600 text-sm italic">
                    ⚠️ {control.safetyWarning}
                  </Text>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ChemicalActionPlan;
