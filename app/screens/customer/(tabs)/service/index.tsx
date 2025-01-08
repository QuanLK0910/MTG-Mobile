import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { serviceCategories } from '../../../../../Services/servicecategory';
import { getServicesByCategory } from '../../../../../Services/service';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

interface ServiceCategory {
  categoryId: number;
  categoryName: string;
  description: string;
  urlImageCategory: string;
  status: boolean;
}

interface Service {
  serviceId: number;
  categoryId: number;
  serviceName: string;
  description: string;
  price: number;
  imagePath: string;
  status: boolean;
}

interface ServicesByCategory extends ServiceCategory {
  services: Service[];
}

export default function ServiceScreen() {
  const navigation = useNavigation();
  const [categoriesWithServices, setCategoriesWithServices] = useState<ServicesByCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First fetch categories
        const categoriesResponse = await serviceCategories.getCategories();
        const categories = categoriesResponse.data;
        
        // Then fetch services for each category
        const servicesResponse = await getServicesByCategory(); // Get all services
        
        // Group services by categoryId
        const groupedServices = categories.map(category => ({
          ...category,
          services: servicesResponse.filter(service => service.categoryId === category.categoryId)
        }));
        
        setCategoriesWithServices(groupedServices);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add navigation handler
  const handleServicePress = (serviceId: number) => {
    router.push({
      pathname: "/screens/customer/servicedetail",
      params: { id: serviceId }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Các loại dịch vụ của chúng tôi</Text>
        <Text style={styles.subtitle}>
          "Chăm sóc nơi an nghỉ, gửi gắm yêu thương. Để mỗi khi bạn đến thăm, là một hành trình bình yên, nơi ký ức mãi mãi còn trong tim. Chúng tôi không chỉ quản lý, mà còn vun đắp sự yên bình."
        </Text>
      </View>
      
      {loading ? (
        <Text style={styles.loadingText}>Đang tải...</Text>
      ) : (
        categoriesWithServices.map((category) => (
          <View key={category.categoryId}>
            <Text style={styles.categoryTitle}>{category.categoryName}</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.servicesContainer}
            >
              {category.services.map((service) => (
                <TouchableOpacity 
                  key={service.serviceId} 
                  style={styles.serviceCard}
                  activeOpacity={0.7}
                  onPress={() => handleServicePress(service.serviceId)}
                >
                  <Image source={{ uri: service.imagePath }} style={styles.serviceImage} />
                  <View style={styles.serviceContent}>
                    <Text style={styles.serviceTitle}>{service.serviceName}</Text>
                    <Text style={styles.serviceDescription} numberOfLines={3}>{service.description}</Text>
                    <Text style={styles.servicePrice}>{service.price.toLocaleString('vi-VN')} VNĐ</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = width * 0.8; // Card will take 80% of screen width

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  headerContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 10,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 15,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  servicesContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row', // Make items flow horizontally
    gap: 15, // Space between cards
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    width: cardWidth,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  serviceContent: {
    padding: 20,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 15,
    color: '#000000',
    lineHeight: 22,
  },
  loadingText: {
    color: '#000000',
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E8B57',
    marginTop: 8,
  },
});
