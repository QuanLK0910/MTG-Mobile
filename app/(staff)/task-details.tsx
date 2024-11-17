import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import * as ImagePicker from 'expo-image-picker';

const ChiTietNhiemVu = ({ route, navigation }: { route: any, navigation: any }) => {
  // Dữ liệu mẫu nhiệm vụ (Sample task data)
  const [nhiemVu, setNhiemVu] = useState({
    id: "1",
    tieuDe: "Kiểm Tra Khu Tưởng Niệm",
    moTa: "Kiểm tra và ghi chép tình trạng các bia mộ tại khu tưởng niệm liệt sĩ",
    ngayBatDau: "2024-10-25",
    ngayDenHan: "2024-11-05",
    doUuTien: "cao",
    trangThai: "dangXuLy",
    diaDiem: "Khu Tưởng Niệm Liệt Sĩ Trung Ương",
    nguoiThucHien: "Nguyễn Văn A",
    chiTiet: {
      yeuCauCongViec: [
        "Kiểm tra tình trạng vật lý của bia mộ",
        "Ghi chép các hư hỏng và nhu cầu sửa chữa",
        "Chụp ảnh minh chứng",
        "Báo cáo chi tiết về tình trạng",
      ],
      ghiChu: "Cần thận trọng và tôn trọng không gian tưởng niệm",
    },
  });

  const [images, setImages] = useState<string[]>([]);
  const [showImageOptions, setShowImageOptions] = useState(false);

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Cần quyền truy cập thư viện ảnh để tiếp tục!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Cần quyền truy cập camera để tiếp tục!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  // Hàm chuyển đổi trạng thái sang tiếng Việt
  const chuyenDoiTrangThai = (trangThai: string) => {
    const trangThaiMap: Record<string, string> = {
      chuaBatDau: "Chưa Bắt Đầu",
      dangXuLy: "Đang Xử Lý",
      hoantThanh: "Hoàn Thành",
    };
    return trangThaiMap[trangThai] || trangThai;
  };

  // Hàm lấy màu ưu tiên


  // Hàm lấy style badge trạng thái
  const layStyleBadgeTrangThai = (trangThai: string) => {
    switch (trangThai) {
      case "hoantThanh":
        return styles.trangThaiHoanThanh;
      case "dangXuLy":
        return styles.trangThaiDangXuLy;
      case "chuaBatDau":
        return styles.trangThaiChuaBatDau;
      default:
        return styles.trangThaiChuaBatDau;
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false, // This will hide the default header
        }}
      />

      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Thanh Điều Hướng */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi Tiết Nhiệm Vụ</Text>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContentContainer}
        >
          {/* Thẻ Nhiệm V Chính */}
          <View style={styles.taskCard}>
            <View style={styles.taskHeader}>
              <Text style={styles.taskTitle}>{nhiemVu.tieuDe}</Text>
            </View>

            {/* Thông Tin Cơ Bản */}
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Feather name="calendar" size={16} color="#666666" />
                <Text style={styles.infoText}>
                  Ngày Bắt Đầu: {nhiemVu.ngayBatDau}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Feather name="clock" size={16} color="#666666" />
                <Text style={styles.infoText}>
                  Đến Hạn: {nhiemVu.ngayDenHan}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Feather name="map-pin" size={16} color="#666666" />
                <Text style={styles.infoText}>Địa Điểm: {nhiemVu.diaDiem}</Text>
              </View>
              <View style={styles.infoRow}>
                <Feather name="user" size={16} color="#666666" />
                <Text style={styles.infoText}>
                  Người Thực Hiện: {nhiemVu.nguoiThucHien}
                </Text>
              </View>
            </View>

            {/* Trạng Thái Nhiệm Vụ */}
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusBadge,
                  layStyleBadgeTrangThai(nhiemVu.trangThai),
                ]}
              >
                <Text style={styles.statusText}>
                  {chuyenDoiTrangThai(nhiemVu.trangThai)}
                </Text>
              </View>
            </View>

            {/* Mô Tả Nhiệm Vụ */}
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Mô Tả Nhiệm Vụ</Text>
              <Text style={styles.descriptionText}>{nhiemVu.moTa}</Text>
            </View>

            {/* Ghi Chú */}
            <View style={styles.notesSection}>
              <Text style={styles.sectionTitle}>Ghi Chú</Text>
              <Text style={styles.notesText}>{nhiemVu.chiTiet.ghiChu}</Text>
            </View>

            {/* Evidence upload section - only shows when status is dangXuLy */}
            {nhiemVu.trangThai === 'dangXuLy' && (
              <View style={styles.evidenceSection}>
                <TouchableOpacity 
                  style={styles.evidenceButton}
                  onPress={() => setShowImageOptions(!showImageOptions)}
                >
                  <Feather name="camera" size={20} color="#FFFFFF" />
                  <Text style={styles.evidenceButtonText}>Thêm Hình Ảnh Minh Chứng</Text>
                </TouchableOpacity>

                {showImageOptions && (
                  <View style={styles.imageOptions}>
                    <TouchableOpacity 
                      style={styles.optionButton} 
                      onPress={takePhoto}
                    >
                      <Feather name="camera" size={20} color="#FFFFFF" />
                      <Text style={styles.optionButtonText}>Chụp ảnh</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.optionButton} 
                      onPress={pickImage}
                    >
                      <Feather name="image" size={20} color="#FFFFFF" />
                      <Text style={styles.optionButtonText}>Chọn từ thư viện</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {images.length > 0 && (
                  <ScrollView 
                    horizontal 
                    style={styles.imagePreviewScroll}
                    showsHorizontalScrollIndicator={false}
                  >
                    {images.map((uri, index) => (
                      <View key={index} style={styles.imagePreviewContainer}>
                        <Image source={{ uri }} style={styles.imagePreview} />
                        <TouchableOpacity 
                          style={styles.deleteImageButton}
                          onPress={() => {
                            const newImages = images.filter((_, i) => i !== index);
                            setImages(newImages);
                          }}
                        >
                          <Feather name="x" size={16} color="#FFF" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>
            )}

            {/* Nút Hành Động */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  /* Bắt đầu nhiệm vụ */
                }}
              >
                <Feather name="play-circle" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Từ chối</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.completeButton]}
                onPress={() => {
                  /* Hoàn thành nhiệm vụ */
                }}
              >
                <Feather name="check-circle" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>HCha</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    flex: 1,
  },
  priorityIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666666",
  },
  statusContainer: {
    alignItems: "flex-start",
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  trangThaiHoanThanh: {
    backgroundColor: "#E8F5E9",
  },
  trangThaiDangXuLy: {
    backgroundColor: "#FFF3E0",
  },
  trangThaiChuaBatDau: {
    backgroundColor: "#FFEBEE",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333333",
  },
  descriptionSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 22,
  },
  requirementsSection: {
    marginBottom: 16,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  requirementText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333333",
  },
  notesSection: {
    marginBottom: 16,
  },
  notesText: {
    fontSize: 14,
    color: "#666666",
    fontStyle: "italic",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: "center",
  },
  completeButton: {
    backgroundColor: "#4CAF50",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 8,
  },
  imageSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  imageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  imageButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  imagePreviewScroll: {
    marginTop: 16,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginRight: 12,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deleteImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  evidenceSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  evidenceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  evidenceButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
  },
  imageOptions: {
    marginTop: 12,
    gap: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  optionButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default ChiTietNhiemVu;
