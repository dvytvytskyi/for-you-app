import { View, Text, StyleSheet, FlatList, Pressable, Image, ActivityIndicator, Dimensions, ScrollView, RefreshControl, Linking } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/ui';
import { useTheme } from '@/utils/theme';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { portfolioApi } from '@/api/portfolio';
import { useAuthStore } from '@/store/authStore';
import { PortfolioItem, PortfolioAnalytics, OperationalStatus } from '@/types/portfolio';

// cleanup
const { width } = Dimensions.get('window');

export default function PortfolioScreen() {
    const { theme, isDark } = useTheme();
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const insets = useSafeAreaInsets();

    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [analytics, setAnalytics] = useState<PortfolioAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchPortfolio = async () => {
        if (!user?.id) return;
        try {
            const data = await portfolioApi.getPortfolio(user.id);
            setItems(data.items);
            setAnalytics(data.analytics);
        } catch (error) {
            console.error('Error fetching portfolio:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPortfolio();
    }, [user?.id]);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchPortfolio();
    }, [user?.id]);

    const renderAnalyticsCard = () => {
        if (!analytics) return null;

        return (
            <View style={[styles.analyticsContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8F9FA' }]}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Portfolio Analytics</Text>

                <View style={[styles.analyticsGrid, { marginBottom: 0 }]}>
                    <View style={styles.analyticsItem}>
                        <Text style={[styles.analyticsLabel, { color: theme.textSecondary }]}>Total Invested</Text>
                        <Text style={[styles.analyticsValue, { color: theme.primary }]}>
                            $ {analytics.totalPurchasePrice.toLocaleString('en-US').replace(/,/g, ' ')}
                        </Text>
                    </View>

                    <View style={styles.analyticsItem}>
                        <Text style={[styles.analyticsLabel, { color: theme.textSecondary }]}>Est. Value</Text>
                        <Text style={[styles.analyticsValue, { color: '#2ECC71' }]}>
                            $ {analytics.totalEstimatedSellingValue.toLocaleString('en-US').replace(/,/g, ' ')}
                        </Text>
                    </View>
                </View>

                <View style={[styles.divider, { backgroundColor: theme.border, marginVertical: 12 }]} />

                <View style={styles.analyticsGrid}>
                    <View style={styles.analyticsItem}>
                        <Text style={[styles.analyticsLabel, { color: theme.textSecondary }]}>Annual Yield</Text>
                        <Text style={[styles.analyticsValue, { color: theme.text }]}>
                            $ {analytics.totalAnnualCashFlow.toLocaleString('en-US').replace(/,/g, ' ')}
                        </Text>
                    </View>

                    <View style={styles.analyticsItem}>
                        <Text style={[styles.analyticsLabel, { color: theme.textSecondary }]}>Appreciation</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styles.analyticsValue, { color: theme.text }]}>
                                {analytics.totalAppreciationPercentage.toFixed(1)}%
                            </Text>
                            <Ionicons name="trending-up" size={16} color="#2ECC71" style={{ marginLeft: 4 }} />
                        </View>
                    </View>
                </View>

                <View style={[styles.forecastBox, { backgroundColor: theme.primary + '10' }]}>
                    <Ionicons name="calendar-outline" size={20} color={theme.primary} />
                    <View style={styles.forecastTextContainer}>
                        <Text style={[styles.forecastLabel, { color: theme.textSecondary }]}>3-Year Forecast Income</Text>
                        <Text style={[styles.forecastValue, { color: theme.primary }]}>
                            $ {analytics.annualCashFlowIn3Years.toLocaleString('en-US').replace(/,/g, ' ')}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    const StatusBadge = ({ status }: { status: string }) => {
        let bgColor = 'rgba(155, 155, 155, 0.1)';
        let textColor = '#999';

        switch (status) {
            case 'Renting out':
                bgColor = 'rgba(46, 204, 113, 0.1)';
                textColor = '#27AE60';
                break;
            case 'Under construction':
                bgColor = 'rgba(241, 196, 15, 0.1)';
                textColor = '#F39C12';
                break;
            case 'Pending to be sold':
                bgColor = 'rgba(52, 152, 219, 0.1)';
                textColor = '#2980B9';
                break;
        }

        return (
            <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
                <Text style={[styles.statusText, { color: textColor }]}>{status}</Text>
            </View>
        );
    };

    const handleWhatsApp = () => {
        const message = "Hello, I have a question about my portfolio.";
        const whatsappUrl = `https://wa.me/971585252877?text=${encodeURIComponent(message)}`;
        Linking.openURL(whatsappUrl);
    };

    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <Header
                    title="My portfolio"
                    avatar={user?.avatar || undefined}
                    user={user || undefined}
                    centered={true}
                    titleColor="#FFFFFF"
                    titleSize={16}
                    onBack={handleWhatsApp}
                    backIconName="logo-whatsapp"
                    backColor="#25D366"
                />

                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={renderAnalyticsCard}
                    renderItem={({ item }) => (
                        <Pressable
                            style={[styles.itemCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                            onPress={() => {
                                console.log('🚀 Navigating to Project ID:', item.property.id);
                                router.push(`/project/${item.property.id}`);
                            }}
                        >
                            <Image source={{ uri: item.property.photos?.[0] }} style={styles.itemImage} />
                            <View style={styles.itemDetails}>
                                <View style={styles.itemHeader}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.propertyName, { color: theme.text }]} numberOfLines={1}>
                                            {item.property.name}
                                        </Text>
                                        <Text style={[styles.unitName, { color: theme.textSecondary }]}>
                                            {item.unitName}
                                        </Text>
                                    </View>
                                    <View style={styles.headerRight}>
                                        {item.advisorWhatsapp && (
                                            <Pressable
                                                onPress={() => Linking.openURL(item.advisorWhatsapp!)}
                                                style={styles.whatsappAction}
                                            >
                                                <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                                            </Pressable>
                                        )}
                                        <StatusBadge status={item.operationalStatus} />
                                    </View>
                                </View>

                                <View style={[styles.dividerSmall, { backgroundColor: theme.border }]} />

                                <View style={styles.itemMetrics}>
                                    <View style={styles.metric}>
                                        <Text style={[styles.metricLabel, { color: theme.textTertiary }]}>ROI</Text>
                                        <Text style={[styles.metricValue, { color: '#2ECC71' }]}>{item.roi.toFixed(1)}%</Text>
                                    </View>
                                    <View style={styles.metric}>
                                        <Text style={[styles.metricLabel, { color: theme.textTertiary }]}>Yield</Text>
                                        <Text style={[styles.metricValue, { color: theme.text }]}>$ {Number(item.annualCashFlow).toLocaleString('en-US', { maximumFractionDigits: 0 }).replace(/,/g, ' ')}</Text>
                                    </View>
                                    <View style={styles.metric}>
                                        <Text style={[styles.metricLabel, { color: theme.textTertiary }]}>Apprec.</Text>
                                        <Text style={[styles.metricValue, { color: theme.primary }]}>+{item.appreciation.toFixed(1)}%</Text>
                                    </View>
                                </View>

                                <View style={styles.saleInfo}>
                                    <Ionicons name="time-outline" size={14} color={theme.textTertiary} />
                                    <Text style={[styles.saleDate, { color: theme.textTertiary }]}>
                                        Planned Sale: {item.plannedSaleDate}
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                    )
                    }
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={
                        < RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={theme.primary} />
                    }
                    ListEmptyComponent={
                        < View style={styles.emptyContainer} >
                            <Ionicons name="wallet-outline" size={64} color={theme.textTertiary} />
                            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                                No items in your portfolio yet
                            </Text>
                        </View >
                    }
                />
            </SafeAreaView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    analyticsContainer: {
        margin: 16,
        padding: 20,
        borderRadius: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
    },
    analyticsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    analyticsItem: {
        flex: 1,
    },
    analyticsLabel: {
        fontSize: 12,
        marginBottom: 6,
    },
    analyticsValue: {
        fontSize: 20,
        fontWeight: '800',
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    percentBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        marginLeft: 8,
    },
    percentText: {
        color: '#2ECC71',
        fontSize: 10,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        width: '100%',
        marginVertical: 16,
        opacity: 0.5,
    },
    forecastBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        marginTop: 24,
    },
    forecastTextContainer: {
        marginLeft: 12,
    },
    forecastLabel: {
        fontSize: 11,
    },
    forecastValue: {
        fontSize: 16,
        fontWeight: '700',
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        borderRadius: 12,
        marginTop: 20,
        gap: 8,
    },
    contactButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
    itemCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
    },
    itemImage: {
        width: '100%',
        height: 160,
    },
    itemDetails: {
        padding: 16,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    propertyName: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 2,
    },
    unitName: {
        fontSize: 13,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    dividerSmall: {
        height: 1,
        marginVertical: 12,
        opacity: 0.3,
    },
    itemMetrics: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    metric: {
        alignItems: 'flex-start',
    },
    metricLabel: {
        fontSize: 10,
        marginBottom: 4,
    },
    metricValue: {
        fontSize: 15,
        fontWeight: '700',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    whatsappAction: {
        padding: 4,
    },
    saleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    saleDate: {
        fontSize: 11,
        marginLeft: 4,
    },
    emptyContainer: {
        paddingTop: 60,
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
    },
});
