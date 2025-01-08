import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import Header from '../../components/header';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getMartyrGraveById } from '../../../Services/martyrgrave';

export default function GraveDetail() {
  const { id } = useLocalSearchParams();
  const [graveData, setGraveData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchGraveData = async () => {
    try {
      const data = await getMartyrGraveById(Number(id));
      setGraveData(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchGraveData();
  }, [id]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchGraveData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Chi tiết mộ</Text>
          </View>
          <View style={styles.rightPlaceholder} />
        </View>
        <View style={[styles.content, styles.centerContent]}>
          <Text>Đang tải...</Text>
        </View>
      </View>
    );
  }

  if (!graveData) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Chi tiết mộ</Text>
          </View>
          <View style={styles.rightPlaceholder} />
        </View>
        <View style={[styles.content, styles.centerContent]}>
          <Text>Không tìm thấy thông tin mộ</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Chi tiết mộ</Text>
        </View>
        <View style={styles.rightPlaceholder} />
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2196F3']}
          />
        }
      >
        <Image
          source={{ uri: graveData.images?.[0]?.urlPath }}
          style={styles.photo}
        />
        
        <View style={styles.infoContainer}>
          <Text style={styles.martyrCode}>Mã liệt sĩ: {graveData.martyrCode}</Text>
          <Text style={styles.name}>
            {graveData.matyrGraveInformations?.[0]?.name || 'Chưa có tên'}
          </Text>
          
          <View style={styles.dateContainer}>
            <Text style={styles.dates}>
              {graveData.matyrGraveInformations?.[0]?.dateOfBirth || '---'} - {graveData.matyrGraveInformations?.[0]?.dateOfSacrifice || '---'}
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <Ionicons name="location" size={24} color="#666" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.label}>Vị trí mộ</Text>
              <Text style={styles.value}>
                Khu {graveData.areaId} - {graveData.areaName || ''}{'\n'}
                Dãy số {graveData.rowNumber}{'\n'}
                Số mộ {graveData.martyrNumber || graveData.areaNumber || ''}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <Ionicons name="person" size={24} color="#666" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.label}>Thông tin cá nhân</Text>
              <Text style={styles.value}>
                {graveData.matyrGraveInformations?.[0]?.gender !== undefined && 
                  `Giới tính: ${graveData.matyrGraveInformations[0].gender ? 'Nữ' : 'Nam'}\n`}
                {graveData.matyrGraveInformations?.[0]?.nickName && 
                  `Bí danh: ${graveData.matyrGraveInformations[0].nickName}\n`}
                {graveData.matyrGraveInformations?.[0]?.position && 
                  `Chức vụ: ${graveData.matyrGraveInformations[0].position}\n`}
                {graveData.matyrGraveInformations?.[0]?.homeTown && 
                  `Quê quán: ${graveData.matyrGraveInformations[0].homeTown}\n`}
                {graveData.matyrGraveInformations?.[0]?.medal && 
                  `Huân chương: ${graveData.matyrGraveInformations[0].medal}`}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <Ionicons name="call" size={24} color="#666" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.label}>Thông tin liên hệ thân nhân</Text>
              <Text style={styles.value}>
                {graveData.customerName && `Tên: ${graveData.customerName}\n`}
                {graveData.customerPhone && `SĐT: ${graveData.customerPhone}\n`}
                {graveData.customerEmail && `Email: ${graveData.customerEmail}`}
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => router.push({
              pathname: "/screens/customer/booking-grave-service",
              params: { martyrId: id }
            })}
          >
            <Text style={styles.bookButtonText}>Đặt dịch vụ</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const additionalStyles = StyleSheet.create({
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 48,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    letterSpacing: 0.5,
  },
  rightPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoContainer: {
    gap: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  dateContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  dates: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 12,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  cardContent: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 16,
  },
  servicesList: {
    gap: 12,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
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
  serviceContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#f0f0f0',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2196F3',
    marginTop: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  martyrCode: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  bookButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  ...additionalStyles,
});
