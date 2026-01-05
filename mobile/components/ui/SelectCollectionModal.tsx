import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    Pressable,
    FlatList,
    ActivityIndicator,
    Dimensions,
    Animated,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';
import { useTranslation } from '@/utils/i18n';
import { useCollectionsStore, Collection } from '@/store/collectionsStore';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface SelectCollectionModalProps {
    visible: boolean;
    onClose: () => void;
    propertyId: string;
    propertyImage?: string | null;
    onSuccess?: () => void;
}

export default function SelectCollectionModal({
    visible,
    onClose,
    propertyId,
    propertyImage,
    onSuccess
}: SelectCollectionModalProps) {
    const { theme, isDark } = useTheme();
    const { t } = useTranslation();
    const { collections, fetchCollections, addPropertyToCollection, createCollection, isLoading } = useCollectionsStore();
    const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const slideAnim = useState(new Animated.Value(SCREEN_HEIGHT))[0];
    const backdropOpacity = useState(new Animated.Value(0))[0];

    useEffect(() => {
        if (visible) {
            fetchCollections();
            Animated.parallel([
                Animated.timing(backdropOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    damping: 20,
                    stiffness: 100,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(backdropOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: SCREEN_HEIGHT,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
            setSelectedCollectionId(null);
            setIsCreating(false);
            setNewTitle('');
            setNewDescription('');
        }
    }, [visible, slideAnim, backdropOpacity, fetchCollections]);

    const handleCreateAndSelect = async () => {
        if (!newTitle.trim()) return;
        try {
            const collection = await createCollection(newTitle, newDescription);
            setSelectedCollectionId(collection.id);
            setIsCreating(false);
        } catch (error) {
            console.error('Failed to create collection:', error);
        }
    };

    const handleConfirm = async () => {
        if (!selectedCollectionId || !propertyId) return;

        setIsAdding(true);
        try {
            await addPropertyToCollection(selectedCollectionId, propertyId, propertyImage);
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to add property to collection:', error);
        } finally {
            setIsAdding(false);
        }
    };

    const renderCollectionItem = ({ item }: { item: Collection }) => {
        const isSelected = selectedCollectionId === item.id;
        return (
            <Pressable
                style={[
                    styles.collectionItem,
                    {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8F9FA',
                        borderColor: isSelected ? theme.primary : 'transparent',
                        borderWidth: 1.5
                    }
                ]}
                onPress={() => setSelectedCollectionId(item.id)}
            >
                <View style={[styles.iconBox, { backgroundColor: isSelected ? theme.primary : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)') }]}>
                    <Ionicons name="folder-open" size={20} color={isSelected ? '#FFF' : theme.textSecondary} />
                </View>
                <View style={styles.collectionInfo}>
                    <Text style={[styles.collectionTitle, { color: theme.text }]}>{item.title}</Text>
                    <Text style={[styles.collectionCount, { color: theme.textSecondary }]}>
                        {item.propertyIds.length} properties
                    </Text>
                </View>
                {isSelected && (
                    <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                )}
            </Pressable>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalOverlay}
            >
                <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                </Animated.View>

                <Animated.View
                    style={[
                        styles.modalContent,
                        {
                            backgroundColor: theme.background,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <View style={styles.dragHandleContainer}>
                        <View style={[styles.dragHandle, { backgroundColor: theme.border }]} />
                    </View>

                    <View style={styles.header}>
                        <Text style={[styles.headerTitle, { color: theme.text }]}>Add to Collection</Text>
                        <Pressable onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={theme.textSecondary} />
                        </Pressable>
                    </View>

                    {!isCreating ? (
                        <View style={styles.mainContent}>
                            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                                Choose a collection to save this property.
                            </Text>

                            {isLoading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator color={theme.primary} />
                                </View>
                            ) : (
                                <FlatList
                                    data={collections}
                                    renderItem={renderCollectionItem}
                                    keyExtractor={(item) => item.id}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={styles.listContent}
                                    ListFooterComponent={
                                        <Pressable
                                            style={[styles.createButton, { borderStyle: 'dotted', borderColor: theme.border }]}
                                            onPress={() => setIsCreating(true)}
                                        >
                                            <Ionicons name="add-circle-outline" size={24} color={theme.primary} />
                                            <Text style={[styles.createButtonText, { color: theme.primary }]}>Create New Collection</Text>
                                        </Pressable>
                                    }
                                    ListEmptyComponent={
                                        <View style={styles.emptyContainer}>
                                            <Text style={[styles.emptyText, { color: theme.textTertiary }]}>No collections yet.</Text>
                                        </View>
                                    }
                                />
                            )}

                            <Pressable
                                style={[
                                    styles.confirmButton,
                                    { backgroundColor: theme.primary, opacity: (!selectedCollectionId || isAdding) ? 0.6 : 1 }
                                ]}
                                onPress={handleConfirm}
                                disabled={!selectedCollectionId || isAdding}
                            >
                                {isAdding ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <Text style={styles.confirmButtonText}>Confirm</Text>
                                )}
                            </Pressable>
                        </View>
                    ) : (
                        <View style={styles.mainContent}>
                            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                                Enter a name and description for your new collection.
                            </Text>

                            <View style={styles.form}>
                                <View style={styles.inputBox}>
                                    <Text style={[styles.label, { color: theme.textSecondary }]}>Title</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                                        value={newTitle}
                                        onChangeText={setNewTitle}
                                        placeholder="E.g., Dream Homes"
                                        placeholderTextColor={theme.textTertiary}
                                        autoFocus
                                    />
                                </View>

                                <View style={styles.inputBox}>
                                    <Text style={[styles.label, { color: theme.textSecondary }]}>Description (Optional)</Text>
                                    <TextInput
                                        style={[styles.input, styles.textArea, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                                        value={newDescription}
                                        onChangeText={setNewDescription}
                                        placeholder="Notes about this collection..."
                                        placeholderTextColor={theme.textTertiary}
                                        multiline
                                        numberOfLines={3}
                                    />
                                </View>
                            </View>

                            <View style={styles.createActions}>
                                <Pressable
                                    style={[styles.actionButton, { backgroundColor: (isDark ? 'rgba(255,255,255,0.05)' : '#F8F9FA') }]}
                                    onPress={() => setIsCreating(false)}
                                >
                                    <Text style={[styles.actionButtonText, { color: theme.text }]}>Back</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.actionButton, { backgroundColor: theme.primary, flex: 2, opacity: !newTitle.trim() ? 0.6 : 1 }]}
                                    onPress={handleCreateAndSelect}
                                    disabled={!newTitle.trim()}
                                >
                                    <Text style={[styles.actionButtonText, { color: '#FFF' }]}>Create Collection</Text>
                                </Pressable>
                            </View>
                        </View>
                    )}
                    <View style={{ height: Platform.OS === 'ios' ? 40 : 20 }} />
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        width: '100%',
        maxHeight: SCREEN_HEIGHT * 0.8,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 12,
    },
    dragHandleContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    dragHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        opacity: 0.3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
    },
    closeButton: {
        padding: 4,
    },
    mainContent: {
        flex: 0,
        // height handled by list and inputs
    },
    subtitle: {
        fontSize: 15,
        marginBottom: 24,
        lineHeight: 22,
    },
    listContent: {
        gap: 12,
        paddingBottom: 24,
    },
    collectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        gap: 16,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    collectionInfo: {
        flex: 1,
        gap: 2,
    },
    collectionTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    collectionCount: {
        fontSize: 13,
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1.5,
        gap: 10,
        marginTop: 4,
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButton: {
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    confirmButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    loadingContainer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
    },
    form: {
        gap: 20,
        marginBottom: 32,
    },
    inputBox: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    input: {
        height: 52,
        borderRadius: 16,
        borderWidth: 1,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    createActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
