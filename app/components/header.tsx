import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const Header = () => {
  const router = useRouter();

  const handleCartPress = () => {
    router.push('/screens/customer/cart');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Nghĩa Trang Liệt Sĩ{'\n'}Thành Phố Hồ Chí Minh
        </Text>
        <TouchableOpacity style={styles.cartButton} onPress={handleCartPress}>
          <Icon name="cart-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#1a1a1a',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    color: '#fff',
    textAlign: 'left',
  },
  cartButton: {
    padding: 8,
  },
});

export default Header;
