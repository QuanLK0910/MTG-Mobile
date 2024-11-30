import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface PaymentMethod {
  id: string;
  name: string;
}

const CheckoutScreen = () => {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  // Example service data
  const selectedService = {
    name: "Dọn dẹp mộ",
    price: "500.000 VNĐ",
    date: "20 Tháng 3, 2024",
    time: "14:00",
  };

  const paymentMethods: PaymentMethod[] = [
    { id: 'momo', name: 'MoMo' },
    { id: 'vnpay', name: 'VNPay' },
    { id: 'wallet', name: 'Ví của tôi' },
  ];

  const handlePayment = () => {
    switch (selectedMethod) {
      case 'momo':
        // Implement MoMo payment logic
        console.log('Processing MoMo payment...');
        break;
      case 'vnpay':
        // Implement VNPay payment logic
        console.log('Processing VNPay payment...');
        break;
      case 'wallet':
        // Implement Wallet payment logic
        console.log('Processing Wallet payment...');
        break;
      default:
        console.log('Please select a payment method');
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Thanh toán</Text>
          </View>
          
          <View style={styles.serviceCard}>
            <Text style={styles.sectionTitle}>Chi tiết dịch vụ</Text>
            <View style={styles.serviceInfo}>
              <View style={styles.serviceRow}>
                <Text style={styles.serviceLabel}>Dịch vụ:</Text>
                <Text style={styles.serviceValue}>{selectedService.name}</Text>
              </View>
              
              <View style={styles.serviceRow}>
                <Text style={styles.serviceLabel}>Ngày:</Text>
                <Text style={styles.serviceValue}>{selectedService.date}</Text>
              </View>
              <View style={styles.serviceRow}>
                <Text style={styles.serviceLabel}>Giờ:</Text>
                <Text style={styles.serviceValue}>{selectedService.time}</Text>
              </View>
              <View style={[styles.serviceRow, styles.totalRow]}>
                <Text style={styles.serviceLabel}>Tổng tiền:</Text>
                <Text style={styles.totalValue}>{selectedService.price}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          <View style={styles.paymentMethods}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodCard,
                  selectedMethod === method.id && styles.selectedMethod,
                ]}
                onPress={() => setSelectedMethod(method.id)}
              >
                <Text style={styles.methodName}>{method.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.payButton,
              !selectedMethod && styles.payButtonDisabled,
            ]}
            onPress={handlePayment}
            disabled={!selectedMethod}
          >
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  paymentMethods: {
    gap: 15,
  },
  methodCard: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedMethod: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  methodName: {
    fontSize: 16,
    fontWeight: '500',
  },
  payButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  payButtonDisabled: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  serviceCard: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  serviceInfo: {
    gap: 10,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceLabel: {
    fontWeight: 'bold',
  },
  serviceValue: {
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalValue: {
    fontWeight: '500',
  },
});

export default CheckoutScreen;
