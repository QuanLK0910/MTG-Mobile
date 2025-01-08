import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Stack } from 'expo-router';
import Header from '../../../components/header';
import { getMartyrGraveByCustomerId } from '../../../../Services/martyrgrave';
import { useAuth, getUserId } from '../../../../contexts/AuthContext';

interface Relative {
  martyrId: number;
  name: string;
  dateOfSacrifice: string;
  graveLocation: string;
}

export default function RelativeGrave() {
  const [relatives, setRelatives] = useState<Relative[]>([]);
  const { getUserId } = useAuth();
  const userId = getUserId();
  useEffect(() => {
    const fetchRelatives = async () => {
      if (!userId) return;
      
      try {
        const response = await getMartyrGraveByCustomerId(userId);
        console.log('API Response:', response);

        if (response && Array.isArray(response) && response.length > 0) {
          const martyrData = response[0];
          console.log('Martyr Data:', martyrData);
          
          if (martyrData.matyrGraveInformations && Array.isArray(martyrData.matyrGraveInformations)) {
            const martyrInfo = martyrData.matyrGraveInformations[0];
            console.log('Martyr Info:', martyrInfo);

            setRelatives([{
              martyrId: martyrInfo?.martyrId || 0,
              name: martyrInfo?.name || 'Không có tên',
              dateOfSacrifice: martyrInfo?.dateOfSacrifice || 'Chưa có thông tin',
              graveLocation: martyrInfo?.position || 'Chưa có thông tin',
            }]);
          }
        } else {
          console.log('No valid response data found');
          setRelatives([]);
        }
      } catch (error) {
        console.error('Error fetching relatives:', error);
        setRelatives([]);
      }
    };

    fetchRelatives();
  }, [userId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#2D3748" />
        </TouchableOpacity>
        <Text style={styles.title}>Mộ Người Thân</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {relatives.map((relative: Relative) => (
          <TouchableOpacity 
            key={`${relative.martyrId}-${relative.name}`} 
            style={styles.graveCard}
            onPress={() => router.push({
              pathname: "/screens/customer/grave-detail",
              params: { id: relative.martyrId }
            })}
          >
            <View style={styles.graveInfo}>
              <Text style={styles.graveName}>{relative.name}</Text>
              <Text style={styles.graveLocation}>{relative.graveLocation}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#2D3748" />
          </TouchableOpacity>
        ))}

        {relatives.length === 0 && (
          <View style={styles.noGraveMessage}>
            <Text style={styles.noGraveText}>Không tìm thấy thông tin mộ người thân.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F7FAFC',
    marginBottom: 8,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  graveCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  graveInfo: {
    flex: 1,
  },
  graveName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  graveDate: {
    fontSize: 16,
    color: '#666666',
  },
  graveLocation: {
    fontSize: 16,
    color: '#666666',
  },
  noGraveMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noGraveText: {
    fontSize: 16,
    color: '#666666',
  },
});
