import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView 
} from 'react-native';
import { useRouter } from 'expo-router';

const BlogListScreen = () => {
  const router = useRouter();
  // Sample data - Replace with your actual data source
  const [blogs] = useState([
    {
      id: '1',
      title: 'Tưởng Nhớ Các Anh Hùng',
      date: '2024-03-15',
      excerpt: 'Tưởng nhớ những người đã hy sinh vì tổ quốc...'
    },
    {
      id: '2',
      title: 'Cập Nhật Vườn Tưởng Niệm',
      date: '2024-03-10',
      excerpt: 'Những cải tiến gần đây cho vườn tưởng niệm...'
    },
    {
      id: '3',
      title: 'Báo Cáo Bảo Trì Hàng Tháng',
      date: '2024-03-05',
      excerpt: 'Chi tiết các hoạt động bảo trì đã thực hiện...'
    }
  ]);

  const renderBlogItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.blogItem}
      onPress={() => router.push({
        pathname: '/post-detail',
        
      })}
    >
      <Text style={styles.blogTitle}>{item.title}</Text>
      <Text style={styles.blogDate}>{item.date}</Text>
      <Text style={styles.blogExcerpt}>{item.excerpt}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push('/post-create')}
      >
        <Text style={styles.createButtonText}>Tạo Bài Viết Mới</Text>
      </TouchableOpacity>
      
      <FlatList
        data={blogs}
        renderItem={renderBlogItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  createButton: {
    backgroundColor: '#4a5568',
    padding: 15,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  blogItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2d3748',
  },
  blogDate: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 8,
  },
  blogExcerpt: {
    fontSize: 16,
    color: '#4a5568',
  },
});

export default BlogListScreen;