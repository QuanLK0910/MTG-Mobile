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

interface Relative {
  id: string;
  name: string;
  deathDate: string;
  location: string;
}

export default function RelativeGrave() {
  const [relatives, setRelatives] = useState<Relative[]>([
    {
      id: '1',
      name: 'Nguyen Van A',
      deathDate: '2023-12-15',
      location: 'Khu 21, day 10 , mo so 2'
    }
  ]);
  
  return (
    <>
      <View style={styles.container}>
      
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Your Relative Graves</Text>
        </View>

        {/* Graves List */}
        <ScrollView style={styles.scrollView}>
          {relatives.map((relative: Relative) => (
            <TouchableOpacity 
              key={relative.id} 
              style={styles.graveCard}
              onPress={() => router.push({
                pathname: "/screens/customer/grave-detail",
                params: { id: relative.id }
              })}
            >
              <View style={styles.graveInfo}>
                <Text style={styles.graveName}>{relative.name}</Text>
                <Text style={styles.graveDate}>
                  Death Date: {new Date(relative.deathDate).toLocaleDateString()}
                </Text>
                <Text style={styles.graveLocation}>{relative.location}</Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color="#4B7BEC" 
              />
            </TouchableOpacity>
          ))}

          {relatives.length === 0 && (
            <View style={styles.noGraveMessage}>
              <Text style={styles.noGraveText}>No relatives found.</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 16,
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
  titleContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
});
