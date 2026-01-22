import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { showEditor } from 'react-native-video-trim';
import * as DocumentPicker from 'expo-document-picker';

export default function VideoTrimmer() {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [trimmedVideoPath, setTrimmedVideoPath] = useState<string | null>(null);

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setVideoUri(uri);
        Alert.alert('Success', 'Video selected! Now you can trim it.');
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error', 'Failed to pick video');
    }
  };

  const trimVideo = async () => {
    if (!videoUri) {
      Alert.alert('Error', 'Please select a video first');
      return;
    }

    try {
      const result = await showEditor(videoUri, {
        maxDuration: 60, // Maximum 60 seconds
        minDuration: 3,  // Minimum 3 seconds
        saveToPhoto: true, // Save to photo library
      });

      if (result) {
        setTrimmedVideoPath(result);
        Alert.alert(
          'Success',
          `Video trimmed successfully!\nSaved to: ${result}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      console.error('Error trimming video:', error);
      Alert.alert('Error', error?.message || 'Failed to trim video');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Video Trimmer</Text>

      <TouchableOpacity style={styles.button} onPress={pickVideo}>
        <Text style={styles.buttonText}>Select Video</Text>
      </TouchableOpacity>

      {videoUri && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Video selected ✓</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, styles.trimButton, !videoUri && styles.disabledButton]}
        onPress={trimVideo}
        disabled={!videoUri}
      >
        <Text style={styles.buttonText}>Trim Video</Text>
      </TouchableOpacity>

      {trimmedVideoPath && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Trimmed Video Path:</Text>
          <Text style={styles.resultPath}>{trimmedVideoPath}</Text>
        </View>
      )}

      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>Instructions:</Text>
        <Text style={styles.instructionsText}>1. Tap "Select Video" to choose a video</Text>
        <Text style={styles.instructionsText}>2. Tap "Trim Video" to open the editor</Text>
        <Text style={styles.instructionsText}>3. Adjust the trim handles and save</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  trimButton: {
    backgroundColor: '#34C759',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  infoText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '500',
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultPath: {
    fontSize: 12,
    color: '#666',
  },
  instructions: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
});
