import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image
} from 'react-native';
import { Stack } from 'expo-router';

const BlogDetailScreen = ({ route }: { route: any }) => {
  // Sample blog data in Vietnamese
  const blog = {
    id: '1',
    title: 'Tưởng Nhớ Các Anh Hùng',
    date: '15/03/2024',
    author: 'Nguyễn Văn A',
    content: `Để tưởng nhớ những người đã hy sinh vì Tổ quốc, hôm nay chúng ta tề tựu để tôn vinh di sản của họ.

    Vườn tưởng niệm đứng vững như một minh chứng cho lòng dũng cảm và sự cống hiến của họ. Khuôn viên được chăm sóc cẩn thận phản ánh cam kết của chúng ta trong việc gìn giữ ký ức của họ cho các thế hệ tương lai.

    Những cải tiến gần đây tại khu tưởng niệm bao gồm:
    • Biển tưởng niệm mới
    • Nâng cấp hệ thống chiếu sáng cho khách thăm buổi tối
    • Cải tạo lối đi để dễ tiếp cận hơn
    • Bổ sung khu vực ghế ngồi để tưởng niệm

    Chúng tôi tiếp tục nỗ lực để đảm bảo không gian thiêng liêng này luôn là một nơi tưởng niệm trang nghiêm cho các anh hùng đã khuất. Sự hy sinh của họ sẽ không bao giờ bị lãng quên, và câu chuyện của họ sẽ tiếp tục truyền cảm hứng cho các thế hệ mai sau.

    Kính mời quý khách dành một phút mặc niệm khi đến thăm mảnh đất thiêng liêng này. Không gian yên bình của khu vườn mang đến khung cảnh hoàn hảo để tưởng nhớ và tri ân.`,
    location: 'Khu A, Vườn Tưởng Niệm',
    lastUpdated: '15/03/2024 14:30'
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Chi Tiết Bài Viết",
          headerTitleStyle: {
            fontSize: 18,
          },
        }} 
      />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* Header Image */}
          <Image
            source={{ uri: 'https://via.placeholder.com/400x200' }}
            style={styles.headerImage}
          />
          
          <View style={styles.contentContainer}>
            {/* Title and Meta Information */}
            <Text style={styles.title}>{blog.title}</Text>
            <View style={styles.metaContainer}>
              <Text style={styles.metaText}>Tác giả: {blog.author}</Text>
              <Text style={styles.metaText}>•</Text>
              <Text style={styles.metaText}>{blog.date}</Text>
            </View>
            
            {/* Location Info */}
            <View style={styles.locationContainer}>
              <Text style={styles.locationText}>{blog.location}</Text>
            </View>

            {/* Main Content */}
            <Text style={styles.content}>{blog.content}</Text>
            
            {/* Footer Information */}
            <View style={styles.footer}>
              <Text style={styles.lastUpdated}>
                Cập nhật lần cuối: {blog.lastUpdated}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e2e8f0',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  metaText: {
    fontSize: 14,
    color: '#718096',
    marginRight: 8,
  },
  locationContainer: {
    backgroundColor: '#e2e8f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#4a5568',
    fontWeight: '500',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2d3748',
    marginBottom: 24,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 16,
    marginTop: 16,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#718096',
    fontStyle: 'italic',
  },
});

export default BlogDetailScreen;