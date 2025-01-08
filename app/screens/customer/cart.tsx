import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { useRouter } from "expo-router";

// Updated mock data structure
const cartItems = [
  {
    id: '1',
    serviceName: 'Thay hoa lan',
    description: 'Dich vu thay hoa lan cho các mộ liệt sĩ',
    price: 283500,
    image: 'https://via.placeholder.com/100',
    doctor: 'Nguyễn Hữu An'
  },
  {
    id: '2',
    serviceName: 'Thay cây xanh tươi',
    description: 'Dich vu thay cây xanh tươi cho các mộ liệt sĩ',
    price: 189000,
    image: 'https://via.placeholder.com/100',
    doctor: 'Nguyễn Hữu An'
  },
];

export default function Cart() {
  const router = useRouter();

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.checkboxContainer}>
        <View style={styles.checkbox} />
      </View>
      <Image source={{ uri: item.image }} style={styles.serviceImage} />
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.serviceName}</Text>
        <Text style={styles.serviceDescription}>{item.description}</Text>
        <Text style={styles.servicePrice}>{item.price.toLocaleString()}đ</Text>
        <Text style={styles.doctorName}>{item.doctor}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton}>
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Giỏ hàng của bạn</Text>
        <Text style={styles.subtitle}>{cartItems.length} sản phẩm trong giỏ hàng</Text>
      </View>

      <View style={styles.tableHeader}>
        <View style={styles.checkboxContainer}>
          <View style={styles.checkbox} />
        </View>
        <Text style={[styles.columnHeader, { flex: 0.8 }]}>Hình ảnh</Text>
        <Text style={[styles.columnHeader, { flex: 2 }]}>Thông tin dịch vụ</Text>
        <Text style={[styles.columnHeader, { width: 40 }]}>Xóa</Text>
      </View>

      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalAmount}>0 đ</Text>
        </View>
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={() => router.push("/screens/customer/checkout")}
        >
          <Text style={styles.checkoutButtonText}>Thanh Toán</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  columnHeader: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
  },
  checkboxContainer: {
    width: 24,
    marginRight: 12,
    justifyContent: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff4444',
    marginTop: 4,
  },
  doctorName: {
    fontSize: 14,
    color: '#2196F3',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  deleteIcon: {
    fontSize: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
