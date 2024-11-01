import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import Sidebar from '@/app/(staff)/components/Sidebar';

export default function StaffLayout() {
  return (
    <View style={styles.container}>
      <Sidebar />
      <View style={styles.content}>
        <Stack>
          <Stack.Screen 
            name="dashboard" 
            options={{
              title: 'Dashboard',
            }}
          />
        </Stack>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
});
