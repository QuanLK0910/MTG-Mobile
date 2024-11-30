import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Header from '../../components/header';
import React from 'react';
import memorial1 from '../../../assets/images/memorial1.jpg';


// This would typically come from an API call using the ID
const getFakeRelativeData = (id: string) => ({
  id,
  name: 'Nguyễn Văn A',
  deathDate: '1964-12-15',
  location: 'Khu 21, dãy 10, mộ số 2',
  photo: memorial1,
  birthDate: '1945-03-20',
  description: 'Mất tại trận địa của giặc',
  services: [
    {
      id: '1',
      name: 'Dọn dẹp mộ',
      price: '200.000đ/lần',
      description: 'Dịch vụ dọn dẹp, vệ sinh mộ định kỳ',
      
    },
    {
      id: '2',
      name: 'Thắp hương',
      price: '150.000đ/lần',
      description: 'Dịch vụ thắp hương định kỳ',
     
    },
    {
      id: '3',
      name: 'Đặt hoa',
      price: '300.000đ/lần',
      description: 'Dịch vụ đặt hoa tươi tại mộ',
      
    }
  ]
});

export default function GraveDetail() {
  const { id } = useLocalSearchParams();
  const relative = getFakeRelativeData(id as string);

  return (
    <View style={styles.container}>
      
      
      <ScrollView style={styles.content}>
        <Image
          source={memorial1}
          style={styles.photo}
          defaultSource={memorial1}
        />
        
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{relative.name}</Text>
          
          <View style={styles.dateContainer}>
            <Text style={styles.dates}>
              {new Date(relative.birthDate).toLocaleDateString()} - {new Date(relative.deathDate).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.locationContainer}>
            <Text style={styles.label}>Vị trí mộ</Text>
            <Text style={styles.value}>{relative.location}</Text>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.label}>Thông tin thêm</Text>
            <Text style={styles.description}>{relative.description}</Text>
          </View>

          <View style={styles.servicesContainer}>
            <Text style={styles.sectionTitle}>Dịch vụ có sẵn cho mộ</Text>
            <View style={styles.servicesList}>
              {relative.services.map(service => (
                <View key={service.id} style={styles.serviceCard}>
                  <Image 
                    source={service.image} 
                    style={styles.serviceImage}
                    resizeMode="cover"
                  />
                  <View style={styles.serviceContent}>
                    <View style={styles.serviceHeader}>
                      <Text style={styles.serviceName}>{service.name}</Text>
                      <Text style={styles.servicePrice}>{service.price}</Text>
                    </View>
                    <Text style={styles.serviceDescription}>{service.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoContainer: {
    gap: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  dateContainer: {
    marginBottom: 8,
  },
  dates: {
    fontSize: 16,
    color: '#666',
  },
  locationContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
  descriptionContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  servicesContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  servicesList: {
    gap: 16,
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f5f5f5',
  },
  serviceContent: {
    padding: 16,
    gap: 8,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
