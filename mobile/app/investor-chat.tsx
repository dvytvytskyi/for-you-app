import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Image as RNImage,
    Dimensions,
    Linking,
    Keyboard,
    Animated,
    ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format, differenceInMinutes } from 'date-fns';
import { useTheme } from '@/utils/theme';
import { useAuthStore } from '@/store/authStore';
import { chatApi } from '@/api/chat';
import { usersApi } from '@/api/users';
import { ChatMessage, MessageType } from '@/types/chat';
import { Header } from '@/components/ui';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');
const chatBgPattern = require('../assets/images/chat-bg-pattern.png');
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function ChatScreen() {
    const { theme, isDark } = useTheme();
    const insets = useSafeAreaInsets();
    const user = useAuthStore((state) => state.user);
    const router = useRouter();

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [inputText, setInputText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [participantsCount, setParticipantsCount] = useState<number | null>(null);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    const paddingAnim = useRef(new Animated.Value(12)).current;
    const marginAnim = useRef(new Animated.Value(insets.bottom > 0 ? insets.bottom : 12)).current;
    const sendAnim = useRef(new Animated.Value(0)).current;
    const focusAnim = useRef(new Animated.Value(0)).current;
    const iconScaleAnim = useRef(new Animated.Value(1)).current;
    const attachScaleAnim = useRef(new Animated.Value(1)).current;
    const wasEmpty = useRef(true);

    const flatListRef = useRef<FlatList>(null);
    const reversedMessages = React.useMemo(() => [...messages].reverse(), [messages]);

    // Fetch participants count (placeholder for real backend call)
    const fetchParticipantsCount = async () => {
        try {
            const count = await usersApi.getInvestorsCount();
            if (count > 0) {
                setParticipantsCount(count);
            }
        } catch (error) {
            console.error('Error fetching participants count:', error);
        }
    };

    // Keyboard listeners & Initial fetch
    useEffect(() => {
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const showSubscription = Keyboard.addListener(showEvent as any, (e: any) => {
            setIsKeyboardVisible(true);
            const keyboardHeight = e.endCoordinates.height;

            Animated.parallel([
                // Follow keyboard upward immediately
                Animated.timing(marginAnim, {
                    toValue: keyboardHeight + 8,
                    duration: 250, // Match typical keyboard duration
                    useNativeDriver: false,
                }),
                // Wait slightly then expand horizontally and integrate button
                Animated.sequence([
                    Animated.delay(100),
                    Animated.parallel([
                        Animated.spring(paddingAnim, {
                            toValue: 4,
                            useNativeDriver: false,
                            friction: 6,
                            tension: 30
                        }),
                        Animated.spring(focusAnim, {
                            toValue: 1,
                            useNativeDriver: false,
                            friction: 7,
                            tension: 35
                        })
                    ])
                ])
            ]).start();
        });

        const hideSubscription = Keyboard.addListener(hideEvent as any, () => {
            setIsKeyboardVisible(false);
            Animated.parallel([
                // Contract quickly
                Animated.spring(paddingAnim, {
                    toValue: 12,
                    useNativeDriver: false,
                    friction: 9,
                    tension: 50
                }),
                Animated.spring(focusAnim, {
                    toValue: 0,
                    useNativeDriver: false,
                    friction: 8,
                    tension: 40
                }),
                // Return to bottom position
                Animated.spring(marginAnim, {
                    toValue: insets.bottom > 0 ? insets.bottom : 12,
                    useNativeDriver: false,
                    friction: 8,
                    tension: 40
                })
            ]).start();
        });

        fetchMessages();
        fetchParticipantsCount();
        const interval = setInterval(fetchMessages, 4000); // 4 seconds polling

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
            clearInterval(interval);
        };
    }, [insets.bottom]);

    // Send button entrance and icon pop animation
    useEffect(() => {
        const hasText = inputText.trim().length > 0;

        Animated.spring(sendAnim, {
            toValue: hasText ? 1 : 0,
            useNativeDriver: false,
            friction: 8,
            tension: 40
        }).start();

        // Pop effect ONLY when transitioning from empty to having text
        if (wasEmpty.current && hasText) {
            Animated.sequence([
                Animated.spring(iconScaleAnim, {
                    toValue: 1.3,
                    useNativeDriver: true,
                    friction: 5,
                    tension: 100
                }),
                Animated.spring(iconScaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    friction: 5,
                    tension: 100
                })
            ]).start();
        }

        wasEmpty.current = !hasText;
    }, [inputText]);

    const fetchMessages = async () => {
        try {
            const data = await chatApi.getMessages();
            // Sort messages if needed, backend usually sorts by time
            setMessages(data);
            if (isLoading) setIsLoading(false);
        } catch (error) {
            // Log as warning to avoid RedBox in Expo
            console.warn('Chat messages fetch failed (possibly offline or server issue)');
            if (isLoading) setIsLoading(false);
        }
    };

    const handleSendText = async () => {
        if (!inputText.trim()) return;

        const textToSend = inputText.trim();
        setInputText('');
        setIsSending(true);

        try {
            await chatApi.sendMessage({
                content: textToSend,
                type: MessageType.TEXT,
            });
            fetchMessages();
        } catch (error) {
            console.error('Failed to send text message:', error);
            alert('Failed to send message');
        } finally {
            setIsSending(false);
        }
    };

    const handleAttachPressIn = () => {
        Animated.spring(attachScaleAnim, {
            toValue: 1.2,
            useNativeDriver: true,
            friction: 5,
            tension: 40
        }).start();
    };

    const handleAttachPressOut = () => {
        Animated.spring(attachScaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            friction: 5,
            tension: 40
        }).start();
    };

    const handlePickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const fileAsset = result.assets[0];
                setIsSending(true);
                try {
                    await chatApi.sendMessage({
                        type: MessageType.FILE,
                        file: {
                            uri: fileAsset.uri,
                            name: fileAsset.name,
                            type: fileAsset.mimeType || 'application/octet-stream',
                        },
                    });
                    fetchMessages();
                } catch (e) {
                    console.error('Error uploading file:', e);
                    alert('File upload failed');
                } finally {
                    setIsSending(false);
                }
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const handlePickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                setIsSending(true);
                try {
                    await chatApi.sendMessage({
                        type: MessageType.IMAGE,
                        file: {
                            uri: asset.uri,
                            name: asset.fileName || `image_${Date.now()}.jpg`,
                            type: 'image/jpeg',
                        },
                    });
                    fetchMessages();
                } catch (e) {
                    console.error('Error uploading image:', e);
                    alert('Image upload failed');
                } finally {
                    setIsSending(false);
                }
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => {
        const isMe = item.senderId === user?.id || item.sender.email === user?.email;

        const prevMessage = reversedMessages[index - 1]; // Newer message (visually below)
        const nextMessage = reversedMessages[index + 1]; // Older message (visually above)

        // Cluster Logic: 1 minute threshold
        // isLastInCluster = Bottom-most visual = Newest = has no Newer message in cluster
        const isLastInCluster = !prevMessage ||
            prevMessage.senderId !== item.senderId ||
            Math.abs(differenceInMinutes(new Date(prevMessage.createdAt), new Date(item.createdAt))) >= 1;

        // isFirstInCluster = Top-most visual = Oldest = has no Older message in cluster
        const isFirstInCluster = !nextMessage ||
            nextMessage.senderId !== item.senderId ||
            Math.abs(differenceInMinutes(new Date(item.createdAt), new Date(nextMessage.createdAt))) >= 1;

        // Calculate gap based on time difference with the PREVIOUS (newer/visually below) message
        // In inverted list, marginBottom pushes the current item away from the item below it
        let marginBottom = 0;

        if (prevMessage) {
            const isSameSender = prevMessage.senderId === item.senderId;
            const diff = Math.abs(differenceInMinutes(new Date(item.createdAt), new Date(prevMessage.createdAt)));

            if (!isSameSender) {
                marginBottom = 16;
            } else if (diff < 1) {
                marginBottom = 4;
            } else {
                marginBottom = 8;
            }
        }

        const renderBubbleContent = () => (
            <>
                {!isMe && isFirstInCluster && (
                    <Text style={[styles.senderName, { color: theme.primary, marginBottom: 4 }]}>
                        {item.sender.firstName} {item.sender.lastName}
                    </Text>
                )}

                {item.type === MessageType.TEXT && (
                    <Text style={[styles.messageText, { color: isMe ? '#FFFFFF' : theme.text }]}>
                        {item.content}
                    </Text>
                )}

                {item.type === MessageType.IMAGE && (
                    <View>
                        <Pressable onPress={() => item.fileUrl && Linking.openURL(item.fileUrl)}>
                            <RNImage
                                source={{ uri: item.fileUrl || '' }}
                                style={styles.messageImage}
                                resizeMode="cover"
                            />
                        </Pressable>
                        {item.content && (
                            <Text style={[styles.messageText, { color: isMe ? '#FFFFFF' : theme.text, marginTop: 8 }]}>
                                {item.content}
                            </Text>
                        )}
                    </View>
                )}

                {item.type === MessageType.FILE && (
                    <Pressable
                        onPress={() => item.fileUrl && Linking.openURL(item.fileUrl)}
                        style={styles.fileContainer}
                    >
                        <Ionicons name="document-outline" size={32} color={isMe ? '#FFFFFF' : theme.primary} />
                        <View style={styles.fileInfo}>
                            <Text style={[styles.fileName, { color: isMe ? '#FFFFFF' : theme.text }]} numberOfLines={1}>
                                {item.fileName || 'Document'}
                            </Text>
                            <Text style={[styles.fileSize, { color: isMe ? '#FFFFFF99' : theme.textSecondary }]}>
                                Tap to open
                            </Text>
                        </View>
                    </Pressable>
                )}

                {item.type === MessageType.PROJECT && item.property && (
                    <Pressable
                        onPress={() => router.push(`/property/${item.property?.id}`)}
                        style={[styles.projectCard, { backgroundColor: 'transparent' }]}
                    >
                        <RNImage
                            source={{ uri: item.property.photos[0] }}
                            style={styles.projectImage}
                            resizeMode="cover"
                        />
                        <View style={styles.projectDetails}>
                            <View style={styles.projectTextContent}>
                                <Text style={[styles.projectName, { color: isMe ? '#FFFFFF' : theme.text }]} numberOfLines={2}>
                                    {item.property.name}
                                </Text>

                                <Text style={[styles.projectPrice, { color: isMe ? '#FFFFFF' : theme.primary }]}>
                                    {item.property.price || item.property.priceFrom
                                        ? `$ ${Math.floor(item.property.price || item.property.priceFrom || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`
                                        : 'Price on request'}
                                </Text>

                                <Text style={[styles.projectCta, { color: isMe ? '#FFFFFF99' : theme.textSecondary }]}>
                                    tap to view project
                                </Text>
                            </View>
                        </View>
                    </Pressable>
                )}

                <Text style={[styles.messageTime, { color: isMe ? '#FFFFFFB3' : theme.textSecondary }]}>
                    {format(new Date(item.createdAt), 'HH:mm')}
                </Text>
            </>
        );

        return (
            <View style={[
                styles.messageContainer,
                isMe ? styles.myMessageContainer : styles.theirMessageContainer,
                { marginBottom }
            ]}>
                {!isMe && (
                    <View style={styles.avatarPlaceholder}>
                        {isLastInCluster ? (
                            item.sender.avatar ? (
                                <RNImage source={{ uri: item.sender.avatar }} style={styles.avatarImage} />
                            ) : (
                                <View style={[styles.initialsCircle, { backgroundColor: theme.primary }]}>
                                    <Text style={styles.initialsText}>{item.sender.firstName[0]}{item.sender.lastName[0]}</Text>
                                </View>
                            )
                        ) : null}
                    </View>
                )}

                <View style={styles.messageBubbleWrapper}>
                    <View style={[
                        styles.messageBubble,
                        isMe ? [
                            styles.myMessageBubble,
                            {
                                backgroundColor: '#102F73',
                                borderBottomRightRadius: isLastInCluster ? 4 : 20
                            }
                        ] : [
                            styles.theirMessageBubble,
                            {
                                backgroundColor: theme.card,
                                borderColor: theme.border,
                                borderWidth: 1,
                                borderBottomLeftRadius: isLastInCluster ? 4 : 20
                            }
                        ]
                    ]}>
                        {renderBubbleContent()}
                    </View>
                </View>
            </View>
        );
    };

    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
            <ImageBackground
                source={chatBgPattern}
                style={{ flex: 1 }}
                resizeMode="repeat"
                imageStyle={{ opacity: isDark ? 0.3 : 0.05 }}
            >
                <Header
                    title="Investor Chat"
                    subtitle={participantsCount ? `${participantsCount} participants` : 'Loading participants...'}
                    showLogo={true}
                    centered={true}
                    backButtonStyle={{ marginLeft: -8 }}
                    titleColor="#FFFFFF"
                    titleSize={15}
                    onBack={() => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace('/(tabs)/home');
                        }
                    }}
                    onTitlePress={() => router.push('/chat-info')}
                />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    enabled={false}
                    style={styles.keyboardView}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <FlatList
                        ref={flatListRef}
                        data={reversedMessages}
                        renderItem={renderMessage}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 30 }}
                        inverted
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={
                            <Animated.View style={{ height: Animated.add(marginAnim, 60) }} />
                        }
                    />

                    <LinearGradient
                        colors={['transparent', isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)']}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 120,
                            zIndex: 10,
                        }}
                        pointerEvents="none"
                    />





                    <Animated.View style={[
                        styles.inputSection,
                        {
                            marginBottom: marginAnim,
                            paddingHorizontal: paddingAnim
                        }
                    ]}>
                        <View style={styles.inputPodRow}>
                            <BlurView intensity={isDark ? 40 : 60} tint={isDark ? 'dark' : 'light'} style={styles.attachmentPod}>
                                <Pressable
                                    onPress={handlePickFile}
                                    onPressIn={handleAttachPressIn}
                                    onPressOut={handleAttachPressOut}
                                    style={styles.iconButton}
                                >
                                    <Animated.View style={{ transform: [{ scale: attachScaleAnim }] }}>
                                        <Ionicons name="attach" size={26} color={theme.textTertiary} style={{ transform: [{ rotate: '45deg' }] }} />
                                    </Animated.View>
                                </Pressable>
                            </BlurView>

                            <Animated.View style={[
                                styles.textInputContainer,
                                {
                                    paddingRight: focusAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [66, 0]
                                    })
                                }
                            ]}>
                                <BlurView intensity={isDark ? 40 : 60} tint={isDark ? 'dark' : 'light'} style={styles.textInputPod}>
                                    <AnimatedTextInput
                                        style={[
                                            styles.input,
                                            {
                                                color: theme.text,
                                                paddingRight: focusAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [12, 66]
                                                })
                                            }
                                        ]}
                                        placeholder="Type a message..."
                                        placeholderTextColor={theme.textTertiary}
                                        value={inputText}
                                        onChangeText={setInputText}
                                        multiline
                                        maxLength={1000}
                                    />
                                </BlurView>

                                <Animated.View
                                    style={[
                                        styles.inlineSendButton,
                                        {
                                            zIndex: 100,
                                            transform: [
                                                {
                                                    translateX: focusAnim.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, 8]
                                                    })
                                                },
                                                {
                                                    scale: focusAnim.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [1, 0.86]
                                                    })
                                                }
                                            ],
                                            // Border logic stays on container
                                            borderWidth: focusAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [1, 0]
                                            }),
                                            borderColor: 'rgba(255,255,255,0.1)',
                                            overflow: 'hidden', // Clip blur
                                            backgroundColor: 'transparent',
                                        }
                                    ]}
                                >
                                    <BlurView
                                        intensity={isDark ? 40 : 60}
                                        tint={isDark ? 'dark' : 'light'}
                                        style={StyleSheet.absoluteFill}
                                    />

                                    <Animated.View
                                        style={[
                                            StyleSheet.absoluteFill,
                                            {
                                                backgroundColor: sendAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [
                                                        'transparent',
                                                        isDark ? 'rgba(10, 132, 255, 1)' : 'rgba(16, 47, 115, 1)'
                                                    ]
                                                })
                                            }
                                        ]}
                                    />

                                    <Pressable
                                        onPress={handleSendText}
                                        style={styles.innerSendAction}
                                        disabled={!inputText.trim() || isSending}
                                    >
                                        {isSending ? (
                                            <ActivityIndicator size="small" color="#FFFFFF" />
                                        ) : (
                                            <Animated.View style={{ transform: [{ scale: iconScaleAnim }] }}>
                                                <Ionicons
                                                    name="send"
                                                    size={16}
                                                    color={inputText.trim() ? "#FFFFFF" : theme.textTertiary}
                                                />
                                            </Animated.View>
                                        )}
                                    </Pressable>
                                </Animated.View>
                            </Animated.View>
                        </View>
                    </Animated.View>
                </KeyboardAvoidingView>


            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: 8,
        paddingTop: 60, // Visual bottom (start of inverted list)
        paddingBottom: 30, // Visual top (end of inverted list)
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        maxWidth: '85%',
        alignItems: 'flex-end',
    },
    myMessageContainer: {
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse',
    },
    theirMessageContainer: {
        alignSelf: 'flex-start',
    },
    avatarPlaceholder: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 8,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    initialsCircle: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialsText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    messageBubbleWrapper: {
        flex: 1,
    },
    senderName: {
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 6,
        marginLeft: 0,
        marginTop: -3,
    },
    messageBubble: {
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 6,
        borderRadius: 20,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    myMessageBubble: {
        borderBottomRightRadius: 4,
    },
    theirMessageBubble: {
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20,
    },
    messageTime: {
        fontSize: 10,
        alignSelf: 'flex-end',
        marginTop: 0,
        marginBottom: 2,
        lineHeight: 10,
    },
    messageImage: {
        width: width * 0.6,
        height: 200,
        borderRadius: 12,
    },
    fileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
    },
    fileInfo: {
        marginLeft: 12,
        flex: 1,
    },
    fileName: {
        fontSize: 14,
        fontWeight: '600',
    },
    fileSize: {
        fontSize: 12,
        marginTop: 2,
    },
    projectCard: {
        flexDirection: 'row',
        alignItems: 'center',
        width: width * 0.68,
        paddingVertical: 4,
    },
    projectImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    projectDetails: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    projectTextContent: {
        flex: 1,
        justifyContent: 'center',
        marginRight: 8,
    },
    projectName: {
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 18,
        marginBottom: 6,
    },
    projectPrice: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 2,
    },
    projectCta: {
        fontSize: 10,
        fontWeight: '300',
        fontStyle: 'italic',
    },
    inputSection: {
        paddingHorizontal: 12,
        paddingTop: 8,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'transparent',
        zIndex: 20,
    },
    inputPodRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 6,
    },
    attachmentPod: {
        width: 42,
        height: 42,
        borderRadius: 21,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    textInputContainer: {
        flex: 1,
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    textInputPod: {
        flex: 1,
        minHeight: 42,
        maxHeight: 120,
        borderRadius: 21,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    inlineSendButton: {
        position: 'absolute',
        right: 10,
        bottom: 0,
        width: 48,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
    },
    innerSendAction: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        fontSize: 14,
        paddingLeft: 16,
        paddingTop: Platform.OS === 'ios' ? 10 : 7,
        paddingBottom: Platform.OS === 'ios' ? 8 : 7,
        textAlignVertical: 'center',
    },
    iconButton: {
        padding: 4,
    },
});
