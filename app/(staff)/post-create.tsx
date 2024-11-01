import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  SafeAreaView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Stack } from 'expo-router';


const CreateBlogScreen = () => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    content: '',
    image: null
  });

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Yêu Cầu Quyền Truy Cập', 'Vui lòng cho phép truy cập thư viện ảnh');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0].uri });
    }
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.title.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề');
      return;
    }

    if (!formData.location.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập vị trí');
      return;
    }

    if (!formData.content.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung');
      return;
    }

    console.log('Form Data:', formData);
    Alert.alert('Thành Công', 'Đã tạo bài viết thành công!');
    
    // Reset form
    setFormData({
      title: '',
      location: '',
      content: '',
      image: null
    });
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Tạo Bài Viết Mới",
          headerTitleStyle: {
            fontSize: 18,
          },
        }} 
      />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.formContainer}>
            {/* Image Upload Section */}
            <TouchableOpacity 
              style={styles.imageUploadContainer} 
              onPress={pickImage}
            >
              {formData.image ? (
                <Image 
                  source={{ uri: formData.image }} 
                  style={styles.uploadedImage}
                />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Text style={styles.uploadText}>Chạm để Tải Ảnh lên</Text>
                  <Text style={styles.uploadSubtext}>(Không bắt buộc)</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Title Input */}
            <Text style={styles.label}>Tiêu Đề *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="Nhập tiêu đề bài viết"
              placeholderTextColor="#a0aec0"
            />

            {/* Location Input */}
            <Text style={styles.label}>Lịch Sử *</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
              placeholder="Nhập lịch sử "
              placeholderTextColor="#a0aec0"
            />

            {/* Content Input */}
            <Text style={styles.label}>Nội Dung *</Text>
            <TextInput
              style={[styles.input, styles.contentInput]}
              value={formData.content}
              onChangeText={(text) => setFormData({ ...formData, content: text })}
              placeholder="Nhập nội dung bài viết"
              placeholderTextColor="#a0aec0"
              multiline
              textAlignVertical="top"
            />

            {/* Submit Button */}
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Tạo Bài Viết</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  imageUploadContainer: {
    height: 200,
    backgroundColor: '#edf2f7',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    color: '#4a5568',
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#718096',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2d3748',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2d3748',
    marginBottom: 16,
  },
  contentInput: {
    height: 200,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4a5568',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateBlogScreen;