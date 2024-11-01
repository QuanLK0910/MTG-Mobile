import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface ProfileData {
  accountId: number;
  fullName: string;
  createAt: string;
  status: boolean;
  areaId: number;
  emailAddress: string | null;
  phoneNumber: string;
  address: string | null;
  avatarPath: string;
  dateOfBirth: string | null;
  roleId: number;
}

const StaffProfile = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<ProfileData | null>(null);

  useEffect(() => {
    // Fetch profile data here
    // For now using dummy data
    setTimeout(() => {
      setProfileData({
        accountId: 1,
        fullName: "Nguyễn Văn A",
        createAt: new Date().toISOString(),
        status: true,
        areaId: 1,
        emailAddress: "nguyenvana@example.com",
        phoneNumber: "0123456789",
        address: "123 Đường Nguyễn Văn A, Quận B, TP.HCM",
        avatarPath: "https://via.placeholder.com/140",
        dateOfBirth: new Date().toISOString(),
        roleId: 3
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  // When profileData is loaded, initialize editedData
  useEffect(() => {
    if (profileData) {
      setEditedData(profileData);
    }
  }, [profileData]);

  const handleSave = async () => {
    try {
      // Add your API call here to save the changes
      // await updateProfile(editedData);
      
      setProfileData(editedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      // Add error handling here
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Đang tải thông tin...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.errorCard}>
          <Feather name="alert-circle" size={50} color="#EF4444" />
          <Text style={styles.errorTitle}>Rất tiếc!</Text>
          <Text style={styles.errorText}>Có lỗi xảy ra khi tải dữ liệu</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setIsLoading(true);
              // Add your reload logic here
            }}
          >
            <Feather name="refresh-cw" size={20} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.errorCard}>
          <Feather name="user-x" size={50} color="#6B7280" />
          <Text style={styles.errorTitle}>Không tìm thấy!</Text>
          <Text style={styles.errorText}>Không tìm thấy thông tin người dùng</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setIsLoading(true);
              // Add your reload logic here
            }}
          >
            <Feather name="refresh-cw" size={20} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const getRoleTitle = (roleId: number) => {
    switch(roleId) {
      case 1: return 'Quản Trị Viên';
      case 2: return 'Giám Sát';
      case 3: return 'Nhân Viên';
      default: return 'Vai Trò Không Xác Định';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.ProfileContainer}>
        <View style={styles.AvatarSection}>
          <Image 
            source={{ uri: profileData?.avatarPath }} 
            style={styles.Avatar} 
            resizeMode="cover"
          />
          <Text style={styles.FullName}>{profileData?.fullName}</Text>
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, { backgroundColor: profileData?.status ? '#10B981' : '#EF4444' }]} />
            <Text style={styles.statusText}>
              {profileData?.status ? 'Đang Hoạt Động' : 'Không Hoạt Động'}
            </Text>
          </View>
        </View>
        
        <View style={styles.InfoSection}>
          <View style={styles.DetailRow}>
            <Text style={styles.Label}>Mã Nhân Viên:</Text>
            <Text style={styles.Value}>#{profileData?.accountId}</Text>
          </View>

          <View style={styles.DetailRow}>
            <Text style={styles.Label}>Vai Trò:</Text>
            <Text style={styles.Value}>{getRoleTitle(profileData?.roleId || 0)}</Text>
          </View>

          <View style={styles.DetailRow}>
            <Text style={styles.Label}>Khu Vực:</Text>
            <Text style={styles.Value}>Khu Vực {profileData?.areaId}</Text>
          </View>

          <View style={styles.DetailRow}>
            <Text style={styles.Label}>Họ và Tên:</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editedData?.fullName}
                onChangeText={(text) => setEditedData(prev => ({ ...prev!, fullName: text }))}
              />
            ) : (
              <Text style={styles.Value}>{profileData?.fullName}</Text>
            )}
          </View>

          <View style={styles.DetailRow}>
            <Text style={styles.Label}>Ngày Sinh:</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editedData?.dateOfBirth ? new Date(editedData.dateOfBirth).toLocaleDateString('vi-VN') : ''}
                onChangeText={(text) => setEditedData(prev => ({ ...prev!, dateOfBirth: text }))}
                placeholder="DD/MM/YYYY"
              />
            ) : (
              <Text style={styles.Value}>
                {profileData?.dateOfBirth 
                  ? new Date(profileData.dateOfBirth).toLocaleDateString('vi-VN')
                  : 'Chưa cập nhật'}
              </Text>
            )}
          </View>

          <View style={styles.DetailRow}>
            <Text style={styles.Label}>Số Điện Thoại:</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editedData?.phoneNumber}
                onChangeText={(text) => setEditedData(prev => ({ ...prev!, phoneNumber: text }))}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.Value}>{profileData?.phoneNumber}</Text>
            )}
          </View>

          <View style={styles.DetailRow}>
            <Text style={styles.Label}>Email:</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editedData?.emailAddress || ''}
                onChangeText={(text) => setEditedData(prev => ({ ...prev!, emailAddress: text }))}
                keyboardType="email-address"
                placeholder="Nhập địa chỉ email"
              />
            ) : (
              <Text style={styles.Value}>{profileData?.emailAddress || 'Chưa cập nhật'}</Text>
            )}
          </View>

          <View style={styles.DetailRow}>
            <Text style={styles.Label}>Địa Chỉ:</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editedData?.address || ''}
                onChangeText={(text) => setEditedData(prev => ({ ...prev!, address: text }))}
                multiline
                placeholder="Nhập địa chỉ"
              />
            ) : (
              <Text style={styles.Value}>{profileData?.address || 'Chưa cập nhật'}</Text>
            )}
          </View>

          <View style={styles.DetailRow}>
            <Text style={styles.Label}>Ngày Tạo:</Text>
            <Text style={styles.Value}>
              {profileData?.createAt 
                ? new Date(profileData.createAt).toLocaleDateString('vi-VN')
                : 'Không xác định'}
            </Text>
          </View>
        </View>

        {/* Edit/Save Button */}
        <TouchableOpacity
          style={[styles.actionButton, isEditing ? styles.saveButton : styles.editButton]}
          onPress={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
        >
          <Feather name={isEditing ? "check" : "edit-2"} size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>
            {isEditing ? 'Lưu Thay Đổi' : 'Chỉnh Sửa Thông Tin'}
          </Text>
        </TouchableOpacity>

        {/* Cancel Button - Only shown when editing */}
        {isEditing && (
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => {
              setEditedData(profileData);
              setIsEditing(false);
            }}
          >
            <Feather name="x" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Hủy</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  ProfileContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  AvatarSection: {
    alignItems: 'center',
    marginBottom: 20
  },
  Avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  FullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 12,
  },
  InfoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  DetailRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'center',
  },
  Label: {
    width: 120,
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  Value: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    minWidth: 200,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '500',
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    minWidth: 280,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#3B82F6',
  },
  saveButton: {
    backgroundColor: '#10B981',
  },
  cancelButton: {
    backgroundColor: '#EF4444',
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    padding: 0,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    minHeight: 30,
  },
});

export default StaffProfile;