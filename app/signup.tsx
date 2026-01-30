import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    TextInput as RNTextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

interface SignupFormData {
  username: string;
  email: string;
  avatarUri?: string;
}

export default function SignupScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setFormData(prev => ({
          ...prev,
          avatarUri: result.assets[0].uri,
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSignup = async () => {
    // Validation
    if (!formData.username.trim()) {
      Alert.alert('Error', 'Username is required');
      return;
    }
    if (formData.username.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Error', 'Valid email is required');
      return;
    }

    try {
      setLoading(true);

      // First, create the user account
      const signupResponse = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
        }),
      });

      if (!signupResponse.ok) {
        const error = await signupResponse.json();
        throw new Error(error.message || 'Signup failed');
      }

      const userData = await signupResponse.json();

      // Then upload avatar if provided
      if (selectedImage) {
        try {
          const avatarFormData = new FormData();
          avatarFormData.append('avatar', {
            uri: selectedImage,
            type: 'image/jpeg',
            name: 'avatar.jpg',
          } as any);

          const avatarResponse = await fetch('http://localhost:3000/api/profile/avatar', {
            method: 'POST',
            body: avatarFormData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (!avatarResponse.ok) {
            console.warn('Avatar upload failed, but account created successfully');
          }
        } catch (error) {
          console.warn('Avatar upload failed:', error);
        }
      }

      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to home or profile
            router.replace('/(tabs)');
          },
        },
      ]);
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <IconSymbol size={64} name="music.note" color={Colors[colorScheme ?? 'light'].tint} />
          <ThemedText type="title" style={styles.headerTitle}>
            Music Quest
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Create your profile and start your journey
          </ThemedText>
        </View>

        {/* Avatar Selection */}
        <View style={styles.section}>
          <ThemedText type="subtitle">Profile Picture (Optional)</ThemedText>
          <TouchableOpacity
            style={styles.avatarButton}
            onPress={pickImage}
            disabled={loading}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.selectedAvatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <IconSymbol size={50} name="photo" color="#999" />
                <ThemedText style={styles.avatarPlaceholderText}>Tap to select photo</ThemedText>
              </View>
            )}
          </TouchableOpacity>
          {selectedImage && (
            <TouchableOpacity
              onPress={() => {
                setSelectedImage(null);
                setFormData(prev => ({ ...prev, avatarUri: undefined }));
              }}>
              <ThemedText style={styles.removeImageText}>Remove image</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Username Input */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.inputLabel}>
            Username
          </ThemedText>
          <RNTextInput
            style={[
              styles.input,
              {
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].tint,
              },
            ]}
            placeholder="Choose a username (3+ characters)"
            placeholderTextColor="#999"
            value={formData.username}
            onChangeText={text => setFormData(prev => ({ ...prev, username: text }))}
            maxLength={50}
            editable={!loading}
            autoCapitalize="none"
          />
          <ThemedText style={styles.inputHelper}>
            {formData.username.length} / 50 characters
          </ThemedText>
        </View>

        {/* Email Input */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.inputLabel}>
            Email Address
          </ThemedText>
          <RNTextInput
            style={[
              styles.input,
              {
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].tint,
              },
            ]}
            placeholder="your.email@example.com"
            placeholderTextColor="#999"
            value={formData.email}
            onChangeText={text => setFormData(prev => ({ ...prev, email: text }))}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        {/* Submit Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.button,
              loading && styles.buttonDisabled,
            ]}
            onPress={handleSignup}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <ThemedText style={styles.buttonText}>Create Account</ThemedText>
            )}
          </TouchableOpacity>
        </View>

        {/* Info Text */}
        <View style={styles.infoSection}>
          <ThemedText style={styles.infoText}>
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitle: {
    marginTop: 16,
    fontSize: 28,
  },
  headerSubtitle: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  inputLabel: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 4,
  },
  inputHelper: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  avatarButton: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  avatarPlaceholder: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  avatarPlaceholderText: {
    marginTop: 8,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  selectedAvatar: {
    width: 150,
    height: 150,
    alignSelf: 'center',
  },
  removeImageText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    marginTop: 20,
  },
  infoText: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 18,
  },
});
