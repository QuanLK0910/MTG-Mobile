import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getScheduleDetailById } from '../../Services/scheduledetail';
import { checkAttendanceForStaff } from '../../Services/attendance';

interface ScheduleDetail {
  attendanceStaff: {
    accountId: number;
    staffName: string;
    startTime: string;
    endTime: string;
    date: string;
    status: number;
    attendanceId: number;
  };
  scheduleDetail: {
    scheduleDetailId: number;
    taskId: number;
    description: string;
    serviceName: string;
    status: number;
  };
}

export default function WeeklyTaskDetail() {
  const { accountId, scheduleDetailId } = useLocalSearchParams();
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [scheduleDetail, setScheduleDetail] = useState<ScheduleDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScheduleDetail = async () => {
      try {
        console.log('Fetching with params:', { accountId, scheduleDetailId });
        
        const detail = await getScheduleDetailById(
          parseInt(accountId as string), 
          parseInt(scheduleDetailId as string)
        );
        
        console.log('Fetched detail:', detail);
        
        if (detail) {
          if (detail.attendanceStaff.status === 1) {
            router.replace({
              pathname: '/weekly-task-detail',
              params: {
                accountId: accountId.toString(),
                scheduleDetailId: scheduleDetailId.toString()
              }
            });
            return;
          }
          setScheduleDetail(detail);
        } else {
          Alert.alert('Lỗi', 'Không thể tải thông tin công việc');
          router.back();
        }
      } catch (error) {
        console.error('Failed to fetch schedule detail:', error);
        Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi tải thông tin');
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleDetail();
  }, [accountId, scheduleDetailId]);

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Show image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCheckIn = async () => {
    try {
      if (!scheduleDetail?.attendanceStaff.attendanceId || !image) {
        Alert.alert('Lỗi', 'Vui lòng chụp ảnh trước khi check-in');
        return;
      }

      await checkAttendanceForStaff(
        parseInt(accountId as string),  // staffId
        scheduleDetail.attendanceStaff.attendanceId,  // attendanceId
        image  // imagePath1
      );
      
      // Show success message
      Alert.alert(
        'Thành công',
        'Check-in thành công!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back to weekly-task-detail with params
              router.replace({
                pathname: '/weekly-task-detail',
                params: {
                  accountId: accountId.toString(),
                  scheduleDetailId: scheduleDetailId.toString()
                }
              });
            }
          }
        ]
      );
    } catch (error) {
      console.error('Check-in failed:', error);
      // Show error message
      Alert.alert(
        'Lỗi',
        'Không thể check-in. Vui lòng thử lại sau.'
      );
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yêu Cầu Check-in</Text>
      
      <View style={styles.taskCard}>
        <Text style={styles.taskNumber}>#{scheduleDetail?.scheduleDetail.scheduleDetailId}</Text>
        <Text style={styles.taskName}>{scheduleDetail?.scheduleDetail.serviceName || 'N/A'}</Text>
        <Text style={styles.taskTime}>
          {`${scheduleDetail?.attendanceStaff.startTime || 'N/A'} - ${scheduleDetail?.attendanceStaff.endTime || 'N/A'}`}
        </Text>
        <Text style={styles.taskDate}>{scheduleDetail?.attendanceStaff.date || 'N/A'}</Text>
        <View style={[styles.statusBadge, {
          backgroundColor: scheduleDetail?.attendanceStaff.status === 0 ? '#FFE4B8' : '#D1F2D9'
        }]}>
          <Text style={[styles.statusText, {
            color: scheduleDetail?.attendanceStaff.status === 0 ? '#FF9800' : '#28A745'
          }]}>
            {scheduleDetail?.attendanceStaff.status === 0 ? 'Chưa check-in' : 'Đã check-in'}
          </Text>
        </View>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>Mô tả công việc:</Text>
        <Text style={styles.descriptionText}>{scheduleDetail?.scheduleDetail.description || 'N/A'}</Text>
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Hướng dẫn check-in</Text>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionNumber}>1</Text>
          <Text style={styles.instructionText}>Đảm bảo bạn đã đến đúng địa điểm làm việc</Text>
        </View>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionNumber}>2</Text>
          <Text style={styles.instructionText}>Chụp ảnh tài liệu để xác nhận vị trí</Text>
        </View>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionNumber}>3</Text>
          <Text style={styles.instructionText}>Nhấn nút check-in để xác nhận vị trí</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.imageUploadContainer}
        onPress={() => {
          Alert.alert(
            "Chọn ảnh",
            "Bạn muốn chụp ảnh mới hay chọn ảnh từ thư viện?",
            [
              {
                text: "Chụp ảnh",
                onPress: takePhoto
              },
              {
                text: "Chọn từ thư viện",
                onPress: pickImage
              },
              {
                text: "Hủy",
                style: "cancel"
              }
            ]
          );
        }}
      >
        {image ? (
          <Image 
            source={{ uri: image }} 
            style={{ width: 200, height: 200, borderRadius: 8 }} 
          />
        ) : (
          <>
            <MaterialIcons name="camera-alt" size={48} color="#666" />
            <Text style={styles.uploadText}>Chụp ảnh xác nhận vị trí</Text>
            <Text style={styles.uploadSubText}>Nhấn để chụp ảnh hoặc chọn từ thư viện</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={[
          styles.checkInButton,
          !image && styles.checkInButtonDisabled
        ]}
        onPress={handleCheckIn}
      >
        <Text style={styles.checkInButtonText}>Check-in ngay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  taskCard: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
  },
  taskNumber: {
    color: '#666',
    marginBottom: 4,
  },
  taskName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  taskTime: {
    color: '#666',
  },
  statusBadge: {
    position: 'absolute',
    right: 16,
    top: 16,
    backgroundColor: '#FFE4B8',
    padding: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FF9800',
    fontSize: 12,
  },
  instructionsContainer: {
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionNumber: {
    backgroundColor: '#007AFF',
    color: 'white',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
    color: '#444',
  },
  imageUploadContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 24,
    marginBottom: 24,
  },
  uploadText: {
    fontSize: 16,
    marginBottom: 4,
  },
  uploadSubText: {
    color: '#666',
    fontSize: 14,
  },
  checkInButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkInButtonDisabled: {
    backgroundColor: '#ccc',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    color: '#444',
    lineHeight: 20,
  },
  taskDate: {
    color: '#666',
    marginTop: 4,
  }
});
