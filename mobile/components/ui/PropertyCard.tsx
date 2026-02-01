import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ImageBackground, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { formatPrice } from '@/utils/property-utils';

interface PropertyCardProps {
  property?: {
    image?: string;
    images?: string[];
    title: string;
    location: string;
    price: string | number;
    handoverDate: string;
  };
  // Fallback for old usage
  image?: string;
  images?: string[];
  title?: string;
  location?: string;
  price?: string | number;
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
  images,
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
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  // Normalize data from either 'property' object or individual props
  // Handle images array (take first) or single image string
  const propImages = property?.images || images;
  const firstImage = propImages && propImages.length > 0 ? propImages[0] : null;
  const displayImage = property?.image || image || firstImage;

  const displayTitle = property?.title || title;
  const displayLocation = property?.location || location;

  // Format price if it's a number
  const rawPrice = property?.price ?? price;
  const displayPrice = typeof rawPrice === 'number'
    ? formatPrice(rawPrice)
    : rawPrice;

  const displayHandover = property?.handoverDate || handoverDate;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

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
        onLoad={handleImageLoad}
      >
        {isImageLoaded ? (
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.85)']}
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
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: theme?.isDark ? '#1A1A1A' : '#F0F0F0', justifyContent: 'center', alignItems: 'center' }]}>
            <Animated.View style={{ opacity: pulseAnim }}>
              <Ionicons name="cube-outline" size={32} color={theme?.primary || '#102F73'} />
            </Animated.View>
          </View>
        )}

        {/* Favorite Button (if provided) */}
        {isFavorite !== undefined && onToggleFavorite && (
          <Pressable
            style={styles.favButton}
            onPress={(e) => {
              e?.stopPropagation?.();
              onToggleFavorite('id-placeholder', e);
            }}
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
    backgroundColor: '#E1E1E1',
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
    paddingBottom: 1,
  },
  content: {
    gap: 2,
    paddingBottom: 0,
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
    marginBottom: 2,
  },
  footer: {
    gap: 2,
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
  },
  skeleton: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#CCCCCC',
  },
  skeletonContent: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  skeletonLine: {
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
  },
});

