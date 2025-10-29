import React from 'react';
import { Image, StyleSheet } from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'white' | 'blue';
}

export default function Logo({ size = 'large', variant = 'white' }: LogoProps) {
  const logoSource = variant === 'blue' 
    ? require('@/assets/images/new logo blue.png')
    : require('@/assets/images/new logo.png');

  const getStyle = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'medium':
        return styles.medium;
      case 'large':
      default:
        return styles.large;
    }
  };

  return (
    <Image
      source={logoSource}
      style={getStyle()}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  small: {
    width: 120,
    height: 36,
  },
  medium: {
    width: 200,
    height: 60,
  },
  large: {
    width: 320,
    height: 96,
  },
});

