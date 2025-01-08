import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getGraveServices } from '../../../Services/graveservice';
import { addToCart, CartItem } from '../../../Services/cart';

import { SafeAreaView } from 'react-native-safe-area-context';

interface GraveService {
  graveServiceId: number;
  serviceName: string;
  description: string;
  price: number;
  imagePath: string;
}

export default function BookingGraveService() {
  const { martyrId } = useLocalSearchParams();
  const [services, setServices] = useState<GraveService[]>([]);
  const [cart, setCart] = useState<GraveService[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await getGraveServices({martyrId: Number(martyrId)});
      setServices(response);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const handleAddToCart = async (service: GraveService) => {
    setIsLoading(true);
    try {
      const cartItem: CartItem = {
        accountId: 0, // Replace with actual account ID from auth
        serviceId: service.graveServiceId,
        martyrId: Number(martyrId)
      };
      
      const success = await addToCart([cartItem]);
      if (success) {
        setCart([...cart, service]);
        Alert.alert(
          "Thành công",
          `Đã thêm "${service.serviceName}" vào giỏ hàng`,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert(
        "Lỗi",
        "Không thể thêm vào giỏ hàng. Vui lòng thử lại sau.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderServiceCard = ({ item }: { item: GraveService }) => (
    <View style={styles.card}>
      <Image 
        source={{ uri: item.imagePath }} 
        style={styles.serviceImage}
        resizeMode="cover"
      />
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.serviceName}</Text>
        <Text style={styles.serviceDescription}>{item.description}</Text>
        <Text style={styles.servicePrice}>
          {item.price} đ
        </Text>
        <TouchableOpacity 
          style={[
            styles.addButton,
            isLoading && styles.disabledButton
          ]}
          onPress={() => handleAddToCart(item)}
          disabled={isLoading}
        >
          <Text style={styles.addButtonText}>
            {isLoading ? 'Đang thêm...' : 'Thêm vào giỏ'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dịch Vụ Cố Sản Của Mộ Phần</Text>
        <Text style={styles.subtitle}>Bạn đang đặt dịch vụ cho liệt sĩ:</Text>
        <Text style={styles.martyrName}>Nguyễn Như Nguyên</Text>
      </View>

      <FlatList
        data={services}
        renderItem={renderServiceCard}
        keyExtractor={(item) => item.graveServiceId.toString()}
        contentContainerStyle={styles.serviceList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  martyrName: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '500',
  },
  serviceList: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceImage: {
    width: '100%',
    height: 200,
  },
  serviceInfo: {
    padding: 16,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#00C853',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  },
});
