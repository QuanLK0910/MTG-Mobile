import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install expo/vector-icons
import { useRouter } from 'expo-router';


export default function AccountScreen() {
  const router = useRouter();

  const menuItems = [
    { icon: 'notifications-outline', title: 'Notifications' },  
    { 
      icon: 'person-outline', 
      title: 'My relative grave',
      onPress: () => router.push('/screens/customer/relative-grave')
    },
    { icon: 'card-outline', title: 'Payment Options' },
    { icon: 'help-circle-outline', title: 'Need Help?' },
    { icon: 'shield-outline', title: 'Security' },
    { icon: 'document-text-outline', title: 'FAQ' },
    { icon: 'settings-outline', title: 'Settings' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>ZC</Text>
            </View>
            <View>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.userName}>Zerin Chawdhuri</Text>
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
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#4B7BEC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Log Out Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
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
    backgroundColor: '#4B7BEC',
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
    backgroundColor: '#4B7BEC',
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
});
