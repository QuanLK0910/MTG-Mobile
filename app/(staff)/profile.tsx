import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install this package if not already done
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker

// Reusable Input Component
const InputField: React.FC<{
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    styles: any;
}> = ({ placeholder, value, onChangeText, secureTextEntry, styles }) => (
    <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
    />
);

const ProfileScreen: React.FC = () => {
    const [avatar, setAvatar] = useState<string>('');
    const [fullName, setFullName] = useState<string>('Nguyễn Văn A');
    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(new Date());
    const [address, setAddress] = useState<string>('123 Đường ABC, Quận 1');
    const [email, setEmail] = useState<string>('example@example.com');
    const [currentPassword, setCurrentPassword] = useState<string>('43925860439342');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false); // State for showing current password
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false); // State to show/hide date picker

    const handleUpdate = () => {
        // Logic to update user information
    };

    const handleImagePick = () => {
        // Logic to pick an image from the gallery or camera
    };

    const onChangeDate = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || dateOfBirth;
        setShowDatePicker(false);
        setDateOfBirth(currentDate); // Update the date of birth state
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thông tin tài khoản</Text>
            <TouchableOpacity onPress={handleImagePick} style={styles.avatarContainer}>
                {avatar ? (
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>Ảnh đại diện</Text>
                    </View>
                )}
            </TouchableOpacity>
            <Text>Họ và tên</Text>
            <InputField 
                placeholder="Họ và tên" 
                value={fullName} 
                onChangeText={setFullName} 
                styles={styles}
            />
            <Text>Ngày sinh</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                <Text>{dateOfBirth ? dateOfBirth.toLocaleDateString() : 'Chọn ngày sinh'}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={dateOfBirth || new Date()}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                />
            )}
            <Text>Địa chỉ</Text>
            <InputField 
                placeholder="Địa chỉ" 
                value={address} 
                onChangeText={setAddress} 
                styles={styles}
            />
            <Text>Email</Text>
            <InputField 
                placeholder="Email" 
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address" 
                styles={styles}
            />
            <Text>Mật khẩu hiện tại</Text>
            <View style={{ position: 'relative' }}>
                <InputField 
                    value={currentPassword} 
                    onChangeText={setCurrentPassword} 
                    secureTextEntry={!showCurrentPassword} // Toggle visibility
                    styles={styles} 
                    placeholder="Mật khẩu hiện tại"
                />
                <TouchableOpacity 
                    style={{ position: 'absolute', right: 10, top: 15 }} 
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)} // Toggle password visibility
                >
                    <Ionicons 
                        name={showCurrentPassword ? 'eye-off' : 'eye'} 
                        size={24} 
                        color="#007BFF" // Color for the icon
                    />
                </TouchableOpacity>
            </View>
            <Text>Mật khẩu mới</Text>
            <InputField 
                value={newPassword} 
                onChangeText={setNewPassword} 
                secureTextEntry={true}
                styles={styles}
            />
            <Text>Xác nhận mật khẩu</Text>
            <InputField 
                value={confirmPassword} 
                onChangeText={setConfirmPassword} 
                secureTextEntry={true}
                styles={styles}
            />
            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Cập nhật thông tin</Text>
            </TouchableOpacity>
            
        </View>
    );
    
};
const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#f5f5f5',
  },
  title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginTop:20,
      marginBottom: 20,
      color: '#333',
      textAlign: 'center',
  },
  input: {
      height: 50,
      borderColor: '#007BFF',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 16,
      paddingHorizontal: 12,
      backgroundColor: '#fff',
  },
  button: {
      backgroundColor: '#007BFF',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 20,
      alignItems: 'center',
  },
  buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
  },
  avatarContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20, // Space below the avatar
  },
  avatar: {
      width: 100, // Width of the avatar
      height: 100, // Height of the avatar
      borderRadius: 50, // Circular shape
  },
  avatarPlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: '#e0e0e0', // Placeholder background color
      alignItems: 'center',
      justifyContent: 'center',
  },
  avatarText: {
      color: '#888', // Placeholder text color
      fontSize: 16,
  },
});

export default ProfileScreen;
