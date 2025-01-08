import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { searchMartyrGraves, MartyrGrave } from '../../../../../Services/martyrgrave';
import { useRouter } from 'expo-router';

export default function FindGraveScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [deathYear, setDeathYear] = useState('');
  const [hometown, setHometown] = useState('');
  const [results, setResults] = useState<MartyrGrave[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!name && !birthYear && !deathYear && !hometown) {
      setError('Vui lòng nhập ít nhất một thông tin tìm kiếm.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResults([]);
      
      const response = await searchMartyrGraves({
        name: name.trim() || undefined,
        yearOfBirth: birthYear.trim() || undefined,
        yearOfSacrifice: deathYear.trim() || undefined,
        homeTown: hometown.trim() || undefined,
      });
      
      if (response?.data?.length > 0) {
        setResults(response.data);
      } else {
        setResults([]);
        setError('Không tìm thấy kết quả phù hợp.');
      }
    } catch (err) {
      setResults([]);
      setError('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleMartyrPress = (martyrId: string) => {
    router.push({
      pathname: "/screens/customer/grave-detail",
      params: { id: martyrId }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>TÌM KIẾM MỘ</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Họ và Tên người mất"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
        />
        
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Năm sinh"
            placeholderTextColor="#666"
            value={birthYear}
            onChangeText={setBirthYear}
            keyboardType="numeric"
          />
          
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Năm mất"
            placeholderTextColor="#666"
            value={deathYear}
            onChangeText={setDeathYear}
            keyboardType="numeric"
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Quê quán"
          placeholderTextColor="#666"
          value={hometown}
          onChangeText={setHometown}
        />

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>TÌM KIẾM</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#B8860B" />
          <Text style={styles.loadingText}>Đang tìm kiếm...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {results.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Kết quả tìm kiếm ({results.length})</Text>
          {results.map((martyr) => (
            <TouchableOpacity
              key={martyr.martyrId}
              style={styles.martyrCard}
              onPress={() => handleMartyrPress(martyr.martyrId)}
            >
              {martyr.images && martyr.images.length > 0 && (
                <Image
                  source={{ uri: martyr.images[0].image }}
                  style={styles.martyrImage}
                  resizeMode="cover"
                />
              )}
              <View style={styles.martyrInfo}>
                <Text style={styles.martyrName}>{martyr.name}</Text>
                {martyr.nickName && (
                  <Text style={styles.martyrDetail}>Bí danh: {martyr.nickName}</Text>
                )}
                <Text style={styles.martyrDetail}>
                  Sinh: {martyr.dateOfBirth || 'Không rõ'}
                </Text>
                <Text style={styles.martyrDetail}>
                  Hy sinh: {martyr.dateOfSacrifice || 'Không rõ'}
                </Text>
                <Text style={styles.martyrDetail}>
                  Quê quán: {martyr.homeTown}
                </Text>
                {martyr.graveLocation && (
                  <Text style={styles.martyrDetail}>
                    Vị trí mộ: {martyr.graveLocation}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#B8860B',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  searchContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    height: 48,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  searchButton: {
    backgroundColor: '#B8860B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    height: 50,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  errorContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: '#ffebee',
    borderRadius: 8,
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  resultsContainer: {
    padding: 16,
    paddingTop: 24,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  martyrCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  martyrImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
  },
  martyrInfo: {
    padding: 16,
  },
  martyrName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  martyrDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
});
