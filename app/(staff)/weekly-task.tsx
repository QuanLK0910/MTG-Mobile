import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { slotService, Slot } from "../../Services/slot";
import { authService } from "../../Services/auth";
import { getSchedulesForStaffFilterDate, createScheduleDetailForStaff, deleteScheduleDetail } from "@/Services/scheduledetail";
import { useAuth } from "@/contexts/AuthContext";
import { getTasksByAccount, createTask } from "@/Services/task";
import axios from "axios";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  martyrCode?: string;
  task?: {
    title: string;
    description: string;
    status: "pending" | "completed";
  };
}

// Add new interface for schedule detail
interface ScheduleDetail {
  id: number;
  title: string;
  description: string;
  status: "pending" | "completed";
  martyrCode: string;
}

// Add new interface for API response
interface ScheduleDetailResponse {
  date: string;
  description: string | null;
  endTime: string;
  martyrCode: string;
  scheduleDetailId: number;
  serviceName: string;
  slotId: number;
  startTime: string;
}

// Update the Task interface to match the API response
interface Task {
  taskId: number;
  accountId: number;
  fullname: string;
  orderId: number;
  detailId: number;
  startDate: string;
  endDate: string;
  description: string;
  status: number;
  imagePath1: string | null;
  imagePath2: string | null;
  imagePath3: string | null;
  reason: string | null;
  serviceName: string;
  serviceDescription: string;
  categoryName: string | null;
  graveLocation: string;
}

interface TaskResponse {
  tasks: Task[];
  totalPage: number;
}

// Add this helper function at the top of your component
const formatDeadline = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export default function WeeklyTaskPage() {
  const router = useRouter();
  const { getUserId } = useAuth();
  const accountId = getUserId();

  // Initialize with current week's Monday and today's date
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(
      today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
    ); // Handle Sunday case
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // Add new state for schedule details
  const [scheduleDetails, setScheduleDetails] = useState<
    Record<string, ScheduleDetail>
  >({});

  // Add these states with your existing states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  // Update the useEffect to use correct date parameters
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!accountId) {
          console.log("No accountId found in auth context");
          router.replace("/(auth)/login");
          return;
        }

        const slots = await slotService.getAll();
        const formattedSlots: TimeSlot[] = slots.map((slot) => ({
          id: slot.slotId.toString(),
          startTime: slot.startTime.substring(0, 5),
          endTime: slot.endTime.substring(0, 5),
        }));
        setTimeSlots(formattedSlots);

        const details: Record<string, ScheduleDetail> = {};
        
        // Debug logs
       

        // Format date consistently
        const localDate = new Date(selectedDate);
        const dateString = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
        
       

        const scheduleDetails = await getSchedulesForStaffFilterDate(
          accountId,
          dateString, // fromDate
          dateString  // toDate
        );

        

        // Process all schedule details at once
        scheduleDetails.forEach((detail) => {
          if (detail.slotId) {
            details[detail.slotId] = {
              id: detail.scheduleDetailId,
              title: detail.serviceName,
              description: detail.description || "",
              status: "pending",
              martyrCode: detail.martyrCode,
            };
          }
        });

        setScheduleDetails(details);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [selectedDate, accountId]);

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
  const navigateWeek = (direction: "prev" | "next") => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(
      currentWeekStart.getDate() + (direction === "next" ? 7 : -7)
    );
    setCurrentWeekStart(newWeekStart);
  };

  // Navigate to current week
  const goToCurrentWeek = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(
      today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
    );
    monday.setHours(0, 0, 0, 0);
    setCurrentWeekStart(monday);
    setSelectedDate(today);
  };

  // Vietnamese weekday names
  const getVietnameseWeekday = (date: Date, short: boolean = false) => {
    const weekdays = {
      short: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
      long: [
        "Chủ Nhật",
        "Thứ Hai",
        "Thứ Ba",
        "Thứ Tư",
        "Thứ Năm",
        "Thứ Sáu",
        "Thứ Bảy",
      ],
    };
    return weekdays[short ? "short" : "long"][date.getDay()];
  };

  // Vietnamese month names
  const getVietnameseMonth = (date: Date) => {
    const months = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
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

  const handleAssignSlot = async (slot: TimeSlot) => {
    try {
      setIsLoadingTasks(true);
      setSelectedSlotForRegistration(slot);

      const accountId = getUserId();
      if (!accountId) throw new Error("No user ID found");

      // Fix: Use the same date formatting here
      const localDate = new Date(selectedDate);
      const formattedDate = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;

      console.log("Fetching tasks for date:", formattedDate);
      const response: TaskResponse = await getTasksByAccount(
        accountId,
        formattedDate
      );
      

      if (response && response.tasks) {
        setTasks(response.tasks);
        setIsRegistrationModalVisible(true);
      } else {
        Alert.alert(
          "Thông báo", 
          "Không tìm thấy nhiệm vụ nào cho ngày này",
          [{ text: "Đóng", style: "default" }]
        );
      }
    } catch (error: any) {
      console.error("Error fetching tasks:", error);
      Alert.alert(
        "Lỗi",
        "Không thể tải danh sách nhiệm vụ vì bạn chưa có nhiệm vụ đuợc phân công",
        [{ text: "Đóng", style: "default" }]
      );
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleConfirmRegistration = async (task: Task) => {
    if (!selectedSlotForRegistration) return;

    Alert.alert(
      "Xác nhận đăng ký",
      `Bạn có chắc chắn muốn ăng ký dịch vụ "${task.serviceName}" cho ca ${selectedSlotForRegistration.startTime} - ${selectedSlotForRegistration.endTime}?`,
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Xác nhận",
          onPress: async () => {
            try {
              const accountId = getUserId();
              if (!accountId) throw new Error("No user ID found");

              // Fix: Format the date correctly to preserve local date
              const localDate = new Date(selectedDate);
              const formattedDate = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;

              const success = await createScheduleDetailForStaff(accountId, {
                taskId: task.taskId,
                slotId: parseInt(selectedSlotForRegistration.id),
                date: formattedDate, // Use the formatted local date
                description: task.description || ''
              });

              if (success) {
                Alert.alert(
                  "Thành công",
                  "Đăng ký ca làm việc thành công!",
                  [{ text: "OK" }]
                );
                
                setIsRegistrationModalVisible(false);
                setSelectedSlotForRegistration(null);
                
                // Refresh the schedule details
                const date = selectedDate.toISOString().split("T")[0];
                const updatedSchedules = await getSchedulesForStaffFilterDate(
                  accountId,
                  date,
                  date
                );
                
                // Update the schedule details state
                const details: Record<string, ScheduleDetail> = {};
                updatedSchedules.forEach((detail) => {
                  if (detail.slotId) {
                    details[detail.slotId] = {
                      id: detail.scheduleDetailId,
                      title: detail.serviceName,
                      description: detail.description || "",
                      status: "pending",
                      martyrCode: detail.martyrCode,
                    };
                  }
                });
                setScheduleDetails(details);
              } else {
                throw new Error("Failed to create schedule detail");
              }

            } catch (error) {
              console.error("Error creating schedule detail:", error);
                const errorMessage = error.response.data.messaege || 
                                 "Không thể đăng ký ca làm việc. Vui lòng thử lại sau.";
              Alert.alert(
                "Lỗi",
                errorMessage,
                [{ text: "Đóng" }]
              );
            }
          }
        }
      ]
    );
  };

  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isEmptySlotModalVisible, setIsEmptySlotModalVisible] = useState(false);

  // Update handleSlotPress to use correct date parameters
  const handleSlotPress = async (slot: TimeSlot) => {
    try {
      const accountId = getUserId();
      if (!accountId) {
        throw new Error("User not authenticated");
      }

      // Check if there's a schedule for this slot
      const scheduleDetail = scheduleDetails[slot.id];
      if (scheduleDetail) {
        // Navigate to check-in page with both required parameters
        router.push({
          pathname: "/(staff)/weekly-task-checkin",
          params: {
            accountId: accountId.toString(),
            scheduleDetailId: scheduleDetail.id.toString()
          }
        });
      } else {
        // Handle empty slot
        setSelectedSlot(slot);
        setIsEmptySlotModalVisible(true);
      }
    } catch (error) {
      console.error("Failed to handle slot press:", error);
      Alert.alert(
        "Lỗi",
        "Không thể truy cập trang check-in. Vui lòng thử lại sau.",
        [{ text: "Đóng" }]
      );
    }
  };

  const [isRegistrationModalVisible, setIsRegistrationModalVisible] =
    useState(false);
  const [selectedSlotForRegistration, setSelectedSlotForRegistration] =
    useState<TimeSlot | null>(null);

  const handleCreateTask = () => {
    if (selectedSlot) {
      router.push({
        pathname: "/(staff)/create-task",
        params: {
          slotId: selectedSlot.id,
          date: selectedDate.toISOString().split("T")[0],
        },
      });
    }
  };

  const handleDeleteSchedule = (scheduleId: number, slotId: string) => {
    Alert.alert(
      "Xác nhận hủy ca",
      "Bạn có chắc chắn muốn hủy ca làm việc này?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Xác nhận",
          style: "destructive",
          onPress: async () => {
            try {
              const accountId = getUserId();
              if (!accountId) throw new Error("No user ID found");

              const success = await deleteScheduleDetail(scheduleId, accountId);
              
              if (success) {
                Alert.alert("Thành công", "Đã hủy ca làm việc thành công!");
                
                // Refresh the schedule details
                const date = selectedDate.toISOString().split("T")[0];
                const updatedSchedules = await getSchedulesForStaffFilterDate(
                  accountId,
                  date,
                  date
                );
                
                // Update the schedule details state
                const details: Record<string, ScheduleDetail> = {};
                updatedSchedules.forEach((detail) => {
                  if (detail.slotId) {
                    details[detail.slotId] = {
                      id: detail.scheduleDetailId,
                      title: detail.serviceName,
                      description: detail.description || "",
                      status: "pending",
                      martyrCode: detail.martyrCode,
                    };
                  }
                });
                setScheduleDetails(details);
              }
            } catch (error) {
              console.error("Error deleting schedule:", error);
              
              // Check if it's an Axios error with a response
              if (axios.isAxiosError(error) && error.response) {
                // Show the specific error message from the API
                const errorMessage = error.response.data.messaege || 
                                   "Đã quá hạn thời gian để hủy lịch trình (phải cập nhật 1 ngày trước ngày làm việc)";
                Alert.alert(
                  "Lỗi",
                  errorMessage,
                  [{ text: "Đóng" }]
                );
              } else {
                // Show generic error for other types of errors
                Alert.alert(
                  "Lỗi",
                  "Đã quá hạn thời gian để hủy lịch trình (phải cập nhật 1 ngày trước ngày làm việc)",
                  [{ text: "Đóng" }]
                );
              }
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch Làm Việc</Text>
        <Text style={styles.headerSubtitle}>{getWeekRangeString()}</Text>
      </View>

      <View style={styles.dateNavigator}>
        <TouchableOpacity
          onPress={() => navigateWeek("prev")}
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
                date.toDateString() === selectedDate.toDateString() &&
                  styles.selectedDate,
                isToday(date) && styles.todayDate,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  date.toDateString() === selectedDate.toDateString() &&
                    styles.selectedText,
                  isToday(date) && styles.todayText,
                ]}
              >
                {getVietnameseWeekday(date, true)}
              </Text>
              <Text
                style={[
                  styles.dateText,
                  date.toDateString() === selectedDate.toDateString() &&
                    styles.selectedText,
                  isToday(date) && styles.todayText,
                ]}
              >
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          onPress={() => navigateWeek("next")}
          style={styles.navigationButton}
        >
          <Ionicons name="chevron-forward" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.selectedDateText}>
          {`${getVietnameseWeekday(
            selectedDate
          )}, ${selectedDate.getDate()} ${getVietnameseMonth(
            selectedDate
          )} ${selectedDate.getFullYear()}`}
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

              {scheduleDetails[slot.id] ? (
                <View style={styles.taskContainer}>
                  <View style={styles.taskContent}>
                    <View style={styles.taskHeader}>
                      <Text style={styles.taskTitle}>
                        {scheduleDetails[slot.id].title}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleDeleteSchedule(scheduleDetails[slot.id].id, slot.id)}
                        style={styles.deleteButton}
                      >
                        <Ionicons name="trash-outline" size={20} color="#ff4444" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.martyrCode}>
                      Mã mộ: {scheduleDetails[slot.id].martyrCode}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.emptySlotContainer}>
                  <Text style={styles.emptySlotText}>Trống</Text>
                  <TouchableOpacity
                    style={styles.assignButton}
                    onPress={() => handleAssignSlot(slot)}
                  >
                    <Text style={styles.assignButtonText}>Đăng ký ca</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Registration Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isRegistrationModalVisible}
        onRequestClose={() => setIsRegistrationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Đăng ký ca làm việc</Text>
              <TouchableOpacity
                onPress={() => setIsRegistrationModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedSlotForRegistration && (
              <Text style={styles.modalText}>
                Ca làm việc: {selectedSlotForRegistration.startTime} -{" "}
                {selectedSlotForRegistration.endTime}
              </Text>
            )}

            {isLoadingTasks ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : tasks.length > 0 ? (
              <ScrollView style={styles.taskList}>
                {tasks.map((task) => (
                  <TouchableOpacity
                    key={task.taskId}
                    style={styles.taskItem}
                    onPress={() => handleConfirmRegistration(task)}
                  >
                    <Text style={styles.taskItemTitle}>{task.serviceName}</Text>
                    <Text style={styles.taskItemDescription}>
                      {task.serviceDescription}
                    </Text>
                    <Text style={styles.graveLocation}>
                      Vị trí: {task.graveLocation}
                    </Text>
                    <Text style={styles.deadline}>
                      Hạn chót: {formatDeadline(task.endDate)}
                    </Text>
                    <Text style={styles.taskDescription}>
                      {task.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.emptyText}>
                Không có nhiệm vụ nào cho ngày này
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  dateNavigator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  navigationButton: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
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
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 70,
    margin: 4,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  selectedDate: {
    backgroundColor: "#007AFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  todayDate: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  dayText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  selectedText: {
    color: "#fff",
  },
  todayText: {
    color: "#007AFF",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  selectedDateText: {
    fontSize: 16,
    color: "#666",
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 4,
  },
  martyrCode: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  emptyText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 4,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f1f1',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  taskList: {
    maxHeight: 300,
    marginVertical: 16,
  },
  taskItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  taskItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  taskItemDescription: {
    fontSize: 14,
    color: '#666',
  },
  graveLocation: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  deadline: {
    fontSize: 14,
    color: '#ff6b6b',  // A reddish color to emphasize the deadline
    marginTop: 4,
    fontWeight: '500',
  },
});
