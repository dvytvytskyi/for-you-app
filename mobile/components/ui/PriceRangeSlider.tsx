import React, { useMemo, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    PanResponder,
    Animated,
    Dimensions,
} from 'react-native';
import Svg, { Path, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '@/utils/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_WIDTH = SCREEN_WIDTH - 64; // Horizontal padding in modal
const THUMB_SIZE = 24;

interface PriceRangeSliderProps {
    minPrice: number | null;
    maxPrice: number | null;
    priceOptions: { value: number; label: string }[];
    onValueChange: (min: number | null, max: number | null) => void;
}

export default function PriceRangeSlider({
    minPrice,
    maxPrice,
    priceOptions,
    onValueChange,
}: PriceRangeSliderProps) {
    const { theme } = useTheme();

    // Use refs to keep track of latest props to avoid stale closures in PanResponder
    const propsRef = useRef({ onValueChange, minPrice, maxPrice, priceOptions });
    React.useEffect(() => {
        propsRef.current = { onValueChange, minPrice, maxPrice, priceOptions };
    }, [onValueChange, minPrice, maxPrice, priceOptions]);

    // Find indices for current values
    const minIndex = useMemo(() => {
        if (minPrice === null) return 0;
        const idx = priceOptions.findIndex(p => p.value === minPrice);
        return idx === -1 ? 0 : idx;
    }, [minPrice, priceOptions]);

    const maxIndex = useMemo(() => {
        if (maxPrice === null) return priceOptions.length - 1;
        const idx = priceOptions.findIndex(p => p.value === maxPrice);
        return idx === -1 ? priceOptions.length - 1 : idx;
    }, [maxPrice, priceOptions]);

    // Local state for real-time display during dragging
    const [tempMinIndex, setTempMinIndex] = useState(minIndex);
    const [tempMaxIndex, setTempMaxIndex] = useState(maxIndex);

    // Sync temp state with props when not dragging
    React.useEffect(() => {
        setTempMinIndex(minIndex);
        setTempMaxIndex(maxIndex);
    }, [minIndex, maxIndex]);

    // Animated values for thumbs
    const minPos = useRef(new Animated.Value((minIndex / (priceOptions.length - 1)) * SLIDER_WIDTH)).current;
    const maxPos = useRef(new Animated.Value((maxIndex / (priceOptions.length - 1)) * SLIDER_WIDTH)).current;

    // Track positions internally to avoid index jumping during pan
    const minX = useRef((minIndex / (priceOptions.length - 1)) * SLIDER_WIDTH);
    const maxX = useRef((maxIndex / (priceOptions.length - 1)) * SLIDER_WIDTH);

    // Update positions when props change (e.g. on reset)
    React.useEffect(() => {
        const targetMin = (minIndex / (priceOptions.length - 1)) * SLIDER_WIDTH;
        const targetMax = (maxIndex / (priceOptions.length - 1)) * SLIDER_WIDTH;
        minX.current = targetMin;
        maxX.current = targetMax;
        Animated.spring(minPos, { toValue: targetMin, useNativeDriver: false }).start();
        Animated.spring(maxPos, { toValue: targetMax, useNativeDriver: false }).start();
    }, [minIndex, maxIndex]);

    const panResponderMin = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                let newX = minX.current + gestureState.dx;
                if (newX < 0) newX = 0;
                // Use maxX.current from latest move
                if (newX > maxX.current - THUMB_SIZE) newX = maxX.current - THUMB_SIZE;
                minPos.setValue(newX);

                // Update real-time display
                const index = Math.round((newX / SLIDER_WIDTH) * (propsRef.current.priceOptions.length - 1));
                if (index !== tempMinIndex) setTempMinIndex(index);
            },
            onPanResponderRelease: (_, gestureState) => {
                let finalX = minX.current + gestureState.dx;
                if (finalX < 0) finalX = 0;
                if (finalX > maxX.current - THUMB_SIZE) finalX = maxX.current - THUMB_SIZE;

                // Snap to nearest index
                const index = Math.round((finalX / SLIDER_WIDTH) * (propsRef.current.priceOptions.length - 1));
                const snappedX = (index / (propsRef.current.priceOptions.length - 1)) * SLIDER_WIDTH;

                minX.current = snappedX;
                Animated.spring(minPos, { toValue: snappedX, useNativeDriver: false }).start();

                propsRef.current.onValueChange(propsRef.current.priceOptions[index].value, propsRef.current.maxPrice);
            },
        })
    ).current;

    const panResponderMax = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                let newX = maxX.current + gestureState.dx;
                if (newX > SLIDER_WIDTH) newX = SLIDER_WIDTH;
                if (newX < minX.current + THUMB_SIZE) newX = minX.current + THUMB_SIZE;
                maxPos.setValue(newX);

                // Update real-time display
                const index = Math.round((newX / SLIDER_WIDTH) * (propsRef.current.priceOptions.length - 1));
                if (index !== tempMaxIndex) setTempMaxIndex(index);
            },
            onPanResponderRelease: (_, gestureState) => {
                let finalX = maxX.current + gestureState.dx;
                if (finalX > SLIDER_WIDTH) finalX = SLIDER_WIDTH;
                if (finalX < minX.current + THUMB_SIZE) finalX = minX.current + THUMB_SIZE;

                // Snap to nearest index
                const index = Math.round((finalX / SLIDER_WIDTH) * (propsRef.current.priceOptions.length - 1));
                const snappedX = (index / (propsRef.current.priceOptions.length - 1)) * SLIDER_WIDTH;

                maxX.current = snappedX;
                Animated.spring(maxPos, { toValue: snappedX, useNativeDriver: false }).start();

                propsRef.current.onValueChange(propsRef.current.minPrice, propsRef.current.priceOptions[index].value);
            },
        })
    ).current;

    // Mock histogram data (heights of bars)
    const histogramData = useMemo(() => {
        return [
            10, 15, 25, 40, 60, 80, 70, 50, 45, 60, 90, 100, 85, 65, 50, 40, 35, 30, 25, 20, 18, 15, 12, 10, 8
        ];
    }, []);

    const barWidth = SLIDER_WIDTH / histogramData.length;

    return (
        <View style={styles.container}>
            <View style={styles.rangeDisplay}>
                <Text style={[styles.rangeText, { color: theme.text }]}>
                    {priceOptions[tempMinIndex]?.label} — {priceOptions[tempMaxIndex]?.label}
                    {tempMaxIndex === priceOptions.length - 1 ? '+' : ''}
                </Text>
            </View>

            <View style={[styles.sliderWrapper, { width: SLIDER_WIDTH }]}>
                {/* Histogram / Wave Background */}
                <View style={styles.histogramWrapper}>
                    <Svg height="60" width={SLIDER_WIDTH}>
                        {histogramData.map((h, i) => {
                            const x = i * barWidth;
                            const isSelected = i >= tempMinIndex && i <= tempMaxIndex;
                            return (
                                <Rect
                                    key={i}
                                    x={x + 1}
                                    width={barWidth - 2}
                                    y={60 - h * 0.5}
                                    height={h * 0.5}
                                    rx="1"
                                    fill={isSelected ? theme.primary : theme.textTertiary}
                                    opacity={isSelected ? 0.9 : 0.2}
                                />
                            );
                        })}
                    </Svg>
                </View>

                {/* Slider Track */}
                <View style={[styles.track, { backgroundColor: theme.border }]} />
                <Animated.View
                    style={[
                        styles.activeTrack,
                        {
                            backgroundColor: theme.primary,
                            left: minPos,
                            width: Animated.subtract(maxPos, minPos),
                        },
                    ]}
                />

                {/* Thumbs */}
                <Animated.View
                    style={[
                        styles.thumb,
                        {
                            backgroundColor: '#FFFFFF',
                            borderColor: theme.primary,
                            left: Animated.add(minPos, -THUMB_SIZE / 2),
                        },
                    ]}
                    {...panResponderMin.panHandlers}
                >
                    <View style={[styles.thumbInner, { backgroundColor: theme.primary }]} />
                </Animated.View>
                <Animated.View
                    style={[
                        styles.thumb,
                        {
                            backgroundColor: '#FFFFFF',
                            borderColor: theme.primary,
                            left: Animated.add(maxPos, -THUMB_SIZE / 2),
                        },
                    ]}
                    {...panResponderMax.panHandlers}
                >
                    <View style={[styles.thumbInner, { backgroundColor: theme.primary }]} />
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        alignItems: 'center',
    },
    rangeDisplay: {
        marginBottom: 15,
    },
    rangeText: {
        fontSize: 24,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    sliderWrapper: {
        height: 100,
        justifyContent: 'center',
    },
    histogramWrapper: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        height: 60,
    },
    track: {
        height: 2,
        borderRadius: 1,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 60,
    },
    activeTrack: {
        height: 3,
        borderRadius: 1.5,
        position: 'absolute',
        top: 59.5,
    },
    thumb: {
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: THUMB_SIZE / 2,
        borderWidth: 2,
        position: 'absolute',
        top: 50,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    thumbInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});
