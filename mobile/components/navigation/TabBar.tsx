import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';
import { BlurView } from 'expo-blur';
import { useAuthStore } from '@/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = width - 40;

// Sub-component for animated tab items
const TabItem = ({ route, index, state, descriptors, navigation, tabWidth, isInvestor, isDark, theme }: any) => {
    const isFocused = state.index === index;
    const scale = useRef(new Animated.Value(1)).current;
    const translateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isFocused) {
            // "Bouncy" animation when focused
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(scale, {
                        toValue: 1.2,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                    Animated.spring(scale, {
                        toValue: 1,
                        friction: 4,
                        useNativeDriver: true,
                    })
                ]),
                Animated.sequence([
                    Animated.timing(translateY, {
                        toValue: -4,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                    Animated.spring(translateY, {
                        toValue: 0,
                        friction: 4,
                        useNativeDriver: true,
                    })
                ])
            ]).start();
        }
    }, [isFocused]);

    const options = descriptors[route.key].options as any;
    const name = route.name;

    const isVisible = isInvestor
        ? ['home', 'properties', 'chat', 'portfolio'].includes(name)
        : ['home', 'properties', 'crm', 'collections'].includes(name);

    if (!isVisible || name === 'liked') return null;

    const onPress = () => {
        const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
        }
    };

    const label = options.title || name;

    const getIcon = (color: string) => {
        let iconName: any = 'help-circle-outline';
        if (name === 'home') iconName = isFocused ? 'search' : 'search-outline';
        else if (name === 'properties') iconName = isFocused ? 'business' : 'business-outline';
        else if (name === 'portfolio') iconName = isFocused ? 'wallet' : 'wallet-outline';
        else if (name === 'chat') iconName = isFocused ? 'chatbubbles' : 'chatbubbles-outline';
        else if (name === 'crm') iconName = isFocused ? 'people' : 'people-outline';
        else if (name === 'collections') iconName = isFocused ? 'folder' : 'folder-outline';

        return <Ionicons name={iconName} size={22} color={color} />;
    };

    return (
        <Pressable
            onPress={onPress}
            style={[styles.tabItem, { width: tabWidth }]}
        >
            <Animated.View style={[
                styles.iconContainer,
                { transform: [{ scale }, { translateY }] }
            ]}>
                {getIcon(isFocused ? '#FFF' : (isDark ? '#AAA' : '#888'))}
            </Animated.View>
            <Text
                numberOfLines={1}
                style={[
                    styles.label,
                    {
                        color: isFocused ? '#FFF' : (isDark ? '#AAA' : '#888'),
                        fontWeight: isFocused ? '700' : '500',
                    }
                ]}
            >
                {label}
            </Text>
        </Pressable>
    );
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { theme, isDark } = useTheme();
    const { user } = useAuthStore();
    const isInvestor = user?.role === 'INVESTOR';

    // 1. Hooks (Must be called unconditionally)
    const translateX = useRef(new Animated.Value(0)).current;
    const pillScaleX = useRef(new Animated.Value(1)).current;
    const pillScaleY = useRef(new Animated.Value(1)).current;

    // 2. Logic to determine visibility
    const visibleRoutes = state.routes.filter(r => {
        const name = r.name;
        if (name === 'liked') return false;
        if (isInvestor) {
            return ['home', 'properties', 'chat', 'portfolio'].includes(name);
        } else {
            return ['home', 'properties', 'crm', 'collections'].includes(name);
        }
    });

    const visibleCount = visibleRoutes.length;
    const tabWidth = (TAB_BAR_WIDTH - 6) / (visibleCount || 1);

    // 3. Early Return Logic (AFTER hooks are initialized)
    // Check if tab bar is hidden for current screen
    const currentRoute = state.routes[state.index];
    const currentDescriptor = descriptors[currentRoute.key];
    const tabBarStyle = currentDescriptor.options.tabBarStyle as any;

    // UseEffect is also a hook, so it must be before any return
    useEffect(() => {
        const currentRoute = state.routes[state.index];
        if (!currentRoute) return;

        const visibleIndex = visibleRoutes.findIndex(r => r.name === currentRoute.name);

        if (visibleIndex !== -1 && tabWidth > 0) {
            // Parallel animations for translation and "jump" effect
            Animated.parallel([
                // The main slide move
                Animated.spring(translateX, {
                    toValue: visibleIndex * tabWidth,
                    useNativeDriver: true,
                    damping: 20,
                    stiffness: 140,
                    mass: 0.8
                }),
                // The "bubbly" jump/stretch effect
                Animated.sequence([
                    // First stretch horizontally and squash vertically as it "launches"
                    Animated.timing(pillScaleX, {
                        toValue: 1.15,
                        duration: 100,
                        useNativeDriver: true
                    }),
                    Animated.timing(pillScaleY, {
                        toValue: 0.85,
                        duration: 100,
                        useNativeDriver: true
                    }),
                    // Then snap back with a bounce
                    Animated.spring(pillScaleX, {
                        toValue: 1,
                        friction: 3,
                        tension: 40,
                        useNativeDriver: true
                    }),
                    Animated.spring(pillScaleY, {
                        toValue: 1,
                        friction: 3,
                        tension: 40,
                        useNativeDriver: true
                    })
                ])
            ]).start();
        }
    }, [state.index, tabWidth, visibleRoutes]);

    if (tabBarStyle?.display === 'none') {
        return null;
    }



    return (
        <View style={styles.outerContainer} pointerEvents="box-none">
            {/* Ambient Background Gradient for depth */}
            <LinearGradient
                colors={[
                    'transparent',
                    isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.1)'
                ]}
                style={styles.ambientGradient}
                pointerEvents="none"
            />

            <BlurView
                intensity={45}
                tint={isDark ? 'dark' : 'light'}
                style={[
                    styles.container,
                    {
                        backgroundColor: isDark ? 'rgba(25, 25, 35, 0.6)' : 'rgba(255, 255, 255, 0.65)',
                        borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
                    }
                ]}
            >
                {/* Active Indicator Pill */}
                {visibleCount > 0 && (
                    <Animated.View style={[
                        styles.pill,
                        {
                            width: tabWidth - 6,
                            backgroundColor: theme.primary,
                            transform: [
                                { translateX },
                                { scaleX: pillScaleX },
                                { scaleY: pillScaleY }
                            ]
                        }
                    ]} />
                )}

                {state.routes.map((route, index) => (
                    <TabItem
                        key={route.key}
                        route={route}
                        index={index}
                        state={state}
                        descriptors={descriptors}
                        navigation={navigation}
                        tabWidth={tabWidth}
                        isInvestor={isInvestor}
                        isDark={isDark}
                        theme={theme}
                    />
                ))}
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        position: 'absolute',
        bottom: 25,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    container: {
        flexDirection: 'row',
        width: TAB_BAR_WIDTH,
        height: 66,
        borderRadius: 33,
        paddingHorizontal: 3,
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    tabItem: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    pill: {
        position: 'absolute',
        top: 6,
        bottom: 6,
        borderRadius: 27,
        left: 6,
        zIndex: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    iconContainer: {
        marginBottom: 0,
    },
    label: {
        fontSize: 10,
        letterSpacing: -0.1,
    },
    ambientGradient: {
        position: 'absolute',
        bottom: -25,
        left: -20,
        right: -20,
        height: 80,
    },
});
