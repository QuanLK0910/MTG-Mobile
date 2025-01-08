import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { getServiceDetail } from '../../../Services/service';
import { useRoute } from '@react-navigation/native';

interface RouteParams {
  id: string;
}

const ServiceDetailScreen = () => {
  const route = useRoute();
  const params = route.params as RouteParams;
  const serviceId = params?.id ? Number(params.id) : null;
  
  const [serviceDetail, setServiceDetail] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        if (!serviceId || isNaN(serviceId)) {
          setError('Invalid service ID');
          return;
        }
        const detail = await getServiceDetail(Number(serviceId));
        setServiceDetail(detail);
      } catch (err) {
        setError('Failed to load service details');
      }
    };
    fetchServiceDetail();
  }, [serviceId]);

  if (error) {
    return <View style={styles.container}><Text>{error}</Text></View>;
  }

  if (!serviceDetail) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Service Image */}
      <Image 
        source={{ uri: serviceDetail.imagePath }}
        style={styles.serviceImage}
      />

      {/* Service Title */}
      <Text style={styles.title}>{serviceDetail.serviceName}</Text>

      {/* Service Description */}
      <Text style={styles.description}>{serviceDetail.description}</Text>

      {/* Materials Section */}
      <View style={styles.materialsSection}>
        <Text style={styles.sectionTitle}>Vật liệu thực hiện</Text>
        
        {/* Materials Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.columnHeader}>Tên vật liệu</Text>
          <Text style={styles.columnHeader}>Mô tả</Text>
          <Text style={styles.columnHeader}>Giá tiền</Text>
        </View>

        {/* Materials List */}
        {serviceDetail.materials.map((material: any) => (
          <View key={material.materialId} style={styles.tableRow}>
            <Text style={styles.cell}>{material.materialName}</Text>
            <Text style={styles.cell}>{material.description}</Text>
            <Text style={styles.cell}>{material.price.toLocaleString()} đ</Text>
          </View>
        ))}

        {/* Total Section */}
        <View style={styles.totalSection}>
          <View style={styles.tableRow}>
            <Text style={styles.cell}>Tiền công</Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}>{serviceDetail.price.toLocaleString()} đ</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.cell, styles.bold]}>Tổng giá tiền</Text>
            <Text style={styles.cell}></Text>
            <Text style={[styles.cell, styles.bold]}>
              {(serviceDetail.price + serviceDetail.materials.reduce((sum: number, material: any) => 
                sum + material.price, 0)).toLocaleString()} đ
            </Text>
          </View>
        </View>

        {/* Note Section */}
        <View style={styles.noteSection}>
          <Text style={styles.noteTitle}>Lưu ý quan trọng:</Text>
          <Text style={styles.noteText}>Kính thưa Quý khách,</Text>
          <Text style={styles.noteText}>
            Để tiến hành đặt dịch vụ, Quý khách vui lòng hoàn tất bước tìm kiếm mộ phần. 
            Sau khi phần mộ được xác định, các dịch vụ tương ứng sẽ được hiển thị và sẵn sàng để Quý khách lựa chọn.
          </Text>
          <Text style={styles.noteText}>
            Chúng tôi trân trọng cảm ơn Quý khách đã quan tâm và sử dụng dịch vụ của chúng tôi.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  serviceImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  description: {
    fontSize: 16,
    padding: 16,
    paddingTop: 0,
  },
  materialsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 8,
  },
  columnHeader: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 8,
  },
  cell: {
    flex: 1,
  },
  bold: {
    fontWeight: 'bold',
  },
  totalSection: {
    marginTop: 16,
  },
  noteSection: {
    marginTop: 24,
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 8,
  },
  noteTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noteText: {
    marginBottom: 8,
  },
});

export default ServiceDetailScreen;
