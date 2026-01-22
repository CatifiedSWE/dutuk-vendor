# Quick Integration Guide

## Add VideoTrimmer to Your App

### Option 1: As a Standalone Screen

In your navigation file (e.g., `app/(tabs)/video-trim.tsx`):

```typescript
import React from 'react';
import { SafeAreaView } from 'react-native';
import VideoTrimmer from '../../components/VideoTrimmer';

export default function VideoTrimScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VideoTrimmer />
    </SafeAreaView>
  );
}
```

### Option 2: Inline in Existing Component

```typescript
import { showEditor } from 'react-native-video-trim';
import * as DocumentPicker from 'expo-document-picker';

const handleTrimVideo = async () => {
  // Pick video
  const result = await DocumentPicker.getDocumentAsync({
    type: 'video/*',
  });

  if (result.canceled === false && result.assets[0]) {
    // Trim video
    const trimmedPath = await showEditor(result.assets[0].uri, {
      maxDuration: 30,
      saveToPhoto: true,
    });
    
    console.log('Trimmed video saved to:', trimmedPath);
  }
};
```

### Option 3: Custom Implementation

```typescript
import React, { useState } from 'react';
import { Button, View } from 'react-native';
import { showEditor } from 'react-native-video-trim';

export default function MyComponent() {
  const [videoPath, setVideoPath] = useState(null);

  const trimVideo = async (sourceUri) => {
    try {
      const result = await showEditor(sourceUri, {
        maxDuration: 60,
        minDuration: 5,
        quality: 'high',
        saveToPhoto: true,
      });
      
      setVideoPath(result);
      // Use the trimmed video
    } catch (error) {
      console.error('Trim error:', error);
    }
  };

  return (
    <View>
      <Button title="Trim Video" onPress={() => trimVideo('file://path/to/video.mp4')} />
    </View>
  );
}
```

## Common Use Cases

### 1. Video Upload with Trim
```typescript
const uploadVideoWithTrim = async () => {
  // Pick video
  const pickerResult = await DocumentPicker.getDocumentAsync({ type: 'video/*' });
  
  if (pickerResult.canceled) return;
  
  // Trim video
  const trimmedPath = await showEditor(pickerResult.assets[0].uri, {
    maxDuration: 30,
  });
  
  // Upload trimmed video
  const formData = new FormData();
  formData.append('video', {
    uri: trimmedPath,
    type: 'video/mp4',
    name: 'video.mp4',
  });
  
  await fetch('your-api-endpoint', {
    method: 'POST',
    body: formData,
  });
};
```

### 2. Social Media Style Editor
```typescript
const socialMediaTrim = async (videoUri) => {
  return await showEditor(videoUri, {
    maxDuration: 15, // Instagram reel style
    minDuration: 3,
    quality: 'high',
    saveToPhoto: false,
    openShareSheetOnFinish: true, // Open share immediately
  });
};
```

### 3. Video Message Trim
```typescript
const trimVideoMessage = async (videoUri) => {
  return await showEditor(videoUri, {
    maxDuration: 30,
    minDuration: 1,
    quality: 'medium', // Balance size and quality
    saveToPhoto: false,
    fileName: `msg_${Date.now()}.mp4`,
  });
};
```

## Permission Handling

Add this function to handle permissions properly:

```typescript
import * as MediaLibrary from 'expo-media-library';
import { Alert, Platform } from 'react-native';

export const requestVideoPermissions = async () => {
  if (Platform.OS === 'android') {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant media library access to trim videos',
        [{ text: 'OK' }]
      );
      return false;
    }
  }
  
  return true;
};

// Use it before trimming
const handleTrim = async (videoUri) => {
  const hasPermission = await requestVideoPermissions();
  if (!hasPermission) return;
  
  await showEditor(videoUri);
};
```

## Error Handling

Always wrap video trim calls with try-catch:

```typescript
const safeTrimVideo = async (videoUri) => {
  try {
    const result = await showEditor(videoUri, {
      maxDuration: 60,
    });
    
    if (result) {
      console.log('Success:', result);
      return result;
    }
  } catch (error) {
    if (error.message.includes('cancelled')) {
      console.log('User cancelled trim');
    } else {
      console.error('Trim error:', error);
      Alert.alert('Error', 'Failed to trim video. Please try again.');
    }
  }
};
```

## Testing Checklist

- [ ] App builds successfully (`npx expo run:android` or `npx expo run:ios`)
- [ ] Can pick a video file
- [ ] Video editor opens correctly
- [ ] Can adjust trim handles
- [ ] Save button works
- [ ] Trimmed video is accessible
- [ ] Permissions are requested properly
- [ ] Error handling works

## Need Help?

- Check `/app/VIDEO_TRIM_SETUP_GUIDE.md` for detailed setup info
- View `/app/components/VideoTrimmer.tsx` for a complete working example
- See [package documentation](https://github.com/maitrungduc1410/react-native-video-trim)
