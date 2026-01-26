import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, View } from 'react-native'

const upgrade = () => {
  return (
    <View className='w-full h-screen flex flex-col bg-gray-50 rounded-top-2xl'>
      <Ionicons name="arrow-back" size={25} className="mt-10 ml-4"/>
      <Text className='text-2xl font-bold text-gray-700 mt-6 ml-6'>Upgrade to Pro</Text>
      <View className='w-full h-64 bg-green-600 rounded-3xl m-6 p-6 flex flex-col justify-between'>
        <Text className='text-white text-xl font-bold'>Upgrade to Pro</Text>
        <Text className='text-white text-sm'>Unlock all features and get premium support</Text>
        <View className='w-full h-12 bg-white rounded-2xl flex items-center justify-center'>
          <Text className='text-green-600 font-bold'>Upgrade Now</Text>
        </View>
      </View>
    </View>
  )
}

export default upgrade