import React, { useState } from 'react';
import { Button, Platform, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from "@expo/vector-icons";

export default function MyDateTimePicker({ mode, date, onDateChange, buttonTitle }) {
  const [show, setShow] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShow(false);
    if (selectedDate !== undefined) {
      onDateChange(selectedDate);
    }
  };

  const handlePress = () => {
    setShow(true);
  };

  return (
    <>

      <TouchableOpacity onPress={handlePress} style={styles.button}>
        {mode === 'date' ? (
          <View style={styles.iconContainer}>
            <Ionicons size={50} name="calendar"  color="green" />
          </View>
        ) : (
          <View style={styles.iconContainer}>
            <Ionicons size={50} name="time"  color="green" />
          </View>
        )}
      </TouchableOpacity>


      {show && mode === 'date' && (
        <DateTimePicker
          style={{ backgroundColor: "green" }}
          mode="date"
          value={date}
          onChange={handleDateChange}
          display={Platform.OS === 'ios' ? 'compact' : 'default'}
        />
      )}
      {show && mode === 'time' && (
        <DateTimePicker
          mode="time"
          value={date}
          onChange={handleDateChange}
          display={Platform.OS === 'ios' ? 'compact' : 'default'}
        />
      )}
    </>
  );
}
const styles = StyleSheet.create({

  iconContainer: {
    marginRight: 10,
    height: 50,
  },
});
