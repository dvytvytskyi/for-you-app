import { View, Text, StyleSheet, ImageBackground, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface PropertyCardProps {
  property?: {
    image: string;
    title: string;
    location: string;
    price: string;
    handoverDate: string;
  };
  // Fallback for old usage
  image?: string;
  title?: string;
  location?: string;
  price?: string;
  handoverDate?: string;

  onPress?: (id?: string) => void;
  theme?: any;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string, e: any) => void;
  style?: any;
}

export default function PropertyCard({
  property,
  image,
  title,
  location,
  price,
  handoverDate,
  onPress,
  theme,
  isFavorite,
  onToggleFavorite,
  style
}: PropertyCardProps) {
  // Normalize data from either 'property' object or individual props
  const displayImage = property?.image || image;
  const displayTitle = property?.title || title;
  const displayLocation = property?.location || location;
  const displayPrice = property?.price || price;
  const displayHandover = property?.handoverDate || handoverDate;

  return (
    <Pressable
      onPress={() => onPress && onPress()}
      style={({ pressed }) => [
        styles.container,
        style,
        { opacity: pressed ? 0.9 : 1 }
      ]}
    >
      <ImageBackground
        source={
          displayImage && displayImage.trim().length > 0 && (displayImage.startsWith('http://') || displayImage.startsWith('https://') || displayImage.startsWith('data:') || displayImage.startsWith('file://'))
            ? { uri: displayImage }
            : require('@/assets/images/new logo blue.png')
        }
        style={styles.image}
        imageStyle={{ borderRadius: 12 }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1}>{displayTitle}</Text>
            <Text style={styles.location} numberOfLines={1}>{displayLocation}</Text>

            <View style={styles.footer}>
              <Text style={styles.price}>{displayPrice}</Text>
              <Text style={styles.date}>{displayHandover}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Favorite Button (if provided) */}
        {isFavorite !== undefined && onToggleFavorite && (
          <Pressable
            style={styles.favButton}
            onPress={(e) => onToggleFavorite('id-placeholder', e)}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "#FF3B30" : "#FFFFFF"}
            />
          </Pressable>
        )}
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  gradient: {
    height: '70%',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 0, // Pushed to absolute bottom
  },
  content: {
    gap: 2,
    paddingBottom: 0, // Minimal spacing from bottom edge
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  location: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontWeight: '400',
    marginBottom: 2, // Reduced margin
  },
  footer: {
    // marginTop removed to keeping tighter with location
    gap: 2, // Stack price and date vertically
  },
  price: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  date: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
  },
  favButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    // No background, just icon
  },
});
