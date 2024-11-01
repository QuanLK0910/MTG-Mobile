import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function TaskDetails() {
  const taskDetails = {
    id: '1',
    task: 'Thay hoa',
    location: 'k10',
    time: '09:00 (01-11-2024)',
    deadline: '09:00 (05-11-2024)',
    status: 'Chờ xác nhận',
    action: 'Xác nhận',
    description: 'Cẩn thay hoa cho mộ phần',
    priority: 'Cao',
  };

  const handleConfirm = () => {
    // Xử lý hành động xác nhận
    console.log('Đã xác nhận');
  };

  const handleCancel = () => {
    // Xử lý hành động hủy
    console.log('Đã hủy');
  };

  // Function to determine the color based on priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Cao':
        return styles.highPriority;
      case 'Trung Bình':
        return styles.mediumPriority;
      case 'Thấp':
        return styles.lowPriority;
      default:
        return {};
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Chi Tiết Công Việc</Text>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Công Việc:</Text>
        <Text style={styles.value}>{taskDetails.task}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Mô Tả:</Text>
        <Text style={styles.value}>{taskDetails.description}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Địa Điểm:</Text>
        <Text style={styles.value}>{taskDetails.location}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Thời Gian:</Text>
        <Text style={styles.value}>{taskDetails.time}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Thời Hạn:</Text>
        <Text style={styles.value}>{taskDetails.deadline}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Trạng Thái:</Text>
        <Text style={styles.value}>{taskDetails.status}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Độ Ưu Tiên:</Text>
        <Text style={[styles.value, getPriorityColor(taskDetails.priority)]}>
          {taskDetails.priority}
        </Text>
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Xác nhận</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
          <Text style={styles.buttonText}>Hủy</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
  },
  value: {
    fontSize: 18,
    color: '#333',
  },
  highPriority: {
    color: 'red', // Red color for high priority
  },
  mediumPriority: {
    color: '#FFCC00', // Yellow color for medium priority
  },
  lowPriority: {
    color: 'green', // Green color for low priority
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 5, // Space between buttons
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#28a745', // Màu xanh cho nút xác nhận
  },
  cancelButton: {
    backgroundColor: '#dc3545', // Màu đỏ cho nút hủy
  },
  buttonText: {
    color: '#fff', // Màu chữ
    fontSize: 18,
    fontWeight: 'bold',
  },
});
