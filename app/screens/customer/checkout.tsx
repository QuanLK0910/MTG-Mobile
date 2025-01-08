import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Platform,
  TextInput,
} from 'react-native';
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { orderService } from '../../../Services/order';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../../contexts/AuthContext';

interface PaymentMethod {
  id: string;
  name: string;
}

const CheckoutScreen = () => {
  const router = useRouter();
  const { getUserId } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [expectedDate, setExpectedDate] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Update the service data structure to match the new design
  const selectedServices = [
    {
      name: "Thay hoa lan",
      price: "283,500đ",
    },
    {
      name: "Thay cây xanh tươi",
      price: "189,000đ",
    }
  ];

  const total = "472,500đ";

  const paymentMethods: PaymentMethod[] = [
    { id: 'momo', name: 'MoMo' },
    { id: 'vnpay', name: 'VNPay' },
    { id: 'wallet', name: 'Ví của tôi' },
  ];

  // Add new state for button animation
  const [buttonScale] = useState(new Animated.Value(1));

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePayment = async () => {
    try {
      console.log('Starting payment process...');
      console.log('Selected method:', selectedMethod);
      console.log('Expected date:', expectedDate);
      console.log('Note:', note);

      setIsLoading(true);
      animateButton();

      if (!selectedMethod) {
        alert('Vui lòng chọn phương thức thanh toán');
        return;
      }

      const userId = getUserId();
      const response = await orderService.createOrder(
        userId,
        selectedMethod,
        {
          expectedCompletionDate: expectedDate,
          note: note.trim(),
        }
      );
      
      console.log('API Response:', response);

      // Navigate to success screen or show success message
      alert('Đặt hàng thành công!');
      router.push('screens/customer/orders');
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const onDateChange = (event: any, selected: Date | undefined) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (event.type === 'set' && selected) {
      setSelectedDate(selected);
      const formattedDate = selected.toLocaleDateString('vi-VN');
      setExpectedDate(formattedDate);
    }
  };

  const renderDatePicker = () => {
    return (
      <View style={styles.formGroup}>
        <Text style={styles.label}>Ngày hoàn thành dự kiến *</Text>
        <TouchableOpacity 
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.datePickerText}>
            {expectedDate || 'Chọn ngày'}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#666" />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            minimumDate={new Date()}
            locale="vi-VN"
          />
        )}
      </View>
    );
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      console.log('Current token:', token);
    };
    checkToken();
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => router.push("/screens/customer/cart")}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Thanh toán</Text>
            </View>
          </View>
          
          <View style={styles.serviceSection}>
            <Text style={styles.sectionHeader}>Dịch vụ đã chọn</Text>
            <View style={styles.serviceList}>
              <View style={styles.tableHeader}>
                <Text style={styles.productColumn}>Tên sản phẩm</Text>
                <Text style={styles.priceColumn}>Đơn giá</Text>
                <Text style={styles.deleteColumn}>Xóa</Text>
              </View>
              
              {selectedServices.map((service, index) => (
                <View key={index} style={styles.serviceRow}>
                  <Text style={styles.productColumn}>{service.name}</Text>
                  <Text style={styles.priceColumn}>{service.price}</Text>
                  <TouchableOpacity style={styles.deleteColumn}>
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ))}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
                <Text style={styles.totalAmount}>{total}</Text>
              </View>
            </View>
          </View>

          <View style={styles.additionalInfo}>
            <Text style={styles.sectionHeader}>Thông tin bổ sung</Text>
            {renderDatePicker()}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Ghi chú</Text>
              <TextInput 
                style={[styles.input, styles.textArea]}
                placeholder="Nhập ghi chú cho đơn hàng (không bắt buộc)"
                multiline
                numberOfLines={4}
                value={note}
                onChangeText={setNote}
              />
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
                <View style={styles.methodContent}>
                  <Ionicons 
                    name={
                      method.id === 'momo' ? 'wallet' :
                      method.id === 'vnpay' ? 'card' : 'cash'
                    } 
                    size={24} 
                    color={selectedMethod === method.id ? '#007AFF' : '#666'} 
                  />
                  <Text style={[
                    styles.methodName,
                    selectedMethod === method.id && styles.selectedMethodText
                  ]}>{method.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[
                styles.payButton,
                (!selectedMethod || isLoading) && styles.payButtonDisabled,
              ]}
              onPress={handlePayment}
              disabled={!selectedMethod || isLoading}
            >
              <Text style={styles.payButtonText}>
                {isLoading ? 'Đang xử lý...' : 'Thanh toán'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
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
    paddingTop: Platform.OS === 'android' ? 35 : 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
    height: 60,
    position: 'relative',
  },
  backButton: {
    padding: 8,
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paymentMethods: {
    gap: 15,
  },
  methodCard: {
    padding: 18,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#eee',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  selectedMethod: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  selectedMethodText: {
    color: '#007AFF',
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  payButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  payButtonDisabled: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  serviceSection: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  serviceList: {
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  productColumn: {
    flex: 2,
    fontSize: 14,
  },
  priceColumn: {
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
  },
  deleteColumn: {
    width: 50,
    alignItems: 'center',
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#007AFF',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  datePickerText: {
    fontSize: 15,
    color: '#333',
  },
});

export default CheckoutScreen;
