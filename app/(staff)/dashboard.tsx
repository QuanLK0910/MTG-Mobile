import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';


const StaffDashboard = () => {
  const router = useRouter();

  // Sample data - Replace with your actual data
  const dashboardData = {
    statistics: {
      totalGraves: 1250,
      totalBlogs: 45,
      pendingMaintenance: 8,
      todayVisitors: 25
    },
    recentBlogs: [
      {
        id: '1',
        title: 'Thông Báo Lễ Tưởng Niệm',
        date: '15/03/2024',
        status: 'Đã Đăng'
      },
      {
        id: '2',
        title: 'Báo Cáo Bảo Trì Tháng',
        date: '14/03/2024',
        status: 'Nháp'
      }
    ],
    upcomingMaintenance: [
      {
        id: '1',
        location: 'Khu A',
        date: '20/03/2024',
        type: 'Vệ Sinh'
      },
      {
        id: '2',
        location: 'Khu B',
        date: '22/03/2024',
        type: 'Sửa Chữa'
      }
    ]
  };

  const renderStatisticCard = (title: string, value: number, color: string) => (
    <View style={[styles.statisticCard, { backgroundColor: color }]}>
      <Text style={styles.statisticValue}>{value}</Text>
      <Text style={styles.statisticTitle}>{title}</Text>
    </View>
  );

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Bảng Thống Kê",
          headerTitleStyle: {
            fontSize: 18,
          },
        }} 
      />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* Welcome Section */}
          <View style={styles.headerSection}>
            <Text style={styles.welcomeText}>Xin Chào, Nhân Viên</Text>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => router.push('/post-create')}
            >
              <Text style={styles.quickActionText}>Tạo Bài Viết</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => router.push('/task-list')}
            >
              <Text style={styles.quickActionText}>Ghi Nhận Bảo Trì</Text>
            </TouchableOpacity>
          </View>

          {/* Statistics Section */}
          <View style={styles.statisticsContainer}>
            <View style={styles.statisticsRow}>
              {renderStatisticCard('Số Mộ Quan Ly', dashboardData.statistics.totalGraves, 'rgba(48, 42, 22, 0.9)')}
              {renderStatisticCard('Tổng Bài Viết', dashboardData.statistics.totalBlogs, 'rgba(48, 42, 22, 0.8)')}
            </View>
            <View style={styles.statisticsRow}>
              {renderStatisticCard('Việc Cần Làm', dashboardData.statistics.pendingMaintenance, 'rgba(48, 42, 22, 0.7)')}
              {renderStatisticCard('Người Truy Cập Hôm Nay', dashboardData.statistics.todayVisitors, 'rgba(48, 42, 22, 0.6)')}
            </View>
          </View>

          {/* Recent Blogs Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bài Viết Gần Đây</Text>
            {dashboardData.recentBlogs.map(blog => (
              <TouchableOpacity 
                key={blog.id}
                style={styles.listItem}
                onPress={() => router.push(`/post-detail`)}
              >
                <View>
                  <Text style={styles.listItemTitle}>{blog.title}</Text>
                  <Text style={styles.listItemSubtitle}>{blog.date}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: blog.status === 'Published' ? '#48bb78' : '#ecc94b' }
                ]}>
                  <Text style={styles.statusText}>{blog.status}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Upcoming Maintenance Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Việc Cần Làm</Text>
            {dashboardData.upcomingMaintenance.map(task => (
              <TouchableOpacity 
                key={task.id}
                style={styles.listItem}
              >
                <View>
                  <Text style={styles.listItemTitle}>{task.location}</Text>
                  <Text style={styles.listItemSubtitle}>{task.date}</Text>
                </View>
                <View style={styles.maintenanceTypeBadge}>
                  <Text style={styles.maintenanceTypeText}>{task.type}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  headerSection: {
    backgroundColor: 'rgba(48, 42, 22, 0.8)',
    padding: 20,
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: 'rgba(48, 42, 22, 0.8)',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickActionText: {
    color: '#fff',
    fontWeight: '500',
  },
  statisticsContainer: {
    padding: 15,
    gap: 10,
  },
  statisticsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statisticCard: {
    flex: 1,
    backgroundColor: 'rgba(48, 42, 22, 0.7)',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  statisticValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statisticTitle: {
    fontSize: 14,
    color: '#ffffff',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2d3748',
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#718096',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  maintenanceTypeBadge: {
    backgroundColor: '#4a5568',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  maintenanceTypeText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
});

export default StaffDashboard;