import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { format } from 'date-fns';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

// You might want to create this type in a separate types file
type TaskDetail = {
  taskId: number;
  accountId: number;
  fullname: string;
  orderId: number;
  detailId: number;
  startDate: string;
  endDate: string;
  description: string;
  status: number;
  imagePath1: string | null;
  imagePath2: string | null;
  imagePath3: string | null;
  reason: string | null;
  serviceName: string;
  serviceDescription: string;
  categoryName: string | null;
  graveLocation: string;
};

export default function WeeklyTaskDetail() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const taskId = params.id;
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    setTask({
      taskId: 1,
      accountId: 6,
      fullname: "Staff1",
      orderId: 5,
      detailId: 8,
      startDate: "2024-11-06T22:52:04.2230387",
      endDate: "2024-11-19T00:00:00",
      description: "sdfsdf",
      status: 4,
      imagePath1: "https://firebasestorage.googleapis.com/v0/b/mtg-capstone-2024.appspot.com/o/task_images%2F2%2Fimage3.png?alt=media&token=f2c1220f-c760-41d1-adba-fa31194fe1ef",
      imagePath2: null,
      imagePath3: null,
      reason: null,
      serviceName: "Thay cây xanh tươi",
      serviceDescription: "Dịch vụ thay cây xanh tươi cho các mộ liệt sĩ",
      categoryName: null,
      graveLocation: "K1-R2-102"
    });
  }, [taskId]);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera and gallery permissions to upload images.');
      return false;
    }
    return true;
  };

  const showImageOptions = () => {
    Alert.alert(
      'Chọn ảnh',
      'Vui lòng chọn phương thức',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Chụp ảnh',
          onPress: takePhoto,
        },
        {
          text: 'Chọn từ thư viện',
          onPress: pickImage,
        },
      ]
    );
  };

  const takePhoto = async () => {
    if (!(await requestPermissions())) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    if (!(await requestPermissions())) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleComplete = async () => {
    if (!selectedImage) {
      Alert.alert('Lỗi', 'Vui lòng tải lên ảnh xác nhận trước khi hoàn thành');
      return;
    }

    Alert.alert(
      'Xác nhận hoàn thành',
      'Bạn có chắc chắn muốn hoàn thành công việc này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xác nhận',
          onPress: async () => {
            try {
              // TODO: Implement API call to complete task
              Alert.alert('Thành công', 'Công việc đã được hoàn thành!', [
                {
                  text: 'OK',
                  onPress: () => router.back(),
                },
              ]);
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể hoàn thành công việc. Vui lòng thử lại sau.');
            }
          },
        },
      ]
    );
  };

  if (!task) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Chi tiết công việc</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin chung</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Mã công việc:</Text>
              <Text style={styles.value}>{task.taskId}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Nhân viên:</Text>
              <Text style={styles.value}>{task.fullname}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Vị trí mộ:</Text>
              <Text style={styles.value}>{task.graveLocation}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chi tiết dịch vụ</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Tên dịch vụ:</Text>
              <Text style={styles.value}>{task.serviceName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Mô tả:</Text>
              <Text style={styles.value}>{task.serviceDescription}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Ghi chú:</Text>
              <Text style={styles.value}>{task.description || 'Không có'}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thời gian</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Bắt đầu:</Text>
              <Text style={styles.value}>
                {format(new Date(task.startDate), 'dd/MM/yyyy HH:mm')}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Kết thúc:</Text>
              <Text style={styles.value}>
                {format(new Date(task.endDate), 'dd/MM/yyyy HH:mm')}
              </Text>
            </View>
          </View>

          {task.imagePath1 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hình ảnh</Text>
              <Image 
                source={{ uri: task.imagePath1 }} 
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hình ảnh xác nhận</Text>
            <TouchableOpacity 
              style={styles.uploadButton} 
              onPress={showImageOptions}
            >
              {selectedImage ? (
                <View style={styles.imageContainer}>
                  <Image 
                    source={{ uri: selectedImage }} 
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => setSelectedImage(null)}
                  >
                    <MaterialIcons name="close" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons name="photo-camera" size={32} color="#666" />
                    <MaterialIcons name="photo-library" size={32} color="#666" />
                  </View>
                  <Text style={styles.uploadText}>Chụp ảnh hoặc chọn từ thư viện</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.completeButton}
          onPress={handleComplete}
        >
          <Text style={styles.completeButtonText}>Hoàn thành</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2c3e50',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    flex: 1,
    fontWeight: '500',
    color: '#666',
  },
  value: {
    flex: 2,
    color: '#333',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 4,
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  uploadButton: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  uploadText: {
    marginTop: 8,
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  completeButton: {
    width: '100%',
    padding: 16,
    backgroundColor: '#2c3e50',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
