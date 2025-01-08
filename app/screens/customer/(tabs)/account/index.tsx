import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install expo/vector-icons
import { useRouter } from 'expo-router';
import { useAuth } from '../../../../../contexts/AuthContext';
import { getMartyrGraveByCustomerId } from '../../../../../Services/martyrgrave';
import { useEffect, useState } from 'react';


export default function AccountScreen() {
  const router = useRouter();
  const { isAuthenticated, user,getUserId, logout } = useAuth();
  const [martyrGrave, setMartyrGrave] = useState(null);

  useEffect(() => {
    const fetchMartyrGrave = async () => {
      if (user?.id) {
        const grave = await getMartyrGraveByCustomerId(user.id);
        setMartyrGrave(grave);
      }
    };

    fetchMartyrGrave();
  }, [user]);

  // Not logged in view
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.notLoggedInContainer}>
          <Text style={styles.welcomeTitle}>Hệ Thống Quản Lý Nghĩa Trang Liệt Sĩ</Text>
          <Text style={styles.subTitle}>Đăng nhập để quản lý thông tin về các anh hùng liệt sĩ</Text>
          
          <TouchableOpacity 
            style={[styles.authButton, styles.loginButton]}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.authButtonText}>Đăng nhập</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.authButton, styles.registerButton]}
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={styles.authButtonText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const menuItems = [
    { icon: 'notifications-outline', title: 'Thông báo' },  
    { 
      icon: 'person-outline', 
      title: 'Mộ người thân',
      subtitle: martyrGrave ? `${martyrGrave.name || 'Không rõ'}` : 'Chưa có thông tin',
      onPress: () => {
        const accountId = getUserId();
        console.log('Account ID from token:', accountId);
        router.push(`/screens/customer/relative-grave?accountId=${accountId}`);
      }
    },
    { icon: 'card-outline', title: 'Tùy chọn thanh toán' },
    { icon: 'help-circle-outline', title: 'Bạn cần giúp đỡ?' },
    { icon: 'shield-outline', title: 'Bảo mật' },
    { icon: 'document-text-outline', title: 'Câu hỏi thường gặp' },
    { icon: 'settings-outline', title: 'Cài đặt' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.substring(0, 2).toUpperCase() || 'NA'}
              </Text>
            </View>
            <View>
              <Text style={styles.welcomeText}>Xin chào</Text>
              <Text style={styles.userName}>{user?.name || 'Người dùng'}</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="pencil" size={24} color="#4B7BEC" />
          </TouchableOpacity>
        </View>

        {/* Updated Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem}
              onPress={item.onPress ? item.onPress : () => {}}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon} size={24} color="#4B7BEC" />
                <View>
                  <Text style={styles.menuItemText}>{item.title}</Text>
                  {item.subtitle && (
                    <Text style={styles.menuItemSubtext}>{item.subtitle}</Text>
                  )}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#4B7BEC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Log Out Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={async () => {
            try {
              await logout();
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Logout failed:', error);
            }
          }}
        >
          <Text style={styles.logoutText}>Đăng xuất</Text>
          <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2ECC71',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 14,
    color: '#8395A7',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    margin: 20,
    padding: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F2F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#2C3E50',
  },
  logoutButton: {
    backgroundColor: '#2ECC71',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 16,
    color: '#8395A7',
    marginBottom: 30,
    textAlign: 'center',
  },
  authButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#B8860B',
  },
  registerButton: {
    backgroundColor: '#B8860B',
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuItemSubtext: {
    marginLeft: 15,
    fontSize: 14,
    color: '#8395A7',
  },
});
