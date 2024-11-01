import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import Sidebar from '@/app/(staff)/components/Sidebar';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function StaffLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <ProtectedRoute allowedRoles={['staff']}>
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
    </ProtectedRoute>
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
