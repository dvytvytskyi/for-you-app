import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Image } from 'react-native';

interface AnimatedSplashScreenProps {
    isDark: boolean;
    onAnimationComplete: () => void;
}

const { width } = Dimensions.get('window');

const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({ isDark, onAnimationComplete }) => {
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const containerFadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Start animation after a short delay
        const animationTimeout = setTimeout(() => {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1.1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(containerFadeAnim, {
                    toValue: 0,
                    duration: 1000,
                    delay: 400,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                onAnimationComplete();
            });
        }, 1200);

        return () => clearTimeout(animationTimeout);
    }, []);

    const backgroundColor = isDark ? '#010312' : '#FFFFFF';
    const logoSource = isDark
        ? require('@/assets/images/new logo.png')
        : require('@/assets/images/new logo blue.png');

    return (
        <Animated.View
            style={[
                styles.container,
                { backgroundColor, opacity: containerFadeAnim }
            ]}
        >
            <Animated.Image
                source={logoSource}
                style={[
                    styles.logo,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    }
                ]}
                resizeMode="contain"
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: width * 0.6,
        height: width * 0.6,
    },
});

export default AnimatedSplashScreen;
