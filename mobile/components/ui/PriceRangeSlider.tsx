import React, { useMemo, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { Slider } from '@miblanchard/react-native-slider';
import { useTheme } from '@/utils/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_WIDTH = SCREEN_WIDTH - 64; // Horizontal padding in modal
const THUMB_SIZE = 24;

interface PriceRangeSliderProps {
    minPrice: number | null;
    maxPrice: number | null;
    priceOptions: { value: number; label: string }[];
    onValueChange: (min: number | null, max: number | null) => void;
    onToggleScroll?: (enabled: boolean) => void;
}

export default function PriceRangeSlider({
    minPrice,
    maxPrice,
    priceOptions,
    onValueChange,
    onToggleScroll,
}: PriceRangeSliderProps) {
    const { theme } = useTheme();

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
    const [range, setRange] = useState<[number, number]>([minIndex, maxIndex]);

    // Update local state when props change
    useEffect(() => {
        setRange([minIndex, maxIndex]);
    }, [minIndex, maxIndex]);

    const histogramData = useMemo(() => {
        return [
            10, 15, 25, 40, 60, 80, 70, 50, 45, 60, 90, 100, 85, 65, 50, 40, 35, 30, 25, 20, 18, 15, 12, 10, 8
        ];
    }, []);

    const barWidth = SLIDER_WIDTH / histogramData.length;

    const handleValueChange = (values: number | number[]) => {
        if (Array.isArray(values)) {
            setRange([Math.round(values[0]), Math.round(values[1])]);
        }
    };

    const handleSlidingStart = () => {
        onToggleScroll?.(false);
    };

    const handleSlidingComplete = (values: number | number[]) => {
        onToggleScroll?.(true);
        if (Array.isArray(values)) {
            const newMinIndex = Math.round(values[0]);
            const newMaxIndex = Math.round(values[1]);
            onValueChange(
                priceOptions[newMinIndex].value,
                priceOptions[newMaxIndex].value
            );
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.rangeDisplay}>
                <Text style={[styles.rangeText, { color: theme.text }]}>
                    {priceOptions[range[0]]?.label} — {priceOptions[range[1]]?.label}
                    {range[1] === priceOptions.length - 1 ? '+' : ''}
                </Text>
            </View>

            <View style={[styles.sliderWrapper, { width: SLIDER_WIDTH }]}>
                {/* Histogram */}
                <View style={styles.histogramWrapper}>
                    <Svg height="60" width={SLIDER_WIDTH}>
                        {histogramData.map((h, i) => {
                            const x = i * barWidth;
                            const isSelected = i >= range[0] && i <= range[1];
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

                {/* Library Slider */}
                <Slider
                    value={range}
                    animationType="spring"
                    onValueChange={handleValueChange}
                    onSlidingStart={handleSlidingStart}
                    onSlidingComplete={handleSlidingComplete}
                    minimumValue={0}
                    maximumValue={priceOptions.length - 1}
                    step={1}
                    minimumTrackTintColor={theme.primary}
                    maximumTrackTintColor={theme.border}
                    thumbTintColor="#FFFFFF"
                    trackStyle={styles.track}
                    thumbStyle={{ ...styles.thumb, borderColor: theme.primary }}
                    containerStyle={styles.sliderContainer}
                    renderThumbComponent={() => (
                        <View style={[styles.thumb, { borderColor: theme.primary, backgroundColor: '#FFFFFF' }]}>
                            <View style={[styles.thumbInner, { backgroundColor: theme.primary }]} />
                        </View>
                    )}
                />
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
        top: 0,
        left: 0,
        right: 0,
        height: 60,
    },
    sliderContainer: {
        height: 40,
        marginTop: 40,
    },
    track: {
        height: 3,
        borderRadius: 2,
    },
    thumb: {
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: THUMB_SIZE / 2,
        borderWidth: 2,
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
