import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const menuItems = [
  { title: 'Bảng Thống Kê', route: '/dashboard', icon: 'stats-chart' },
  { title: 'Hồ sơ nhân viên', route: '/profile', icon: 'person' },
  { title: 'Công việc', route: '/task-list', icon: 'clipboard' },
  { title: 'Phản hồi', route: '/feedback-list', icon: 'chatbox-ellipses' },
  { title: 'Bài viết', route: '/post-list', icon: 'document-text' },
  { title: 'Công việc theo tuần', route: '/weekly-task', icon: 'calendar' },
];

export default function Sidebar() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <TouchableOpacity 
        style={[styles.collapseButton, styles.collapseButtonFixed]} 
        onPress={() => setIsCollapsed(false)}
      >
        <Ionicons name="menu" size={24} color="#fff" />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <Image 
              source={require('@/assets/images/logo.png')}
              style={styles.headerLogo}
            />
            <Text style={styles.welcomeText}>Welcome, 6!</Text>
            <TouchableOpacity style={styles.staffButton}>
              <Ionicons name="person" size={20} color="#fff" style={styles.staffIcon} />
              <Text style={styles.staffButtonText}>Staff</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.sectionTitle}>STAFF DASHBOARD</Text>
          
          <View style={styles.menu}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => router.push(item.route as Href<string>)}
              >
                <Ionicons name={item.icon as any} size={24} color="#fff" />
                <Text style={styles.menuText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => router.replace('/login')}
          >
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.collapseButton, styles.collapseButtonFixed]} 
          onPress={() => setIsCollapsed(true)}
        >
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: adds a semi-transparent overlay
  },
  container: {
    position: 'absolute',
    width: 250,
    backgroundColor: "rgba(48, 42, 22, 0.8)",
    height: '100%',
    paddingTop: 80,
    left: 0,
    top: 0,
    zIndex: 1001,
  },
  mainContent: {
    flex: 1,
    paddingBottom: 60,
  },
  header: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerLogo: {
    width: '100%',
    height: 80,
    resizeMode: 'contain',
  },
  welcomeText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  staffButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  staffIcon: {
    marginRight: 8,
  },
  staffButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 14,
    padding: 20,
    paddingBottom: 10,
    opacity: 0.8,
  },
  menu: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 5,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5757',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  logoutText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  collapseButton: {
    position: 'absolute',
    zIndex: 999,
    padding: 8,
    backgroundColor: 'rgba(48, 42, 22, 0.8)',
    borderRadius: 8,
  },
  collapseButtonFixed: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    zIndex: 999,
  },
});
