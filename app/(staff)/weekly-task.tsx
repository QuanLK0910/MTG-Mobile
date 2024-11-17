import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  task?: {
    title: string;
    description: string;
    status: 'pending' | 'completed';
  };
}

export default function WeeklyTaskPage() {
  const router = useRouter();

  // Initialize with current week's Monday and today's date
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Handle Sunday case
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const [timeSlots] = useState<TimeSlot[]>([
    { id: '1', startTime: '07:00', endTime: '09:00' },
    { 
      id: '2', 
      startTime: '09:00', 
      endTime: '11:00',
      task: {
        title: 'Chăm sóc mộ liệt sĩ Khu A',
        description: 'Dọn dẹp và đặt hoa tươi tại 15 ngôi mộ khu vực A2. Kiểm tra và vệ sinh bia mộ.',
        status: 'pending'
      }
    },
    { id: '3', startTime: '13:00', endTime: '15:00' },
    { id: '4', startTime: '15:00', endTime: '17:00' },
    { id: '5', startTime: '17:00', endTime: '19:00' },
    { id: '6', startTime: '19:00', endTime: '21:00' },
  ]);

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Generate week dates starting from current week's Monday
  const getWeekDates = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      return date;
    });
  };

  // Navigate to previous/next week
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newWeekStart);
  };

  // Navigate to current week
  const goToCurrentWeek = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
    monday.setHours(0, 0, 0, 0);
    setCurrentWeekStart(monday);
    setSelectedDate(today);
  };

  // Vietnamese weekday names
  const getVietnameseWeekday = (date: Date, short: boolean = false) => {
    const weekdays = {
      short: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
      long: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
    };
    return weekdays[short ? 'short' : 'long'][date.getDay()];
  };

  // Vietnamese month names
  const getVietnameseMonth = (date: Date) => {
    const months = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return months[date.getMonth()];
  };

  // Get formatted date string
  const getFormattedDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}/${month}`;
  };

  // Get week range string
  const getWeekRangeString = () => {
    const weekStart = new Date(currentWeekStart);
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return `${getFormattedDate(weekStart)} - ${getFormattedDate(weekEnd)}`;
  };

  const handleAssignSlot = (slotId: string) => {
    // TODO: Implement assignment logic
    console.log('Assign slot:', slotId);
  };

  const handleSlotPress = (slot: TimeSlot) => {
    if (slot.task) {
      // Navigate to task detail page with the task data
      router.push({
        pathname: "/(staff)/weekly-task-checkin",
        params: { id: slot.id }
      });
    } else {
      handleAssignSlot(slot.id);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch Làm Việc</Text>
        <Text style={styles.headerSubtitle}>
          {getWeekRangeString()}
        </Text>
      </View>

      <View style={styles.dateNavigator}>
        <TouchableOpacity 
          onPress={() => navigateWeek('prev')}
          style={styles.navigationButton}
        >
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.dateScroller}
          contentContainerStyle={styles.dateScrollerContent}
        >
          {getWeekDates().map((date) => (
            <TouchableOpacity
              key={date.toISOString()}
              onPress={() => setSelectedDate(date)}
              style={[
                styles.dateButton,
                date.toDateString() === selectedDate.toDateString() && styles.selectedDate,
                isToday(date) && styles.todayDate
              ]}
            >
              <Text style={[
                styles.dayText,
                date.toDateString() === selectedDate.toDateString() && styles.selectedText,
                isToday(date) && styles.todayText
              ]}>
                {getVietnameseWeekday(date, true)}
              </Text>
              <Text style={[
                styles.dateText,
                date.toDateString() === selectedDate.toDateString() && styles.selectedText,
                isToday(date) && styles.todayText
              ]}>
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity 
          onPress={() => navigateWeek('next')}
          style={styles.navigationButton}
        >
          <Ionicons name="chevron-forward" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.selectedDateText}>
          {`${getVietnameseWeekday(selectedDate)}, ${selectedDate.getDate()} ${getVietnameseMonth(selectedDate)} ${selectedDate.getFullYear()}`}
        </Text>
        
        <View style={styles.timeSlotsContainer}>
          {timeSlots.map((slot) => (
            <TouchableOpacity 
              key={slot.id} 
              style={styles.timeSlot}
              onPress={() => handleSlotPress(slot)}
            >
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{slot.startTime}</Text>
                <Text style={styles.timeText}>{slot.endTime}</Text>
              </View>
              
              {slot.task ? (
                <View style={styles.taskContainer}>
                  <Text style={styles.taskTitle}>{slot.task.title}</Text>
                  <Text style={styles.taskDescription}>{slot.task.description}</Text>
                </View>
              ) : (
                <View style={styles.emptySlotContainer}>
                  <Text style={styles.emptySlotText}>Trống</Text>
                  <TouchableOpacity 
                    style={styles.assignButton}
                    onPress={() => handleAssignSlot(slot.id)}
                  >
                    <Text style={styles.assignButtonText}>Đăng ký ca</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  dateNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  navigationButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateScroller: {
    flex: 1,
    maxHeight: 100,
  },
  dateScrollerContent: {
    paddingVertical: 10,
  },
  dateButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 70,
    margin: 4,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  selectedDate: {
    backgroundColor: '#007AFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  todayDate: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  dayText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  selectedText: {
    color: '#fff',
  },
  todayText: {
    color: '#007AFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  selectedDateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  timeSlotsContainer: {
    flex: 1,
  },
  timeSlot: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeContainer: {
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    paddingRight: 16,
    marginRight: 16,
    justifyContent: 'center',
    minWidth: 80,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  taskContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
  },
  emptySlotContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emptySlotText: {
    fontSize: 16,
    color: '#666',
  },
  assignButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  assignButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});