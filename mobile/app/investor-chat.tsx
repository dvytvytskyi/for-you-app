import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SectionList,
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
    Alert,
    StatusBar,
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
    const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
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

    // Grouping messages into sections for sticky avatar effect
    const sections = React.useMemo(() => {
        const result: { title: string; senderId: string; data: ChatMessage[] }[] = [];
        if (reversedMessages.length === 0) return result;

        reversedMessages.forEach((msg) => {
            const lastSection = result[result.length - 1];
            const msgDate = new Date(msg.createdAt);

            if (lastSection && lastSection.senderId === msg.senderId) {
                const lastMsg = lastSection.data[lastSection.data.length - 1];
                const lastMsgDate = new Date(lastMsg.createdAt);
                const diff = Math.abs(differenceInMinutes(msgDate, lastMsgDate));

                if (diff < 1) {
                    lastSection.data.push(msg);
                    return;
                }
            }

            result.push({
                title: msg.senderId,
                senderId: msg.senderId,
                data: [msg],
            });
        });
        return result;
    }, [reversedMessages]);

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
            Animated.parallel([
                Animated.timing(marginAnim, {
                    toValue: e.endCoordinates.height + 10,
                    duration: 250,
                    useNativeDriver: false,
                }),
                Animated.spring(paddingAnim, {
                    toValue: 8,
                    useNativeDriver: false,
                    friction: 9,
                    tension: 50
                }),
                Animated.spring(focusAnim, {
                    toValue: 1,
                    useNativeDriver: false,
                    friction: 8,
                    tension: 40
                })
            ]).start();
        });

        const hideSubscription = Keyboard.addListener(hideEvent as any, () => {
            setIsKeyboardVisible(false);
            Animated.parallel([
                Animated.timing(marginAnim, {
                    toValue: insets.bottom > 0 ? insets.bottom : 12,
                    duration: 250,
                    useNativeDriver: false,
                }),
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
            useNativeDriver: false, // width/padding animations supported
            friction: 8,
            tension: 40
        }).start();

        // Pop effect ONLY when transitioning from empty to having text (typing)
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

    const handleDeleteMessage = async (messageId: string) => {
        Alert.alert(
            "Delete Message",
            "Are you sure you want to delete this message?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setDeletingMessageId(messageId);
                        try {
                            const success = await chatApi.deleteMessage(messageId);
                            if (success) {
                                setMessages(prev => prev.filter(m => m.id !== messageId));
                            } else {
                                Alert.alert("Error", "Could not delete message. Please try again.");
                            }
                        } catch (err) {
                            console.error("Delete error:", err);
                            Alert.alert("Error", "Something went wrong.");
                        } finally {
                            setDeletingMessageId(null);
                        }
                    }
                }
            ]
        );
    };

    const renderMessage = ({ item, index, section }: { item: ChatMessage; index: number; section: any }) => {
        const isMe = item.senderId === user?.id || item.sender.email === user?.email;

        // Cluster Logic within Section
        const isFirstInCluster = index === section.data.length - 1; // Top-most (oldest) in section
        const isLastInCluster = index === 0; // Bottom-most (newest) in section

        let marginBottom = 4; // Increased from 2
        if (isLastInCluster) {
            marginBottom = 6; // Increased from 4
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
                            source={
                                item.property.photos && item.property.photos.length > 0
                                    ? { uri: item.property.photos[0] }
                                    : require('../assets/images/new logo blue.png')
                            }
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
                {/* Space for the sticky avatar */}
                {!isMe && <View style={styles.avatarPlaceholder} />}

                <View style={styles.messageBubbleWrapper}>
                    <Pressable
                        onLongPress={() => isMe && handleDeleteMessage(item.id)}
                        delayLongPress={500}
                        style={({ pressed }) => [
                            styles.messageBubble,
                            { opacity: deletingMessageId === item.id ? 0.5 : (pressed && isMe ? 0.8 : 1) },
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
                        ]}
                    >
                        {renderBubbleContent()}
                    </Pressable>
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
        <View style={{ flex: 1, backgroundColor: isDark ? '#010312' : '#f7f9fc' }}>
            {isDark && (
                <LinearGradient
                    colors={['#010312', '#081333', '#010312']}
                    style={StyleSheet.absoluteFill}
                />
            )}
            <ImageBackground
                source={chatBgPattern}
                style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? 'transparent' : '#f7f9fc' }]}
                resizeMode="repeat"
                imageStyle={{ opacity: isDark ? 0.4 : 0.05 }}
            >
                <SafeAreaView style={[styles.container, { backgroundColor: isDark ? 'transparent' : '#FFFFFF' }]} edges={['top']}>
                    <StatusBar
                        barStyle={isDark ? 'light-content' : 'dark-content'}
                        backgroundColor={isDark ? 'transparent' : '#FFFFFF'}
                    />
                    <View style={{ flex: 1, backgroundColor: isDark ? 'transparent' : '#f7f9fc' }}>

                        <Header
                            title="Investor Chat"
                            subtitle={participantsCount ? `${participantsCount} participants` : 'Loading participants...'}
                            showLogo={true}
                            centered={true}
                            backButtonStyle={{ marginLeft: -8 }}
                            titleColor={isDark ? "#FFFFFF" : "#102F73"}
                            subtitleColor={isDark ? "rgba(255,255,255,0.7)" : "#102F73"}
                            backColor={isDark ? "#FFFFFF" : "#102F73"}
                            style={{ backgroundColor: isDark ? 'transparent' : '#FFFFFF', borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                            titleSize={16}
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
                            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
                        >
                            <SectionList
                                sections={sections}
                                renderItem={renderMessage}
                                style={{ flex: 1 }}
                                renderSectionHeader={({ section }) => {
                                    const firstMsg = section.data[0];
                                    const isMe = firstMsg.senderId === user?.id || firstMsg.sender.email === user?.email;

                                    if (isMe) return null;

                                    return (
                                        <View style={styles.stickyAvatarContainer}>
                                            <View style={styles.avatarPlaceholderSticky}>
                                                {firstMsg.sender.avatar ? (
                                                    <RNImage source={{ uri: firstMsg.sender.avatar }} style={styles.avatarImage} />
                                                ) : (
                                                    <View style={[styles.initialsCircle, { backgroundColor: '#102F73' }]}>
                                                        <Text style={styles.initialsText}>
                                                            {firstMsg.sender.firstName[0]}
                                                            {firstMsg.sender.lastName[0]}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    );
                                }}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 16, paddingTop: 8 }}
                                inverted
                                stickySectionHeadersEnabled={true}
                                showsVerticalScrollIndicator={false}
                                keyboardDismissMode={Platform.OS === 'ios' ? "interactive" : "on-drag"}
                                keyboardShouldPersistTaps="handled"
                                ListHeaderComponent={
                                    <Animated.View style={{ height: Animated.add(marginAnim, 45) }} />
                                }
                            />

                            {isDark && (
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.8)']}
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
                            )}





                            <Animated.View style={[
                                styles.inputSection,
                                {
                                    paddingBottom: isKeyboardVisible ? 0 : 0, // Reset bottom padding logic as we use marginBottom/absolute
                                    marginBottom: marginAnim,
                                    paddingHorizontal: paddingAnim
                                }
                            ]}>

                                <View style={styles.inputPodRow}>
                                    <Animated.View style={[
                                        styles.attachmentPod,
                                        {
                                            backgroundColor: isDark ? 'transparent' : '#FFFFFF',
                                            overflow: 'hidden',
                                            marginRight: focusAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [6, 2]
                                            })
                                        }
                                    ]}>
                                        {isDark && (
                                            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
                                        )}
                                        <Pressable
                                            onPress={handlePickFile}
                                            onPressIn={handleAttachPressIn}
                                            onPressOut={handleAttachPressOut}
                                            style={styles.iconButton}
                                        >
                                            <Animated.View style={{ transform: [{ scale: attachScaleAnim }] }}>
                                                <Ionicons name="attach" size={26} color={isDark ? theme.textTertiary : '#102F73'} style={{ transform: [{ rotate: '45deg' }] }} />
                                            </Animated.View>
                                        </Pressable>
                                    </Animated.View>

                                    <Animated.View style={[
                                        styles.textInputContainer,
                                        {
                                            backgroundColor: focusAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: ['rgba(255,255,255,0)', isDark ? 'rgba(0,0,0,0.5)' : '#FFFFFF']
                                            }),
                                            borderColor: focusAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.1)'] // Add border when merged
                                            }),
                                            borderWidth: 1,
                                            borderRadius: 21,
                                            overflow: 'hidden',
                                        }
                                    ]}>
                                        <Animated.View style={[
                                            styles.textInputPod,
                                            {
                                                backgroundColor: focusAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [isDark ? 'rgba(0,0,0,0.5)' : '#FFFFFF', 'rgba(255,255,255,0)']
                                                }),
                                                borderColor: focusAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0)']
                                                }),
                                                marginRight: 0, // Removed animated margin as parent padding (12px) is sufficient
                                            }
                                        ]}>
                                            {isDark && (
                                                <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
                                            )}
                                            <AnimatedTextInput
                                                style={[
                                                    styles.input,
                                                    {
                                                        flex: 1,
                                                        color: isDark ? theme.text : '#010312',
                                                        paddingRight: 10
                                                    }
                                                ]}
                                                placeholder="Type a message..."
                                                placeholderTextColor={isDark ? theme.textTertiary : '#666666'}
                                                value={inputText}
                                                onChangeText={setInputText}
                                                multiline
                                                maxLength={1000}
                                                onFocus={() => setIsKeyboardVisible(true)} // Ensure focus triggers animation state if not caught by keyboard listener
                                            />

                                            <Animated.View
                                                style={[
                                                    styles.inlineSendButton,
                                                    {
                                                        zIndex: 100,
                                                        backgroundColor: 'transparent', // Handled by inner views
                                                        width: 44, // Fixed width
                                                        // When merged (focus=1), transform? No, let flex handle it.
                                                        // Actually, removing transforms simplify it.
                                                    }
                                                ]}
                                            >
                                                {/* Inactive Background (Grey) - Fades OUT when focused */}
                                                <Animated.View
                                                    style={[
                                                        StyleSheet.absoluteFill,
                                                        {
                                                            backgroundColor: 'transparent',
                                                            opacity: focusAnim.interpolate({
                                                                inputRange: [0, 1],
                                                                outputRange: [1, 0]
                                                            }),
                                                            borderRadius: 21,
                                                        }
                                                    ]}
                                                />

                                                {/* Active Background (Blue) - Fades IN when sends active */}
                                                <Animated.View
                                                    style={[
                                                        StyleSheet.absoluteFill,
                                                        {
                                                            backgroundColor: isDark ? 'rgba(10, 132, 255, 1)' : '#102F73',
                                                            opacity: sendAnim, // 0 -> 1 based on text
                                                            borderRadius: 21,
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
                                                            {/* Icon color interpolation */}
                                                            {/* If sendAnim > 0.5 (Active), convert to White. Else Grey */}
                                                            {/* Since color interpolation is tricky on Icons without Animated.Text/Image, we can swap View opacity? */}
                                                            {/* Or just use a conditional re-render or setNativeProps? No. */}
                                                            {/* Simplest: Two icons on top of each other. */}

                                                            <View>
                                                                {/* Gray Icon (Default) */}
                                                                <Animated.View style={{ opacity: sendAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }}>
                                                                    <Ionicons
                                                                        name="send" // Use generic send
                                                                        size={18}
                                                                        color={isDark ? theme.textTertiary : '#8E8E93'}
                                                                    />
                                                                </Animated.View>
                                                                {/* White Icon (Active) */}
                                                                <Animated.View style={[StyleSheet.absoluteFill, { opacity: sendAnim }]}>
                                                                    <Ionicons
                                                                        name="send"
                                                                        size={18}
                                                                        color="#FFFFFF"
                                                                    />
                                                                </Animated.View>
                                                            </View>

                                                        </Animated.View>
                                                    )}
                                                </Pressable>
                                            </Animated.View>
                                        </Animated.View>
                                    </Animated.View>
                                </View>
                            </Animated.View>
                        </KeyboardAvoidingView>
                        {!isDark && (
                            <LinearGradient
                                colors={['rgba(247, 249, 252, 0)', '#f7f9fc']}
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    height: 60,
                                    zIndex: 15, // Below inputSection (20) but above list
                                }}
                                pointerEvents="none"
                            />
                        )}
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
        backgroundColor: 'transparent',
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
    stickyAvatarContainer: {
        width: '100%',
        height: 1, // Minimal height to help sticky engine
        flexDirection: 'row',
        zIndex: 100,
        pointerEvents: 'none',
    },
    avatarPlaceholderSticky: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 8,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 8, // Just above the margin of the item
        left: 0,
    },
    messageBubbleWrapper: {
        // Removed flex: 1 to allow dynamic width
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
        borderRadius: 16,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
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
        marginTop: 2, // Increased gap from 0
        marginRight: -4, // Shifted to the right by 4px
        marginBottom: 2,
        lineHeight: 10,
    },
    messageImage: {
        maxWidth: width * 0.7,
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
        width: width * 0.7, // Changed from maxWidth to fixed width for stability
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
        // Gap removed to handle via margin
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
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    inlineSendButton: {
        width: 48,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
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
        paddingTop: Platform.OS === 'ios' ? 6 : 7,
        paddingBottom: Platform.OS === 'ios' ? 12 : 7,
        textAlignVertical: 'center',
    },
    iconButton: {
        padding: 4,
    },
});
