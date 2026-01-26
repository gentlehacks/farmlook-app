// Create mapping object
export const CROP_IMAGES = {
  maize: require("@/assets/images/crops/maize.jpg"),
  tomato: require("@/assets/images/crops/tomato.jpg"),
  groundnut: require("@/assets/images/crops/groundnut.jpg"),
  rice: require("@/assets/images/crops/rice.jpg"),
  beans: require("@/assets/images/crops/beans.jpg"),
  soybeans: require("@/assets/images/crops/soybeans.jpg"),
  watermelon: require("@/assets/images/crops/watermelon.jpg"),
  pepper: require("@/assets/images/crops/pepper.jpg"),
  guneacorn: require("@/assets/images/crops/guneacorn.jpg"),
  onion: require("@/assets/images/crops/onion.jpg"),
  millet: require("@/assets/images/crops/millet.jpeg"),
  cassava: require("@/assets/images/crops/cassava.jpg"),
};
// Helper function to get crop image
export const getCropImage = (cropName: string) => {
  const image = CROP_IMAGES[cropName as keyof typeof CROP_IMAGES];
  return image || CROP_IMAGES.maize; // Fallback to maize
};

// Type for TypeScript
export type CropImageName = keyof typeof CROP_IMAGES;
