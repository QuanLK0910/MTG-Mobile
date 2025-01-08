import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import memorial1 from "../../../../assets/images/memorial1.jpg";
import memorial2 from "../../../../assets/images/memorial2.jpg";
import memorial3 from "../../../../assets/images/memorial3.jpg";
import { getTrendingServices } from "../../../../Services/service";
import type { Service } from "../../../../Services/service";
const { width: screenWidth } = Dimensions.get("window");

const HomeScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [trendingServices, setTrendingServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const sliderImages = [memorial1, memorial2, memorial3];

  // Auto-slide effect
  React.useEffect(() => {
    const slideInterval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % sliderImages.length;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: nextSlide * screenWidth,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(slideInterval);
  }, [currentSlide]);

  // Fetch trending services
  React.useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const services = await getTrendingServices();
        setTrendingServices(services);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

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
                style={[
                  styles.paginationDot,
                  currentSlide === index
                    ? styles.activeDot
                    : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Introduction Section */}
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>
            Giới thiệu về nghĩa trang liệt sỹ TP.HCM
          </Text>
          <View style={styles.introContentContainer}>
            <View style={styles.introContent}>
              <Text style={styles.introLetter}>N</Text>
              <Text style={styles.introText}>
                ghĩa trang liệt sỹ TP.HCM là một địa điểm linh thiêng, nơi an nghỉ
                vĩnh hằng của những anh hùng đã hiến dâng cuộc đời mình cho sự
                nghiệp đấu tranh giành độc lập, tự do và thống nhất Tổ quốc. Đây
                là biểu tượng cao quý của lòng yêu nước, sự hy sinh cao cả và tinh
                thần bất khuất của dân tột Việt Nam. Du khách đến viếng thăm không
                chỉ để dâng hương tưởng niệm, mà còn để thể hiện lòng tri ân sâu
                sắc đối với những người chiến sĩ đã ngã xuống vì nền hòa bình và
                độc lập dân tộc. Nghĩa trang liệt sỹ TP.HCM là biểu tượng trường tồn của
                lòng biết ơn và sự kính trọng đối với những người anh hùng đã viết
                nên trang sử vàng chói lọi của đất nước.
              </Text>
            </View>
          </View>
        </View>

        {/* Map Section */}
        <View style={styles.mapSection}>
          <View style={styles.titleWrapper}>
            <View style={styles.titleContainer}>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.mapHeader}>Bản đồ nghĩa trang liệt sĩ TP.HCM</Text>
              <Text style={styles.dot}>•</Text>
            </View>
            <View style={styles.underline} />
          </View>
          <View style={styles.mapContainer}>
            <Image 
              source={require('../../../../assets/images/map.png')}
              style={styles.mapImage}
              resizeMode="contain"
            />
            <TouchableOpacity 
              style={styles.selectZoneButton}
              onPress={() => {/* Handle zone selection */}}
            >
              <Text style={styles.selectZoneButtonText}>Chọn khu vực</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trending Services Section */}
        <View style={styles.servicesSection}>
          <View style={styles.titleWrapper}>
            <View style={styles.titleContainer}>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.sectionHeader}>Dịch vụ xu hướng</Text>
              <Text style={styles.dot}>•</Text>
            </View>
            <View style={styles.underline} />
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#991b1b" />
            </View>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.servicesScrollView}
            >
              {trendingServices.map((service) => (
                <TouchableOpacity 
                  key={service.serviceId} 
                  style={styles.serviceCard}
                  onPress={() => {/* Handle service selection */}}
                >
                  <Image
                    source={{ uri: service.imagePath }}
                    style={styles.serviceImage}
                    resizeMode="cover"
                  />
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{service.serviceName}</Text>
                    <Text style={styles.servicePrice}>
                      {service.price.toLocaleString()}đ
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  sliderContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    marginBottom: 0,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: "white",
  },
  inactiveDot: {
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  introSection: {
    padding: 20,
    backgroundColor: "#fff",
  },
  introTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  introContentContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#991b1b',
  },
  introContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  introLetter: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#991b1b",
    marginRight: 4,
    lineHeight: 36,
  },
  introText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: "#4b5563",
    textAlign: "justify",
  },
  mapSection: {
    padding: 24,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  dot: {
    color: '#3B82F6',
    fontSize: 16,
    marginHorizontal: 8,
  },
  mapHeader: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
    textAlign: "center",
  },
  underline: {
    width: 60,
    height: 1,
    backgroundColor: '#3B82F6',
    marginTop: 4,
  },
  mapContainer: {
    alignItems: 'center',
  },
  mapImage: {
    width: '100%',
    height: 300,
    marginBottom: 16,
  },
  selectZoneButton: {
    backgroundColor: '#991b1b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  selectZoneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  servicesSection: {
    padding: 16,
    backgroundColor: '#fff',
  },
  servicesScrollView: {
    paddingVertical: 16,
    gap: 16,
  },
  serviceCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  serviceInfo: {
    padding: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 14,
    color: '#991b1b',
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
