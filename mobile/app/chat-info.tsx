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
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <Pressable
                    style={({ pressed }) => [
                        styles.backButton,
                        { opacity: pressed ? 0.6 : 1 }
                    ]}
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={24} color={theme.primary} />
                </Pressable>

                <Text style={[styles.headerTitle, { color: theme.text }]}>Investor Chat</Text>

                <View style={styles.backButton} />
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

                {/* Description */}
                <View style={styles.descriptionSection}>
                    <Text style={[styles.description, { color: theme.textSecondary, textAlign: 'center' }]}>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
    },
    backButton: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
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
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 4,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 13,
        fontWeight: '400',
        marginBottom: 24,
        textAlign: 'center',
    },
    divider: {
        width: '100%',
        height: 1,
        marginBottom: 24,
    },
    descriptionSection: {
        alignSelf: 'stretch',
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 8,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
    },
});
