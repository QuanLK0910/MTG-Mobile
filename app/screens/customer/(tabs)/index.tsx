import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  Dimensions, 
  TouchableOpacity, 
  SafeAreaView, 
  StyleSheet 
} from 'react-native';
import memorial1 from '../../../../assets/images/memorial1.jpg';
import memorial2 from '../../../../assets/images/memorial2.jpg';
import memorial3 from '../../../../assets/images/memorial3.jpg';
const { width: screenWidth } = Dimensions.get('window');

const HomeScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const sliderImages = [
    memorial1,
    memorial2,
    memorial3
  ];

  // Auto-slide effect
  React.useEffect(() => {
    const slideInterval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % sliderImages.length;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: nextSlide * screenWidth,
        animated: true
      });
    }, 3000);

    return () => clearInterval(slideInterval);
  }, [currentSlide]);

  const services = [
    {
      title: 'Chăm Sóc Phần Mộ',
      description: 'Vệ sinh, chăm sóc cảnh quan và bảo tồn các khu tưởng niệm.',
      icon: '🌿'
    },
    {
      title: 'Tưởng Niệm Số',
      description: 'Nền tảng trực tuyến để tưởng nhớ và tôn vinh câu chuyện và sự hy sinh của các liệt sĩ.',
      icon: '💻'
    },
    {
      title: 'Hỗ Trợ Gia Đình',
      description: 'Dịch vụ tư vấn và hỗ trợ dành cho gia đình liệt sĩ.',
      icon: '❤️'
    }
  ];

  // Fix the width issue for slider images
  const renderSliderImage = (image: any, index: number) => (
    <Image
      key={index}
      source={image}
      style={{ width: screenWidth, height: 200 }}
      resizeMode="cover"
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Image Slider */}
        <View style={styles.sliderContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(event) => {
              const slideIndex = Math.round(
                event.nativeEvent.contentOffset.x / screenWidth
              );
              setCurrentSlide(slideIndex);
            }}
            scrollEventThrottle={16}
          >
            {sliderImages.map(renderSliderImage)}
          </ScrollView>

          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            {sliderImages.map((_, index) => (
              <View
                key={index}
                style={[styles.paginationDot, currentSlide === index ? styles.activeDot : styles.inactiveDot]}
              />
            ))}
          </View>
        </View>

        {/* Introduction Section */}
        <View style={styles.introSection}>
          <View style={styles.introHeader}>
            <Text style={styles.title}>
              Tưởng Nhớ Các Anh Hùng Liệt Sĩ
            </Text>
            <Text style={styles.subtitle}>
              Gìn Giữ Di Sản • Tôn Vinh Hy Sinh • Xây Dựng Tương Lai
            </Text>
          </View>
          <Text style={styles.description}>
            Chúng tôi đứng vững như những người gìn giữ ký ức thiêng liêng của dân tộc, 
            tận tâm bảo tồn di sản vĩnh cửu của các anh hùng liệt sĩ. Thông qua sự chăm sóc 
            tỉ mỉ và cam kết không ngừng nghỉ, chúng tôi đảm bảo rằng sự hy sinh của họ 
            sẽ tiếp tục truyền cảm hứng cho các thế hệ mai sau.
          </Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => {/* Add navigation or action here */}}
          >
            <Text style={styles.buttonText}>
              Tìm Hiểu Thêm Về Sứ Mệnh
            </Text>
          </TouchableOpacity>
        </View>

        {/* Services Section */}
        <View style={styles.servicesSection}>
          <Text style={styles.servicesHeader}>
            Dịch Vụ Của Chúng Tôi
          </Text>
          <View style={styles.servicesContainer}>
            {services.map((service, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.service}
              >
                <Text style={styles.icon}>{service.icon}</Text>
                <View style={styles.serviceContent}>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.serviceDescription}>{service.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  sliderContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    marginBottom: 0,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: 'white',
  },
  inactiveDot: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  introSection: {
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  introHeader: {
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
    paddingLeft: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#059669',
    fontWeight: 'medium',
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#059669',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'semibold',
    color: 'white',
  },
  servicesSection: {
    padding: 24,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  servicesHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  servicesContainer: {
    gap: 16,
  },
  service: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    fontSize: 32,
    marginRight: 16,
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 16,
    color: '#6b7280',
  },
});

export default HomeScreen;