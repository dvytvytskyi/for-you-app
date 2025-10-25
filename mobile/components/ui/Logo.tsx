import React from 'react';
import { Image, View } from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'white' | 'blue';
}

export default function Logo({ size = 'large', variant = 'white' }: LogoProps) {
  const getSizeDimensions = () => {
    switch (size) {
      case 'small':
        return { width: 100, height: 30 };
      case 'medium':
        return { width: 150, height: 45 };
      case 'large':
      default:
        return { width: 200, height: 60 };
    }
  };

  const logoSource = variant === 'blue' 
    ? require('@/assets/images/new logo blue.png')
    : require('@/assets/images/new logo.png');

  const dimensions = getSizeDimensions();

  return (
    <View style={{ alignItems: 'center' }}>
      <Image
        source={logoSource}
        style={{ width: dimensions.width, height: dimensions.height }}
        resizeMode="contain"
      />
    </View>
  );
}

