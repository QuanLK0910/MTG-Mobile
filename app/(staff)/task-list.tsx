import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const data = [
    { id: '1', task: 'Thay hoa', location: 'k10', time: '09:00', deadline: '2024-11-02', status: 'Chờ xác nhận', action: 'Xác nhận' },
    { id: '2', task: 'Quét lá', location: 'k10', time: '14:00', deadline: '2024-11-29', status: 'Chờ xác nhận', action: 'Xác nhận' },
    { id: '3', task: 'Thay cây', location: 'k10', time: '10:00', deadline: '2024-10-30', status: 'Chờ xác nhận', action: 'Xác nhận' },
    { id: '4', task: 'Tưới cây', location: 'k10', time: '10:00', deadline: '2024-11-5', status: 'Chờ xác nhận', action: 'Xác nhận' },
];

const TaskManagement = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateType, setDateType] = useState('start'); // 'start' or 'end'
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const handleFilterSelect = (filter) => {
        setSelectedFilter(filter);
    };

    const handleConfirm = (date) => {
        if (dateType === 'start') {
            setStartDate(date);
        } else {
            setEndDate(date);
        }
        setShowDatePicker(false);
    };

    // Function to determine the priority based on the deadline
    const getPriority = (deadline) => {
        const currentDate = new Date();
        const deadlineDate = new Date(deadline);
        const timeDiff = deadlineDate.getTime() - currentDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days

        if (daysDiff < 2) {
            return { label: 'Cao', color: 'red' }; // High priority
        } else if (daysDiff >= 2 && daysDiff <= 4) {
            return { label: 'Trung Bình', color: '#FFCC00' }; // Medium priority
        } else {
            return { label: 'Thấp', color: 'green' }; // Low priority
        }
    };

    const renderItem = ({ item }) => {
        const currentDate = new Date();
        const deadlineDate = new Date(item.deadline);
        const isOverdue = deadlineDate < currentDate; // Check if the deadline is overdue
        const priority = getPriority(item.deadline); // Get priority object

        return (
            <TouchableOpacity onPress={() => router.push('/task-details')}>
                <View style={styles.row}>
                    <Text style={styles.cell}>{item.task}</Text>
                    <Text style={styles.cell}>{item.location}</Text>
                    <Text style={[styles.cell, { color: priority.color }]}>{isOverdue ? 'QUÁ HẠN' : item.status}</Text>
                    <Text style={[styles.cell, { color: priority.color }]}>{isOverdue ? priority.label : priority.label}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quản Lý Công Việc</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.filterButton, selectedFilter === 'all' && styles.selectedButton]}
                    onPress={() => handleFilterSelect('all')}
                >
                    <Text style={styles.buttonText}>Tất cả</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, selectedFilter === 'completed' && styles.selectedButton]}
                    onPress={() => handleFilterSelect('completed')}
                >
                    <Text style={styles.buttonText}>Đã hoàn thành</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, selectedFilter === 'notCompleted' && styles.selectedButton]}
                    onPress={() => handleFilterSelect('notCompleted')}
                >
                    <Text style={styles.buttonText}>Chưa hoàn thành</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.dateContainer}>
                
               
            </View>

            <View style={styles.header}>
                <Text style={styles.headerText}>Công việc</Text>
                <Text style={styles.headerText}>Vị trí</Text>
                <Text style={styles.headerText}>Trạng thái</Text>
                <Text style={styles.headerText}>Độ ưu tiên</Text>
            </View>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
            />
            <DateTimePickerModal
                isVisible={showDatePicker}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={() => setShowDatePicker(false)}
                date={dateType === 'start' ? startDate : endDate}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    filterButton: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    selectedButton: {
        backgroundColor: '#007BFF',
    },
    buttonText: {
        color: '#333',
        fontWeight: 'bold',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    dateLabel: {
        marginRight: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        flex: 1,
        borderRadius: 5,
        backgroundColor: 'white',
        color: 'black',
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#e0e0e0',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    headerText: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: 'white',
        borderRadius: 5,
        marginBottom: 5,
    },
    cell: {
        flex: 2,
        textAlign: 'center',
    },
    actionButton: {
        backgroundColor: '#007BFF',
        padding: 5,
        borderRadius: 5,
    },
    actionText: {
        color: 'white',
    },
    listContainer: {
        paddingBottom: 20,
    },
});

export default TaskManagement; 