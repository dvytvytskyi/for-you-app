import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';
import { usersApi } from '@/api/users';

export default function ChatInfoScreen() {
    const { theme, isDark } = useTheme();
    const router = useRouter();

    const [participantsCount, setParticipantsCount] = React.useState<number | null>(null);

    React.useEffect(() => {
        const fetchCount = async () => {
            try {
                const count = await usersApi.getInvestorsCount();
                setParticipantsCount(count > 0 ? count : 124); // Fallback to 124 if 0 or fails for now, or just show count
            } catch (e) {
                console.error(e);
            }
        };
        fetchCount();
    }, []);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
            {/* Header: < Back */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={theme.primary} />
                    <Text style={[styles.backText, { color: theme.primary }]}>Back</Text>
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Centered Logo */}
                <View style={styles.logoCircle}>
                    <Image
                        source={require('../assets/images/new logo blue.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Centered Title */}
                <Text style={[styles.title, { color: theme.text }]}>Investor Chat</Text>

                {/* Centered Participants */}
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    {participantsCount ? `${participantsCount} participants` : 'Loading...'}
                </Text>

                <View style={[styles.divider, { backgroundColor: theme.border }]} />

                {/* Description */}
                <View style={styles.descriptionSection}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>About this group</Text>
                    <Text style={[styles.description, { color: theme.textSecondary }]}>
                        Welcome to the exclusive FOR YOU Real Estate Investor Community. This group is designed for premium clients to receive first-hand information about off-market deals, luxury developments, and market insights.
                        {"\n\n"}
                        Our team of brokers is here to provide you with personalized support and answer any questions regarding the featured properties. Group participants are verified investors interested in the UAE and international real estate markets.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    backText: {
        fontSize: 15,
        fontWeight: '400',
        marginLeft: -4,
    },
    content: {
        alignItems: 'center',
        paddingTop: 40,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        marginBottom: 20,
        // Added shadow for premium look
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    logo: {
        width: 70,
        height: 70,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 30,
        textAlign: 'center',
    },
    divider: {
        width: '100%',
        height: 1,
        marginBottom: 30,
    },
    descriptionSection: {
        alignSelf: 'stretch',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
    },
});
