import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface UserProfile {
  username: string;
  email?: string;
  avatarUrl?: string;
  totalScore?: number;
  createdAt?: string;
}

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/profile');
      if (!response.ok) throw new Error('Failed to load profile');
      const data = await response.json();
      setProfile(data);
      setNewUsername(data.username || '');
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        uploadProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadProfilePicture = async (imageUri: string) => {
    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append('avatar', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      } as any);

      const response = await fetch('http://localhost:3000/api/profile/avatar', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) throw new Error('Failed to upload avatar');
      
      const data = await response.json();
      setProfile(prev => prev ? { ...prev, avatarUrl: data.avatarUrl } : null);
      Alert.alert('Success', 'Profile picture updated');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      Alert.alert('Error', 'Failed to upload profile picture');
    } finally {
      setUpdating(false);
    }
  };

  const updateUsername = async () => {
    if (!newUsername.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch('http://localhost:3000/api/profile/username', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername.trim() }),
      });

      if (!response.ok) throw new Error('Failed to update username');
      
      setProfile(prev => prev ? { ...prev, username: newUsername.trim() } : null);
      setIsEditingUsername(false);
      Alert.alert('Success', 'Username updated');
    } catch (error) {
      console.error('Error updating username:', error);
      Alert.alert('Error', 'Failed to update username');
    } finally {
      setUpdating(false);
    }
  };

  const deleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setUpdating(true);
              const response = await fetch('http://localhost:3000/api/profile', {
                method: 'DELETE',
              });

              if (!response.ok) throw new Error('Failed to delete account');
              
              Alert.alert('Success', 'Account deleted', [
                { text: 'OK', onPress: () => {
                  // Navigate to login/welcome screen
                  // This would typically navigate using expo-router
                } }
              ]);
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'Failed to delete account');
            } finally {
              setUpdating(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
      </ThemedView>
    );
  }

  if (!profile) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Failed to load profile</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <View style={styles.headerImage}>
          <IconSymbol size={80} name="person.crop.circle.fill" color="#666" />
        </View>
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Profile</ThemedText>
      </ThemedView>

      {/* Avatar Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Profile Picture</ThemedText>
        <View style={styles.avatarContainer}>
          {profile.avatarUrl ? (
            <Image
              source={{ uri: profile.avatarUrl }}
              style={styles.avatar}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <IconSymbol size={60} name="person.crop.circle" color="#999" />
            </View>
          )}
          <TouchableOpacity
            style={[styles.button, styles.uploadButton]}
            onPress={pickImage}
            disabled={updating}>
            <ThemedText style={styles.buttonText}>
              {updating ? 'Uploading...' : 'Change Photo'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Username Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Username</ThemedText>
        {!isEditingUsername ? (
          <View style={styles.usernameDisplay}>
            <ThemedText type="defaultSemiBold" style={styles.usernameText}>
              {profile.username}
            </ThemedText>
            <TouchableOpacity
              onPress={() => setIsEditingUsername(true)}
              disabled={updating}>
              <IconSymbol size={20} name="pencil.circle.fill" color="#007AFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.editContainer}>
            <TextInput
              style={[
                styles.textInput,
                { color: Colors[colorScheme ?? 'light'].text }
              ]}
              value={newUsername}
              onChangeText={setNewUsername}
              placeholder="Enter new username"
              placeholderTextColor="#999"
              maxLength={50}
              editable={!updating}
            />
            <View style={styles.editButtons}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={updateUsername}
                disabled={updating}>
                <ThemedText style={styles.buttonText}>Save</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setIsEditingUsername(false);
                  setNewUsername(profile.username);
                }}
                disabled={updating}>
                <ThemedText style={styles.buttonText}>Cancel</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ThemedView>

      {/* Account Stats */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Account Stats</ThemedText>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statLabel}>Total Score</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.statValue}>
              {profile.totalScore || 0}
            </ThemedText>
          </View>
          {profile.email && (
            <View style={styles.statItem}>
              <ThemedText style={styles.statLabel}>Email</ThemedText>
              <ThemedText style={styles.statValue}>{profile.email}</ThemedText>
            </View>
          )}
          {profile.createdAt && (
            <View style={styles.statItem}>
              <ThemedText style={styles.statLabel}>Joined</ThemedText>
              <ThemedText style={styles.statValue}>
                {new Date(profile.createdAt).toLocaleDateString()}
              </ThemedText>
            </View>
          )}
        </View>
      </ThemedView>

      {/* Danger Zone */}
      <ThemedView style={[styles.section, styles.dangerZone]}>
        <ThemedText type="subtitle" style={styles.dangerText}>Danger Zone</ThemedText>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={deleteAccount}
          disabled={updating}>
          <ThemedText style={[styles.buttonText, styles.deleteButtonText]}>
            Delete Account
          </ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.warningText}>
          This action cannot be undone. All your data will be permanently deleted.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    height: 200,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A1CEDC',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  dangerZone: {
    borderTopWidth: 1,
    borderTopColor: '#ff4444',
    paddingTop: 20,
  },
  dangerText: {
    color: '#ff4444',
    marginBottom: 12,
  },
  avatarContainer: {
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8E8E8',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  usernameDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 12,
  },
  usernameText: {
    fontSize: 18,
  },
  editContainer: {
    gap: 12,
    marginTop: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    minWidth: 150,
  },
  saveButton: {
    backgroundColor: '#34C759',
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#999',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    marginTop: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  deleteButtonText: {
    color: 'white',
  },
  warningText: {
    marginTop: 8,
    fontSize: 12,
    color: '#ff4444',
    fontStyle: 'italic',
  },
  statsContainer: {
    gap: 12,
    marginTop: 12,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 16,
  },
});
