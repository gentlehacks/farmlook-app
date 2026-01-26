import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLanguageStore } from "@/store";
import React from "react";

interface OrganicRemedy {
  product?: string;
  application?: string;
}

interface OrganicActionPlanProps {
  remedies: OrganicRemedy[];
  immediateActions?: string[];
}

const OrganicActionPlan: React.FC<OrganicActionPlanProps> = ({
  remedies = [],
  immediateActions = [],
}) => {
  const language = useLanguageStore((state) => state.language);

  if (remedies.length === 0) {
    return (
      <View className="p-4 bg-gray-100 rounded-xl">
        <Text className="text-gray-700 text-center">
          {language === "english"
            ? "No organic remedies available."
            : language === "hausa" && "Babu magungunan ƙwayoyin halitta da ake da su."}
        </Text>
      </View>
    );
  }

  return (
    <View>
      {/* Organic Remedies */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-700 mb-3">
          {language === "english"
            ? "Organic Action Plan"
            : language === "hausa" && "Shirin Ayyukan Ƙwayoyin Halitta"}
        </Text>
        {remedies.map((remedy: OrganicRemedy, index: number) => (
          <View key={index} className="mb-4 p-4 bg-emerald-50 rounded-xl">
            <View className="flex-row items-start">
              <Ionicons
                name="leaf"
                size={20}
                color="#10B981"
                className="mr-3 mt-1"
              />
              <View className="flex-1">
                <Text className="font-bold text-emerald-800 text-lg mb-1">
                  {remedy.product || `Organic Remedy ${index + 1}`}
                </Text>
                <Text className="text-emerald-700">
                  {remedy.application || "Apply as directed."}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default OrganicActionPlan;
