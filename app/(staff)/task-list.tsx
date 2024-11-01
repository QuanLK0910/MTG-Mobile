import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';

// Dữ liệu mẫu nhiệm vụ (Sample task data)
const NHIEM_VU_MAU = [
  {
    id: '1',
    tieuDe: 'Kiểm Tra Khu Tưởng Niệm',
    moTa: 'Kiểm tra và ghi chép tình trạng các bia mộ tại khu tưởng niệm liệt sĩ',
    ngayDenHan: '2024-11-05',
    doUuTien: 'cao',
    trangThai: 'dangXuLy',
    diaDiem: 'Khu 20'
  },
  {
    id: '2',
    tieuDe: 'Bảo Trì Nghĩa Trang',
    moTa: 'Sửa chữa hệ thống tưới nước và làm sạch khu vực mộ',
    ngayDenHan: '2024-11-03',
    doUuTien: 'trungBinh',
    trangThai: 'chuaBatDau',
    diaDiem: 'Khu 2'
  },
  {
    id: '3',
    tieuDe: 'Cập Nhật Hồ Sơ',
    moTa: 'Số hóa và cập nhật thông tin hồ sơ liệt sĩ mới',
    ngayDenHan: '2024-11-10',
    doUuTien: 'cao',
    trangThai: 'hoantThanh',
    diaDiem: 'Khu 1'
  }
];

const TaskListScreen = () => {
  const router = useRouter();
  const [taskList, setTaskList] = useState(NHIEM_VU_MAU);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Hàm chuyển đổi trạng thái sang tiếng Việt
  const convertStatusToVietnamese = (status: string) => {
    const statusMap: Record<string, string> = {
      'chuaBatDau': 'Chưa Bắt Đầu',
      'dangXuLy': 'Đang Xử Lý',
      'hoantThanh': 'Hoàn Thành'
    };
    return statusMap[status] || status;
  };

  // Hàm lấy style badge trạng thái
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'hoantThanh': return styles.completedStatus;
      case 'dangXuLy': return styles.inProgressStatus;
      case 'chuaBatDau': return styles.pendingStatus;
      default: return styles.pendingStatus;
    }
  };

  // Render từng nhiệm vụ
  const renderTaskItem = ({ item }: { item: typeof NHIEM_VU_MAU[0] }) => (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={() => {
        router.push({
          pathname: '/task-details',
          params: { taskId: item.id }
        });
      }}
    >
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{item.tieuDe}</Text>
      </View>
      <Text style={styles.taskDescription} numberOfLines={2}>
        {item.moTa}
      </Text>
      <View style={styles.additionalInfo}>
        <Text style={styles.taskLocation}>📍 {item.diaDiem}</Text>
      </View>
      <View style={styles.taskFooter}>
        <Text style={styles.dueDate}>Đến Hạn: {item.ngayDenHan}</Text>
        <View style={[styles.statusBadge, getStatusBadgeStyle(item.trangThai)]}>
          <Text style={styles.statusText}>
            {convertStatusToVietnamese(item.trangThai)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Add this new function to filter tasks
  const getFilteredTasks = () => {
    if (selectedFilter === 'all') {
      return taskList;
    }
    return taskList.filter(task => task.trangThai === selectedFilter);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nhiệm Vụ Của Tôi</Text>
      </View>

      <View style={styles.filterContainer}>
        {[
          { id: 'all', label: 'Tất Cả' },
          { id: 'chuaBatDau', label: 'Chưa Bắt Đầu' },
          { id: 'dangXuLy', label: 'Đang Xử Lý' },
          { id: 'hoantThanh', label: 'Hoàn Thành' }
        ].map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              selectedFilter === filter.id && styles.activeFilterButton,
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === filter.id && styles.activeFilterButtonText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={getFilteredTasks()}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
  },
  activeFilterButton: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    color: '#666666',
    fontSize: 12,
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskHeader: {
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  additionalInfo: {
    marginBottom: 8,
  },
  taskLocation: {
    fontSize: 12,
    color: '#007AFF',
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 12,
    color: '#666666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedStatus: {
    backgroundColor: '#E8F5E9',
  },
  inProgressStatus: {
    backgroundColor: '#FFF3E0',
  },
  pendingStatus: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#333333',
  },
});

export default TaskListScreen;