import { StyleSheet, Text, View, Button } from 'react-native';
import MonthlyCalendarModal from './components/MonthlyCalendarModal';

export default function App() {

  return (
    <View style={styles.container}>
      <MonthlyCalendarModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
