import { useState, useRef, useEffect } from "react";
import { Alert, Modal, Text, StyleSheet, View, Pressable, ScrollView } from "react-native";
import {LinearGradient} from "expo-linear-gradient";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const years = Array.from({ length: 2030 - 2010 + 1 }, (_, i) => 2010 + i);

export default function MonthlyCalendarModal() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const monthScrollRef = useRef(null);
  const yearScrollRef = useRef(null);
  
  const ITEM_HEIGHT = 40;

  // Auto-scroll to current month and year when modal opens
  useEffect(() => {
    if (modalVisible) {
      setTimeout(() => {
        // Scroll to current month
        monthScrollRef.current?.scrollTo({
          y: selectedMonth * ITEM_HEIGHT,
          animated: true,
        });
        
        // Scroll to current year
        const yearIndex = years.indexOf(selectedYear);
        if (yearIndex !== -1) {
          yearScrollRef.current?.scrollTo({
            y: yearIndex * ITEM_HEIGHT,
            animated: true,
          });
        }
      }, 100);
    }
  }, [modalVisible]);

  const handleMonthScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, monthNames.length - 1));
    setSelectedMonth(clampedIndex);
  };

  const handleYearScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, years.length - 1));
    setSelectedYear(years[clampedIndex]);
  };

  const handleContinue = () => {
    console.log(`Selected: ${monthNames[selectedMonth]} ${selectedYear}`);
    setModalVisible(false);
  };

  const handleOpenModal = () => {
    // Reset to current month and year when opening
    const now = new Date();
    setSelectedMonth(now.getMonth());
    setSelectedYear(now.getFullYear());
    setModalVisible(true);
  };

  return(<View>
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Selection indicator - Blue strip */}
          <View style={styles.selectionStrip} />
          
          <View style={styles.scrollContainer}>
            {/* Month ScrollView */}
            <View style={styles.columnContainer}>
              <LinearGradient
                colors={['white', 'transparent']}
                style={styles.topFade}
                pointerEvents='none'
              />
              <ScrollView 
                ref={monthScrollRef}
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                onMomentumScrollEnd={handleMonthScroll}
                onScrollEndDrag={handleMonthScroll}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
              >
                {monthNames.map((monthName, index) => (
                  <View 
                    key={monthName}
                    style={styles.itemContainer}
                  >
                    <Text style={[
                      styles.itemText,
                      selectedMonth === index && styles.selectedText
                    ]}>
                      {monthName}
                    </Text>
                  </View>
                ))}
              </ScrollView>
              <LinearGradient
                colors={['transparent', 'white']}
                style={styles.bottomFade}
                pointerEvents="none"
              />
            </View>

            {/* Year ScrollView */}
            <View style={styles.columnContainer}>
              <LinearGradient
                colors={['white', 'transparent']}
                style={styles.topFade}
                pointerEvents='none'
              />
              <ScrollView 
                ref={yearScrollRef}
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                onMomentumScrollEnd={handleYearScroll}
                onScrollEndDrag={handleYearScroll}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
              >
                {years.map((year) => (
                  <View 
                    key={year}
                    style={styles.itemContainer}
                  >
                    <Text style={[
                      styles.itemText,
                      selectedYear === year && styles.selectedText
                    ]}>
                      {year}
                    </Text>
                  </View>
                ))}
              </ScrollView>
              <LinearGradient
                colors={['transparent', 'white']}
                style={styles.bottomFade}
                pointerEvents="none"
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.buttonCancel]}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>CANCEL</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonContinue]}
              onPress={handleContinue}>
              <Text style={styles.buttonText}>CONTINUE</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>

    <Pressable
      style={[styles.button, styles.buttonOpen]}
      onPress={handleOpenModal}>
      <Text style={styles.buttonText}>Select Month & Year</Text>
    </Pressable>
  </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 300,
    height: 280,
  },
  scrollContainer: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  columnContainer: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 80, // Extra padding for smooth scrolling
  },
  itemContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  selectedText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  selectionStrip: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    height: 40, // Same as ITEM_HEIGHT
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#2196F3',
    zIndex: 2,
    marginTop: -20, // Half of height to center it
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonOpen: {
    backgroundColor: '#2196F3',
  },
  buttonCancel: {
    backgroundColor: '#666',
  },
  buttonContinue: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  topFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 1,
  },
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 1,
  },
});