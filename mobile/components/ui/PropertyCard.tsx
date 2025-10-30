import { View, Text, StyleSheet, ImageBackground, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface PropertyCardProps {
  image: string;
  title: string;
  location: string;
  price: string;
  handoverDate: string;
  onPress?: () => void;
}

export default function PropertyCard({
  image,
  title,
  location,
  price,
  handoverDate,
  onPress,
}: PropertyCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { 
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }]
        }
      ]}
    >
      <ImageBackground
        source={{ uri: image }}
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        {/* Gradient overlay from bottom to middle */}
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.95)', 'rgba(0, 0, 0, 0)']}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.gradient}
        >
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.location} numberOfLines={1}>
              {location}
            </Text>
            <Text style={styles.priceInfo} numberOfLines={1}>
              {price} • Handover {handoverDate}
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 190,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 12,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 15,
  },
  textContainer: {
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  location: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 18,
  },
  priceInfo: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 18,
  },
});

