import { View, Text, StyleSheet, ScrollView, Pressable, Image, Dimensions, NativeScrollEvent, NativeSyntheticEvent, Modal, ActivityIndicator, Linking, Platform, Alert, Animated } from 'react-native';
import { WebView } from 'react-native-webview';
import { useState, useMemo, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/utils/theme';
import { useTranslation } from '@/utils/i18n';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useQuery } from '@tanstack/react-query';
import MapView from '@/components/ui/MapView';
import { projectsApi } from '@/api/projects';
import { portfolioApi } from '@/api/portfolio';
import { useAuthStore } from '@/store/authStore';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as SecureStore from 'expo-secure-store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Unit Photo with Skeleton Loader Component
const UnitPhotoWithSkeleton = ({ imageUrl, onPress }: { imageUrl: string; onPress: () => void }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const pulseAnim = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 0.7,
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

    return (
        <Pressable onPress={onPress} style={{ position: 'relative' }}>
            {/* Skeleton */}
            {!isLoaded && (
                <Animated.View style={{
                    width: 120,
                    height: 120,
                    borderRadius: 12,
                    backgroundColor: '#CCCCCC',
                    opacity: pulseAnim,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }} />
            )}

            {/* Actual Image */}
            <Image
                source={{ uri: imageUrl }}
                style={{
                    width: 120,
                    height: 120,
                    borderRadius: 12,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    opacity: isLoaded ? 1 : 0,
                }}
                onLoad={() => setIsLoaded(true)}
            />
        </Pressable>
    );
};

/**
 * ВЕРСІЯ 2.0 - ПОВНА ПРЕМІУМ СТОРІНКА
 */
export default function ProjectDetailScreen() {
    const router = useRouter();
    const { theme, isDark } = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams();
    const { user } = useAuthStore();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isImageModalVisible, setIsImageModalVisible] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewTitle, setPreviewTitle] = useState<string>('');
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);

    // Presentation Modal State (Broker Style)
    const [presentationModalVisible, setPresentationModalVisible] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const presentationSlideAnim = useRef(new Animated.Value(0)).current;
    const presentationBackdropOpacity = useRef(new Animated.Value(0)).current;

    // Presentation Modal Animation
    useEffect(() => {
        if (presentationModalVisible) {
            Animated.parallel([
                Animated.timing(presentationBackdropOpacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(presentationSlideAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    damping: 18,
                    stiffness: 120,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(presentationBackdropOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(presentationSlideAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [presentationModalVisible]);

    console.log('💎 Rendering ProjectDetailScreen FINAL v2.1 [' + new Date().getTime() + '] for ID:', id);

    const handlePreviewDocument = async (url: string, title: string, docId?: string) => {
        console.log('🚀 Preview requested:', { title, docId, url });
        try {
            setPreviewTitle(title);

            let finalUrl = url;
            let headers: Record<string, string> = {};

            // Try to get a secure download URL from backend if we have a valid ID
            if (docId) {
                try {
                    console.log('🔐 Fetching secure URL for ID:', docId);
                    const secureUrl = await portfolioApi.getDocumentDownloadUrl(docId);
                    console.log('✅ Obtained secure download URL:', secureUrl);
                    finalUrl = secureUrl;
                } catch (e) {
                    console.warn('⚠️ Failed to get secure URL:', e);
                    // Fallback check below
                }
            } else {
                console.log('⚠️ No docId provided, skipping secure URL fetch.');
            }

            // Fallback logic check
            if (finalUrl === url) {
                const isCloudinary = url.includes('cloudinary.com');
                if (isCloudinary) {
                    console.log('ℹ️ Cloudinary URL detected, skipping Auth header.');
                    headers = {}; // Ensure no auth headers for public CDN
                } else {
                    console.log('ℹ️ Using direct URL with Auth header fallback.');
                    const token = await SecureStore.getItemAsync('accessToken');
                    if (token) {
                        headers['Authorization'] = `Bearer ${token}`;
                    }
                }
            }

            if (Platform.OS === 'ios') {
                setIsLoading(true);
                setLoadingStatus('Downloading document...');

                const extension = finalUrl.split('.').pop()?.split('?')[0] || 'pdf';
                const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                const fileName = `preview_${safeTitle}.${extension}`;
                const fileUri = (FileSystem.cacheDirectory || FileSystem.documentDirectory) + fileName;

                console.log(`📥 Downloading to: ${fileUri}`);

                const downloadResult = await FileSystem.downloadAsync(finalUrl, fileUri, {
                    headers: headers
                });

                if (downloadResult.status === 200) {
                    setPreviewUrl(downloadResult.uri);
                    setIsPreviewVisible(true);
                } else {
                    console.error('Download status:', downloadResult.status);
                    throw new Error(`Download failed with status ${downloadResult.status}`);
                }
            } else {
                // Android Logic
                if (finalUrl.match(/\.(pdf|doc|docx|ppt|pptx|xls|xlsx)$/i)) {
                    setPreviewUrl(`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(finalUrl)}`);
                } else {
                    setPreviewUrl(finalUrl);
                }
                setIsPreviewVisible(true);
            }
        } catch (error) {
            console.error('Preview error:', error);
            Alert.alert('Error', 'Unable to preview document.');
        } finally {
            setIsLoading(false);
            setLoadingStatus('');
        }
    };

    // Fetch project data
    const { data: projectResponse, isLoading: isProjectLoading, error } = useQuery({
        queryKey: ['project', id],
        queryFn: async () => {
            const response = await projectsApi.getById(id as string);
            return response;
        },
        enabled: !!id,
    });

    const { data: portfolioData } = useQuery({
        queryKey: ['portfolio', user?.id],
        queryFn: async () => {
            if (!user?.id) return null;
            return portfolioApi.getPortfolio(user.id);
        },
        enabled: !!user?.id,
    });

    const baseProject = projectResponse?.data;

    const project = useMemo(() => {
        if (!baseProject) return null;
        if (portfolioData?.items) {
            const portfolioItem = portfolioData.items.find(item => item.property.id == id);
            if (portfolioItem) {
                console.log('Found Portfolio Item:', {
                    id: portfolioItem.id,
                    hasPhotos: !!portfolioItem.photos,
                    photosLength: portfolioItem.photos?.length,
                    photos: portfolioItem.photos,
                    propertyPhotos: portfolioItem.property?.photos
                });
                return {
                    ...baseProject,
                    gallery: (portfolioItem.property?.photos?.length ? portfolioItem.property.photos : baseProject.gallery) || [],
                    financials: {
                        ...baseProject.financials,
                        totalPurchase: `$${Number(portfolioItem.purchasePrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
                        estSalePrice: `$${Number(portfolioItem.estimatedSellingValue).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
                        annualCashFlow: `$${Number(portfolioItem.annualCashFlow).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
                        avgAppreciation: `${Number(portfolioItem.appreciation).toFixed(1)}%`,
                    },
                    purchasedUnit: {
                        ...baseProject.purchasedUnit,
                        unitId: portfolioItem.unitName,
                        unitType: portfolioItem.unitType || baseProject.purchasedUnit.unitType,
                        size: portfolioItem.size || baseProject.purchasedUnit.size,
                        purchaseDate: portfolioItem.purchaseDate || baseProject.purchasedUnit.purchaseDate,
                        unitPhotos: portfolioItem.photos || [],
                        floorPlans: portfolioItem.floorPlans || baseProject.purchasedUnit.floorPlans,
                        documents: portfolioItem.documents?.map((doc, idx) => ({
                            id: doc.id, // Only use real ID from backend
                            title: doc.name,
                            description: doc.description || '',
                            fileUrl: doc.url
                        })) || baseProject.purchasedUnit.documents,
                    }
                };
            }
        }
        return baseProject;
    }, [baseProject, portfolioData, id]);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
        setCurrentImageIndex(index);
    };

    const handleGeneratePdf = async () => {
        if (!id || !project) return;
        try {
            // ДІАГНОСТИКА: Дивимось що за ID ми маємо
            console.log('💎 PROJECT DATA FOR PDF:', JSON.stringify({
                projectId: project.id,
                purchasedUnitId: project.purchasedUnit?.unitId,
                allData: project
            }, null, 2));

            setIsGenerating(true);
            setLoadingStatus('Preparing presentation...');

            // Використовуємо ID саме з об'єкта проекту, якщо він там відрізняється
            const targetId = project.id;
            const pdfUrl = portfolioApi.getPortfolioPdfUrl(targetId);

            console.log('🚀 CALLING PDF URL:', pdfUrl);
            const fileName = `portfolio-presentation-${id}.pdf`;
            const fileUri = (FileSystem.documentDirectory || FileSystem.cacheDirectory) + fileName;

            // Get token for auth
            const token = await SecureStore.getItemAsync('accessToken');
            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            console.log(`📥 Downloading PDF to: ${fileUri}`);

            const downloadResult = await FileSystem.downloadAsync(pdfUrl, fileUri, {
                headers: headers
            });

            console.log('📊 PDF Download status:', downloadResult.status);

            if (downloadResult.status === 200) {
                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(downloadResult.uri, {
                        mimeType: 'application/pdf',
                        dialogTitle: 'Download Presentation'
                    });
                } else {
                    Alert.alert('Sharing Not Available', 'Sharing is not available on this device');
                }
            } else {
                throw new Error(`Failed to generate PDF (Status: ${downloadResult.status})`);
            }
        } catch (e: any) {
            console.error('PDF Generation Error:', e);
            Alert.alert('Error', e.message || 'Unable to generate presentation PDF.');
        } finally {
            setIsGenerating(false);
            setLoadingStatus('');
            setPresentationModalVisible(false);
        }
    };

    const handleGetInfo = () => {
        const message = `I would like to get info about: ${project?.name}`;
        const whatsappUrl = `https://wa.me/971585252877?text=${encodeURIComponent(message)}`;
        Linking.openURL(whatsappUrl);
    };

    const handleDownloadDocument = async (url: string, title: string, docId?: string) => {
        try {
            console.log('📥 Download started:', { title, docId, url });
            setIsLoading(true);
            setLoadingStatus(`Downloading ${title}...`);

            let finalUrl = url;
            let headers: Record<string, string> = {};

            if (docId) {
                try {
                    const secureUrl = await portfolioApi.getDocumentDownloadUrl(docId);
                    finalUrl = secureUrl;
                } catch (e) {
                    console.warn('⚠️ Failed to get secure URL:', e);
                }
            }

            if (finalUrl === url && !url.includes('cloudinary.com')) {
                const token = await SecureStore.getItemAsync('accessToken');
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
            }

            // 1. Download to a temporary file first to check headers
            const tempFileName = `temp_${Date.now()}`;
            const tempUri = (FileSystem.cacheDirectory || FileSystem.documentDirectory) + tempFileName;

            const downloadResult = await FileSystem.downloadAsync(finalUrl, tempUri, {
                headers: headers
            });

            if (downloadResult.status !== 200) {
                throw new Error(`Download failed with status ${downloadResult.status}`);
            }

            // 2. Determine correct extension
            const serverMimeType = (downloadResult.headers['Content-Type'] || downloadResult.headers['content-type'] || '').toLowerCase();
            const lowerUrl = url.toLowerCase();
            const lowerTitle = title.toLowerCase();

            console.log('📊 Detection info:', { serverMimeType, url: lowerUrl, title: lowerTitle });

            let extension = 'pdf'; // Default

            // Priority 1: Content-Type from server
            if (serverMimeType.includes('csv')) extension = 'csv';
            else if (serverMimeType.includes('excel') || serverMimeType.includes('spreadsheetml') || serverMimeType.includes('officedocument.spreadsheetml')) extension = 'xlsx';
            else if (serverMimeType.includes('word') || serverMimeType.includes('officedocument.word')) extension = 'docx';
            else if (serverMimeType.includes('image/jpeg')) extension = 'jpg';
            else if (serverMimeType.includes('image/png')) extension = 'png';
            else if (serverMimeType.includes('text/plain')) extension = 'txt';

            // Priority 2: Check URL for common extensions
            if (extension === 'pdf') {
                if (lowerUrl.includes('.csv')) extension = 'csv';
                else if (lowerUrl.includes('.xlsx')) extension = 'xlsx';
                else if (lowerUrl.includes('.docx')) extension = 'docx';
                else if (lowerUrl.includes('.jpg') || lowerUrl.includes('.jpeg')) extension = 'jpg';
                else if (lowerUrl.includes('.png')) extension = 'png';
            }

            // Priority 3: Keyword in title (user hint)
            if (extension === 'pdf') {
                if (lowerTitle.includes('csv')) extension = 'csv';
                else if (lowerTitle.includes('excel') || lowerTitle.includes('table')) extension = 'xlsx';
            }

            // 3. Move to final destination with correct extension
            const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            // Ensure we don't end up with double extensions like file.pdf.pdf
            const finalFileName = safeTitle.endsWith(`.${extension}`) ? safeTitle : `${safeTitle}.${extension}`;
            const finalUri = (FileSystem.documentDirectory || FileSystem.cacheDirectory) + finalFileName;

            // Delete existing if any to avoid conflicts
            try { await FileSystem.deleteAsync(finalUri, { idempotent: true }); } catch (e) { }

            await FileSystem.moveAsync({
                from: tempUri,
                to: finalUri
            });

            console.log(`✅ File ready: ${finalUri} (Ext: ${extension})`);

            // 4. Share/Save
            if (await Sharing.isAvailableAsync()) {
                // IMPORTANT: On iOS, NOT passing mimeType helps the OS use the file extension correctly
                await Sharing.shareAsync(finalUri, {
                    dialogTitle: `Save ${title}`,
                    UTI: extension === 'pdf' ? 'com.adobe.pdf' : (extension === 'csv' ? 'public.comma-separated-values-text' : undefined)
                });
            } else {
                Alert.alert('Sharing Not Available', 'Sharing is not available on this device');
            }

        } catch (e: any) {
            console.error('Error downloading document:', e);
            Alert.alert('Download Error', e.message || 'Failed to download document. Please try again.');
        } finally {
            setIsLoading(false);
            setLoadingStatus('');
        }
    };

    if (isProjectLoading) return <View style={styles.center}><ActivityIndicator size="large" color={theme.primary} /></View>;
    if (error || !project) return <View style={styles.center}><Text>Failed to load project</Text></View>;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar style={isDark ? "light" : "dark"} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
            >
                {/* 1. High-End Gallery */}
                <View style={styles.galleryContainer}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        {(() => {
                            const validImages = project.gallery?.filter(img =>
                                typeof img === 'string' && img.length > 5 && (img.startsWith('http') || img.startsWith('data:'))
                            ) || [];

                            console.log('🖼️ Project Gallery:', {
                                originalCount: project.gallery?.length,
                                validCount: validImages.length,
                                firstImage: validImages[0]
                            });

                            if (validImages.length === 0) {
                                return (
                                    <View style={[styles.galleryImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.card }]}>
                                        <Image
                                            source={require('@/assets/images/new logo blue.png')}
                                            style={{ width: 120, height: 120, opacity: 0.5 }}
                                            resizeMode="contain"
                                        />
                                    </View>
                                );
                            }

                            return validImages.map((img, index) => (
                                <Image key={index} source={{ uri: img }} style={styles.galleryImage} />
                            ));
                        })()}
                    </ScrollView>

                    <LinearGradient
                        colors={['rgba(0,0,0,0.6)', 'transparent']}
                        style={[styles.topGradient, { height: insets.top + 60 }]}
                    />

                    <Pressable
                        onPress={() => router.back()}
                        style={[styles.backButton, { top: insets.top + 10 }]}
                    >
                        <BlurView intensity={30} tint="dark" style={styles.blurIcon}>
                            <Ionicons name="chevron-back" size={24} color="#FFF" />
                        </BlurView>
                    </Pressable>

                    <View style={styles.pagination}>
                        {project.gallery.slice(0, 8).map((_, i) => (
                            <View key={i} style={[styles.dot,
                            {
                                backgroundColor: i === currentImageIndex ? '#FFF' : 'rgba(255,255,255,0.4)',
                                width: i === currentImageIndex ? 20 : 6
                            }]} />
                        ))}
                    </View>
                </View>

                {/* 2. Project Meta */}
                <View style={styles.content}>
                    <Text style={[styles.projectName, { color: theme.text }]}>{project.name}</Text>
                    <Text style={[styles.locationText, { color: theme.textTertiary }]}>{project.location}</Text>

                    <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : theme.border }]} />

                    {/* 3. Financial Analytics Grid */}
                    <Text style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: theme.textTertiary,
                        marginBottom: 12,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5
                    }}>
                        Portfolio Insights
                    </Text>
                    <View style={styles.analyticsGrid}>
                        <View style={[styles.analyticsCard, { backgroundColor: 'transparent' }]}>
                            <Text style={[styles.analyticsLabel, { color: theme.textTertiary }]}>Total Invested</Text>
                            <Text style={[styles.analyticsValue, { color: theme.primary }]}>{project.financials.totalPurchase}</Text>
                        </View>
                        <View style={[styles.analyticsCard, { backgroundColor: 'transparent' }]}>
                            <Text style={[styles.analyticsLabel, { color: theme.textTertiary }]}>Est. Market Value</Text>
                            <Text style={[styles.analyticsValue, { color: '#2ECC71' }]}>{project.financials.estSalePrice}</Text>
                        </View>
                        <View style={[styles.analyticsCard, { backgroundColor: 'transparent' }]}>
                            <Text style={[styles.analyticsLabel, { color: theme.textTertiary }]}>Net Appreciation</Text>
                            <Text style={[styles.analyticsValue, { color: theme.text }]}>{project.financials.avgAppreciation}</Text>
                        </View>
                        <View style={[styles.analyticsCard, { backgroundColor: 'transparent' }]}>
                            <Text style={[styles.analyticsLabel, { color: theme.textTertiary }]}>Annual Yield</Text>
                            <Text style={[styles.analyticsValue, { color: theme.text }]}>{project.financials.annualCashFlow}</Text>
                        </View>

                        {/* 4.0 Unit Photos Section */}
                        {project.purchasedUnit.unitPhotos && project.purchasedUnit.unitPhotos.length > 0 && (
                            <View style={{ marginTop: 24 }}>
                                <Text style={{
                                    fontSize: 12,
                                    fontWeight: '600',
                                    color: theme.textTertiary,
                                    marginBottom: 12,
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5
                                }}>
                                    Unit Photos
                                </Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                                    {project.purchasedUnit.unitPhotos.map((img, index) => (
                                        <UnitPhotoWithSkeleton
                                            key={index}
                                            imageUrl={img}
                                            onPress={() => { setSelectedImage(img); setIsImageModalVisible(true); }}
                                        />
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>

                    {/* 4. Unit Specifications with Layout on the right */}
                    <View style={[styles.unitBox, {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8F9FA',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }]}>
                        <View style={{ flex: 1, marginRight: 15 }}>
                            <View style={styles.unitHeader}>
                                <Ionicons name="business" size={20} color={theme.primary} />
                                <Text style={[styles.unitTitle, { color: theme.text }]}>Unit {project.purchasedUnit.unitId}</Text>
                            </View>
                            <View style={styles.unitDetails}>
                                <Text style={[styles.unitInfo, { color: theme.textSecondary }]}>{project.purchasedUnit.unitType} • {project.purchasedUnit.size}</Text>
                                <Text style={[styles.unitInfo, { color: theme.textSecondary }]}>Purchased: {project.purchasedUnit.purchaseDate}</Text>
                            </View>
                        </View>

                        {project.purchasedUnit.floorPlans && project.purchasedUnit.floorPlans.length > 0 && (
                            <Pressable
                                onPress={() => { setSelectedImage(project.purchasedUnit.floorPlans[0]); setIsImageModalVisible(true); }}
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 12,
                                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                    overflow: 'hidden',
                                    borderWidth: 1,
                                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                                }}
                            >
                                <Image
                                    source={{ uri: project.purchasedUnit.floorPlans[0] }}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode="cover"
                                />
                                <View style={{ position: 'absolute', bottom: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: 2 }}>
                                    <Ionicons name="expand-outline" size={12} color="#FFF" />
                                </View>
                            </Pressable>
                        )}
                    </View>


                    {/* 4.1 Documents Section */}
                    {project.purchasedUnit.documents?.length > 0 && (
                        <View style={{ marginTop: 24 }}>
                            <Text style={{
                                fontSize: 12,
                                fontWeight: '600',
                                color: theme.textTertiary,
                                marginBottom: 12,
                                textTransform: 'uppercase',
                                letterSpacing: 0.5
                            }}>
                                Documents
                            </Text>
                            <View style={{ gap: 12 }}>
                                {project.purchasedUnit.documents.map((doc, index) => (
                                    <View
                                        key={index}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8F9FA',
                                            padding: 16,
                                            borderRadius: 16,
                                            borderWidth: 1,
                                            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                                        }}
                                    >
                                        <View style={{
                                            width: 40, height: 40, borderRadius: 10,
                                            backgroundColor: theme.primary + '20',
                                            justifyContent: 'center', alignItems: 'center',
                                            marginRight: 12
                                        }}>
                                            <Ionicons name="document-text-outline" size={20} color={theme.primary} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 15, fontWeight: '600', color: theme.text, marginBottom: 2 }}>{doc.title}</Text>
                                            <Text style={{ fontSize: 13, color: theme.textSecondary }}>{doc.description || 'PDF Document'}</Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', gap: 8 }}>

                                            <Pressable
                                                onPress={() => {
                                                    if (doc.fileUrl) {
                                                        handleDownloadDocument(doc.fileUrl, doc.title, doc.id);
                                                    }
                                                }}
                                                style={({ pressed }) => ({
                                                    padding: 8,
                                                    borderRadius: 8,
                                                    backgroundColor: pressed ? 'rgba(0,0,0,0.05)' : 'transparent'
                                                })}
                                            >
                                                <Ionicons name="download-outline" size={22} color={theme.textTertiary} />
                                            </Pressable>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Document Preview Modal */}
                    <Modal
                        visible={isPreviewVisible}
                        animationType="slide"
                        presentationStyle="pageSheet"
                        onRequestClose={() => setIsPreviewVisible(false)}
                    >
                        <View style={{ flex: 1, backgroundColor: theme.background }}>
                            {/* Modal Header */}
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: 16,
                                borderBottomWidth: 1,
                                borderBottomColor: theme.border,
                                backgroundColor: theme.card
                            }}>
                                <Pressable onPress={() => setIsPreviewVisible(false)} style={{ padding: 8 }}>
                                    <Text style={{ color: theme.primary, fontSize: 16, fontWeight: '600' }}>Done</Text>
                                </Pressable>
                                <Text style={{ color: theme.text, fontSize: 16, fontWeight: '600', maxWidth: '60%' }} numberOfLines={1}>
                                    {previewTitle}
                                </Text>
                                <Pressable
                                    onPress={() => {
                                        if (previewUrl) {
                                            const openUrl = previewUrl.includes('docs.google.com')
                                                ? decodeURIComponent(previewUrl.split('url=')[1] || previewUrl)
                                                : previewUrl;
                                            Linking.openURL(openUrl);
                                        }
                                    }}
                                    style={{ padding: 8 }}
                                >
                                    <Ionicons name="share-outline" size={24} color={theme.primary} />
                                </Pressable>
                            </View>

                            {/* WebView Content */}
                            {previewUrl && (
                                <WebView
                                    source={{ uri: previewUrl }}
                                    style={{ flex: 1 }}
                                    originWhitelist={['*']}
                                    allowFileAccess={true}
                                    allowFileAccessFromFileURLs={true}
                                    startInLoadingState={true}
                                    renderLoading={() => (
                                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                                            <ActivityIndicator size="large" color={theme.primary} />
                                        </View>
                                    )}
                                    onError={(e) => console.log('WebView Error:', e.nativeEvent)}
                                />
                            )}
                        </View>
                    </Modal>

                    <Text style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: theme.textTertiary,
                        marginTop: 32,
                        marginBottom: 8,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5
                    }}>
                        About Development
                    </Text>
                    <Text style={[styles.description, { color: theme.textSecondary }]}>{project.description}</Text>

                    {/* 5. Map Location */}
                    <Text style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: theme.textTertiary,
                        marginTop: 32,
                        marginBottom: 8,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5
                    }}>
                        Location
                    </Text>
                    <View style={styles.mapContainer}>
                        <MapView
                            latitude={project.coordinates.latitude}
                            longitude={project.coordinates.longitude}
                            accessToken="pk.eyJ1IjoiYWJpZXNwYW5hIiwiYSI6ImNsb3N4NzllYzAyOWYybWw5ZzNpNXlqaHkifQ.UxlTvUuSq9L5jt0jRtRR-A"
                            styleUrl="mapbox://styles/abiespana/clsq0mcqa00ke01qw8btw21mv"
                            height={180}
                            borderRadius={20}
                        />
                    </View>
                </View>
            </ScrollView >

            {/* Bottom Floating Island */}
            < View style={{
                position: 'absolute',
                bottom: 20, // Floating from bottom: 20,
                left: 40,
                right: 40,
                borderRadius: 100,
                overflow: 'hidden',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 5,
            }
            }>
                <BlurView
                    intensity={isDark ? 30 : 50}
                    tint={isDark ? 'dark' : 'light'}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 5,
                        gap: 8,
                        backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)'
                    }}
                >
                    <Pressable
                        style={({ pressed }) => ({
                            backgroundColor: theme.primary,
                            height: 44,
                            borderRadius: 22,
                            paddingHorizontal: 20,
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: pressed ? 0.8 : 1
                        })}
                        onPress={handleGetInfo}
                    >
                        <Text style={{
                            fontSize: 13,
                            fontWeight: '600',
                            color: '#FFFFFF'
                        }}>
                            Contact Advisor
                        </Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => ({
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                            opacity: pressed || isLoading ? 0.5 : 1
                        })}
                        onPress={() => setPresentationModalVisible(true)}
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <ActivityIndicator size="small" color={theme.text} />
                        ) : (
                            <Ionicons name="document-text-outline" size={20} color={theme.text} />
                        )}
                    </Pressable>
                </BlurView>
            </View >

            {/* Loading Overlay */}
            {
                isLoading && (
                    <View style={styles.overlay}>
                        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                        <View style={[styles.loadingBox, { backgroundColor: theme.card }]}>
                            <ActivityIndicator size="large" color={theme.primary} />
                            <Text style={[styles.loadingBoxText, { color: theme.text }]}>{loadingStatus}</Text>
                        </View>
                    </View>
                )
            }
            {/* Image Preview Modal */}
            <Modal
                visible={isImageModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsImageModalVisible(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' }}>
                    <Pressable
                        style={{ position: 'absolute', top: insets.top + 20, right: 20, zIndex: 10, padding: 10 }}
                        onPress={() => setIsImageModalVisible(false)}
                    >
                        <Ionicons name="close" size={32} color="#FFF" />
                    </Pressable>

                    {selectedImage && (
                        <Image
                            source={{ uri: selectedImage }}
                            style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH * 1.5 }}
                            resizeMode="contain"
                        />
                    )}
                </View>
            </Modal>

            {/* Premium Presentation Modal (Broker Style) */}
            <Modal
                visible={presentationModalVisible}
                transparent
                animationType="none"
                onRequestClose={() => !isGenerating && setPresentationModalVisible(false)}
            >
                <Animated.View
                    style={[
                        styles.modalBackdrop,
                        {
                            opacity: presentationBackdropOpacity,
                        },
                    ]}
                >
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={() => !isGenerating && setPresentationModalVisible(false)}
                    />
                    <Animated.View
                        style={[
                            styles.modalContent,
                            {
                                backgroundColor: theme.card,
                                borderColor: theme.border,
                                transform: [
                                    {
                                        translateY: presentationSlideAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [600, 0],
                                        }),
                                    },
                                ],
                                paddingBottom: Math.max(insets.bottom, 16),
                            },
                        ]}
                    >
                        <View style={styles.dragHandleContainer}>
                            <View style={[styles.dragHandle, { backgroundColor: theme.textSecondary }]} />
                        </View>

                        <View style={{ padding: 20, paddingTop: 16, paddingBottom: 16, alignItems: 'center' }}>
                            <View style={{
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                                backgroundColor: theme.primary + '15',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 12
                            }}>
                                <Ionicons name="document-text" size={24} color={theme.primary} />
                            </View>

                            <Text style={{ fontSize: 16, fontWeight: '700', color: theme.text, marginBottom: 6, textAlign: 'center' }}>
                                Property Analytics
                            </Text>

                            <Text style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 20, textAlign: 'center', lineHeight: 20, paddingHorizontal: 8 }}>
                                {isGenerating ? 'We are creating your professional analytics report. This will take a few seconds.' : `Would you like to generate a professional PDF report for ${project?.name}?`}
                            </Text>

                            <Pressable
                                style={({ pressed }) => [
                                    styles.actionButton,
                                    {
                                        backgroundColor: theme.primary,
                                        opacity: (isGenerating || pressed) ? 0.8 : 1,
                                    }
                                ]}
                                onPress={handleGeneratePdf}
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <ActivityIndicator color="white" style={{ marginRight: 10 }} />
                                ) : (
                                    <Ionicons name="sparkles" size={18} color="white" style={{ marginRight: 8 }} />
                                )}
                                <Text style={styles.actionButtonText}>
                                    {isGenerating ? 'Generating...' : 'Generate PDF'}
                                </Text>
                            </Pressable>

                            <Pressable
                                style={{ marginTop: 12, padding: 8 }}
                                onPress={() => !isGenerating && setPresentationModalVisible(false)}
                                disabled={isGenerating}
                            >
                                <Text style={{ color: theme.textTertiary, fontSize: 14, fontWeight: '500' }}>Maybe later</Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                </Animated.View>
            </Modal>
        </View >
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    galleryContainer: { height: SCREEN_WIDTH * 0.85, position: 'relative' },
    galleryImage: { width: SCREEN_WIDTH, height: SCREEN_WIDTH * 0.85 },
    topGradient: { position: 'absolute', top: 0, left: 0, right: 0 },
    backButton: { position: 'absolute', left: 20 },
    blurIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    pagination: { position: 'absolute', bottom: 20, flexDirection: 'row', width: '100%', justifyContent: 'center', gap: 6 },
    dot: { height: 6, borderRadius: 3 },
    content: { paddingHorizontal: 16, paddingVertical: 24 },
    projectName: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
    locationText: { fontSize: 13, fontWeight: '500', marginTop: 2 },
    divider: { height: 1, marginVertical: 24, opacity: 0.5 },
    sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16, letterSpacing: -0.3 },
    analyticsGrid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 12, rowGap: 8 },
    analyticsCard: { width: (SCREEN_WIDTH - 44) / 2, paddingVertical: 12, paddingHorizontal: 0, borderRadius: 16 },
    analyticsLabel: { fontSize: 12, marginBottom: 4, fontWeight: '600' },
    analyticsValue: { fontSize: 18, fontWeight: '700' },
    unitBox: { marginTop: 24, padding: 20, borderRadius: 24 },
    unitHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
    unitTitle: { fontSize: 18, fontWeight: '700' },
    unitDetails: { gap: 4 },
    unitInfo: { fontSize: 14, fontWeight: '500' },
    description: { fontSize: 16, lineHeight: 24, opacity: 0.8 },
    mapContainer: { marginTop: 8, overflow: 'hidden' },
    // New Bottom Bar Styles

    overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    loadingBox: { padding: 30, borderRadius: 24, alignItems: 'center', width: '80%' },
    loadingBoxText: { marginTop: 16, fontSize: 16, fontWeight: '600' },

    // Modal Styles
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        width: '100%',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        overflow: 'hidden',
        borderWidth: 1,
        borderBottomWidth: 0,
    },
    dragHandleContainer: {
        alignItems: 'center',
        paddingTop: 12,
    },
    dragHandle: {
        width: 40,
        height: 5,
        borderRadius: 2.5,
        opacity: 0.2,
    },
    actionButton: {
        width: '100%',
        height: 48,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
});
