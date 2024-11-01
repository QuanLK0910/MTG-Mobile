import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function FeedbackDetailScreen() {
  // Mock data for testing
  const feedback = {
    id: '1',
    customerName: 'Nguyễn Văn A',
    date: '2024-03-20',
    rating: 5,
    comment: 'Khu mộ được bảo trì tốt và yên bình. Cảm ơn vì dịch vụ tuyệt vời.',
    graveId: 'M001',
  };

  const renderStars = (rating: number) => {
    return [...Array(rating)].map((_, index) => (
      <Ionicons key={index} name="star" size={20} color="#FFC107" />
    ));
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Chi Tiết Phản Hồi',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
        }}
      />

      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content}>
          {/* Customer Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông Tin Khách Hàng</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Họ Tên:</Text>
              <Text style={styles.value}>{feedback.customerName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Mã Mộ:</Text>
              <Text style={styles.value}>{feedback.graveId}</Text>
            </View>
          </View>

          {/* Feedback Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Đánh Giá</Text>
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {renderStars(feedback.rating)}
              </View>
              <Text style={styles.ratingText}>{feedback.rating}/5</Text>
            </View>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              <Text style={styles.dateText}>
                {new Date(feedback.date).toLocaleDateString('vi-VN')}
              </Text>
            </View>
          </View>

          {/* Comment Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nội Dung Phản Hồi</Text>
            <View style={styles.commentContainer}>
              <Text style={styles.commentText}>{feedback.comment}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  label: {
    width: 100,
    fontSize: 15,
    color: '#6B7280',
  },
  value: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#6B7280',
  },
  commentContainer: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  commentText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
});