import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Href } from 'expo-router';
const menuItems = [
  { title: 'Dashboard', route: '/(staff)/dashboard' },
  { title: 'Products', route: '/(staff)/products' },
  { title: 'Orders', route: '/(staff)/orders' },
  { title: 'Settings', route: '/(staff)/settings' },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Staff Portal</Text>
      </View>
      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => router.push(item.route as Href<string>)}
          >
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 250,
    backgroundColor: '#1a1a1a',
    height: '100%',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menu: {
    padding: 10,
  },
  menuItem: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 5,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
  },
});
