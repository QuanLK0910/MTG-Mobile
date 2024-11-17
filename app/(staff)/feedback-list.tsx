import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock data with Vietnamese content
const MOCK_FEEDBACK = [
  {
    id: "1",
    customerName: "Nguyễn Văn A",
    date: "2024-11-01",
    rating: 5,
    comment:
      "Khu mộ được bảo trì tốt và yên bình. Cảm ơn vì dịch vụ tuyệt vời.",
    graveId: "M001",
  },
  {
    id: "2",
    customerName: "Trần Thị B",
    date: "2024-10-30",
    rating: 4,
    comment:
      "Đánh giá cao môi trường trang nghiêm. Có thể cải thiện biển chỉ dẫn.",
    graveId: "M015",
  },
  {
    id: "3",
    customerName: "Lê Văn C",
    date: "2024-10-28",
    rating: 5,
    comment:
      "Rất sạch sẽ và có tổ chức. Nhân viên hỗ trợ tận tình trong việc tìm mộ.",
    graveId: "M023",
  },
];

const FeedbackListScreen = () => {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'

  const filterOptions = [
    { id: 0, label: 'Tất cả đánh giá' },
    { id: 5, label: '5 sao' },
    { id: 4, label: '4 sao' },
    { id: 3, label: '3 sao' },
    { id: 2, label: '2 sao' },
    { id: 1, label: '1 sao' },
  ];

  const sortOptions = [
    { id: 'newest', label: 'Mới nhất' },
    { id: 'oldest', label: 'Cũ nhất' },
  ];

  const selectedRatingOption = filterOptions.find(option => option.id === selectedRating);
  const selectedSortOption = sortOptions.find(option => option.id === sortOrder);

  // Filter and sort the feedback
  const filteredAndSortedFeedback = MOCK_FEEDBACK
    .filter(feedback => selectedRating === 0 || feedback.rating === selectedRating)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const renderStars = (rating: number) => {
    return "⭐".repeat(rating);
  };

  const renderFeedbackItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={styles.feedbackItem}
        onPress={() => router.push('/feedback-detail')}
      >
        <View style={styles.feedbackHeader}>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{item.customerName}</Text>
            <View style={styles.graveIdContainer}>
              <Text style={styles.graveIdLabel}>Mã mộ:</Text>
              <Text style={styles.graveId}>{item.graveId}</Text>
            </View>
          </View>
          <Text style={styles.date}>
            {new Date(item.date).toLocaleDateString('vi-VN')}
          </Text>
        </View>

        <View style={styles.ratingContainer}>
          <Text style={styles.ratingLabel}>Đánh giá:</Text>
          <View style={styles.starsContainer}>
            {[...Array(item.rating)].map((_, index) => (
              <Ionicons key={index} name="star" size={16} color="#FFC107" />
            ))}
          </View>
        </View>

        <Text style={styles.commentLabel}>Nội dung phản hồi:</Text>
        <Text 
          style={styles.comment}
          numberOfLines={2}
        >
          {item.comment}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Danh Sách Phản Hồi',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
        }} 
      />
      
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Filters Container */}
        <View style={styles.filtersContainer}>
          {/* Rating Filter */}
          <View style={styles.filterWrapper}>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => {
                setShowRatingDropdown(!showRatingDropdown);
                setShowSortDropdown(false);
              }}
            >
              <View style={styles.selectedOption}>
                <Text style={styles.selectedOptionText}>
                  {selectedRatingOption?.label}
                </Text>
                <Ionicons 
                  name={showRatingDropdown ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#4B5563"
                />
              </View>
            </TouchableOpacity>

            {showRatingDropdown && (
              <View style={styles.dropdownList}>
                {filterOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.dropdownItem,
                      selectedRating === option.id && styles.dropdownItemActive
                    ]}
                    onPress={() => {
                      setSelectedRating(option.id);
                      setShowRatingDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      selectedRating === option.id && styles.dropdownItemTextActive
                    ]}>
                      {option.label}
                    </Text>
                    {option.id > 0 && (
                      <View style={styles.starsContainer}>
                        {[...Array(option.id)].map((_, index) => (
                          <Ionicons 
                            key={index}
                            name="star" 
                            size={14} 
                            color="#FFC107"
                          />
                        ))}
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Sort Filter */}
          <View style={styles.filterWrapper}>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => {
                setShowSortDropdown(!showSortDropdown);
                setShowRatingDropdown(false);
              }}
            >
              <View style={styles.selectedOption}>
                <Text style={styles.selectedOptionText}>
                  {selectedSortOption?.label}
                </Text>
                <Ionicons 
                  name={showSortDropdown ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#4B5563"
                />
              </View>
            </TouchableOpacity>

            {showSortDropdown && (
              <View style={styles.dropdownList}>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.dropdownItem,
                      sortOrder === option.id && styles.dropdownItemActive
                    ]}
                    onPress={() => {
                      setSortOrder(option.id);
                      setShowSortDropdown(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      sortOrder === option.id && styles.dropdownItemTextActive
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <FlatList
          data={filteredAndSortedFeedback}
          renderItem={renderFeedbackItem}
          keyExtractor={(item) => item.id}
          extraData={[selectedId, selectedRating]}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Không có phản hồi nào</Text>
            </View>
          }
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 2, // Higher than content
  },
  filterWrapper: {
    flex: 1,
    position: 'relative',
    zIndex: 1, // Needed for dropdown to show
  },
  dropdownButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 4,
    zIndex: 3, // Higher than filtersContainer
    elevation: 5, // For Android
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  listContainer: {
    padding: 16,
    zIndex: 1, // Lower than filters
  },
  feedbackItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  graveIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  graveIdLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 4,
  },
  graveId: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  commentLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  comment: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 20,
  },
  selectedOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  selectedOptionText: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dropdownItemActive: {
    backgroundColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#4B5563',
  },
  dropdownItemTextActive: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default FeedbackListScreen;
