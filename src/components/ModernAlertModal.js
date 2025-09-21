import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import DateTimePicker from "@react-native-community/datetimepicker";

import { theme } from "../styles/theme";
import { commonStyles } from "../styles/common";

export default function ModernAlertModal({
  visible,
  onClose,
  onSave,
  alertType = "custom",
  editingAlert = null,
}) {
  const [alertName, setAlertName] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [isRepeating, setIsRepeating] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDays, setSelectedDays] = useState([
    true,
    true,
    true,
    true,
    true,
    true,
    true, // All days selected by default
  ]);

  const alertTypes = {
    medication: {
      name: "Medication",
      icon: "medical",
      color: "#FF6B6B",
      defaultName: "Take medication",
    },
    water: {
      name: "Water",
      icon: "water",
      color: "#4ECDC4",
      defaultName: "Drink water",
    },
    exercise: {
      name: "Exercise",
      icon: "fitness",
      color: "#45B7D1",
      defaultName: "Workout time",
    },
    sleep: {
      name: "Sleep",
      icon: "bed",
      color: "#96CEB4",
      defaultName: "Bedtime",
    },
    meal: {
      name: "Meal",
      icon: "restaurant",
      color: "#FECA57",
      defaultName: "Meal time",
    },
    custom: {
      name: "Custom",
      icon: "notifications",
      color: "#A55EEA",
      defaultName: "Custom reminder",
    },
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    if (visible) {
      if (editingAlert) {
        // Populate form with existing alert data
        setAlertName(editingAlert.message || "");
        const [hours, minutes] = editingAlert.time.split(":");
        const dateTime = new Date();
        dateTime.setHours(parseInt(hours), parseInt(minutes));
        // If editing alert has a date, use it, otherwise use today
        if (editingAlert.date) {
          const alertDate = new Date(editingAlert.date);
          dateTime.setFullYear(alertDate.getFullYear(), alertDate.getMonth(), alertDate.getDate());
        }
        setSelectedDateTime(dateTime);
        setIsRepeating(editingAlert.frequency === "daily");
        // Set days based on alert data (simplified - assuming daily means all days)
        setSelectedDays([true, true, true, true, true, true, true]);
      } else {
        // Reset form for new alert - default to current time + 5 minutes
        setAlertName(alertTypes[alertType]?.defaultName || "");
        const defaultDateTime = new Date();
        defaultDateTime.setMinutes(defaultDateTime.getMinutes() + 5);
        setSelectedDateTime(defaultDateTime);
        setIsRepeating(true);
        setSelectedDays([true, true, true, true, true, true, true]);
      }
    }
  }, [visible, editingAlert, alertType]);

  const handleSave = () => {
    if (!alertName.trim()) {
      Alert.alert("Error", "Please enter an alert name");
      return;
    }

    // Check if the selected date/time is in the past for one-time alerts
    if (!isRepeating && selectedDateTime < new Date()) {
      Alert.alert("Error", "Please select a future date and time for one-time alerts");
      return;
    }

    const alertData = {
      id: editingAlert?.id,
      type: alertType,
      message: alertName.trim(),
      time: selectedDateTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      date: selectedDateTime.toISOString().split('T')[0], // YYYY-MM-DD format
      dateTime: selectedDateTime.toISOString(),
      frequency: isRepeating ? "daily" : "once",
      enabled: true,
      days: selectedDays,
    };

    onSave(alertData);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const toggleDay = (index) => {
    const newDays = [...selectedDays];
    newDays[index] = !newDays[index];
    setSelectedDays(newDays);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const newDateTime = new Date(selectedDateTime);
      newDateTime.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setSelectedDateTime(newDateTime);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const newDateTime = new Date(selectedDateTime);
      newDateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setSelectedDateTime(newDateTime);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const formatDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const currentType = alertTypes[alertType];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <LinearGradient
          colors={[currentType.color + "10", theme.colors.background]}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: theme.spacing.lg,
              paddingVertical: theme.spacing.md,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border,
            }}
          >
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>

            <View style={{ alignItems: "center", flex: 1 }}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: currentType.color + "20",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: theme.spacing.xs,
                }}
              >
                <Ionicons
                  name={currentType.icon}
                  size={24}
                  color={currentType.color}
                />
              </View>
              <Text
                style={[
                  commonStyles.subtitle,
                  { color: theme.colors.text, textAlign: "center" },
                ]}
              >
                {editingAlert ? "Edit" : "New"} {currentType.name} Alert
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleSave}
              style={{
                backgroundColor: currentType.color,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
                borderRadius: theme.borderRadius.md,
              }}
            >
              <Text
                style={[
                  commonStyles.buttonText,
                  { color: "white", fontSize: theme.fontSizes.sm },
                ]}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: theme.spacing.lg }}
            showsVerticalScrollIndicator={false}
          >
            {/* Alert Name */}
            <View style={{ marginBottom: theme.spacing.xl }}>
              <Text
                style={[
                  commonStyles.bodyText,
                  {
                    fontFamily: theme.fonts.semiBold,
                    marginBottom: theme.spacing.sm,
                    color: theme.colors.text,
                  },
                ]}
              >
                Alert Name
              </Text>
              <TextInput
                style={[
                  commonStyles.input,
                  {
                    borderColor: currentType.color + "40",
                    borderWidth: 2,
                  },
                ]}
                value={alertName}
                onChangeText={setAlertName}
                placeholder={`Enter ${currentType.name.toLowerCase()} reminder name`}
                placeholderTextColor={theme.colors.textSecondary}
                maxLength={100}
              />
            </View>

            {/* Date & Time Selection */}
            <View style={{ marginBottom: theme.spacing.xl }}>
              <Text
                style={[
                  commonStyles.bodyText,
                  {
                    fontFamily: theme.fonts.semiBold,
                    marginBottom: theme.spacing.sm,
                    color: theme.colors.text,
                  },
                ]}
              >
                {isRepeating ? "Time" : "Date & Time"}
              </Text>
              
              {/* Date Selection - Only show for one-time alerts */}
              {!isRepeating && (
                <TouchableOpacity
                  style={[
                    commonStyles.card,
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderColor: currentType.color + "40",
                      borderWidth: 2,
                      marginBottom: theme.spacing.md,
                    },
                  ]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={currentType.color}
                    />
                    <Text
                      style={[
                        commonStyles.bodyText,
                        {
                          marginLeft: theme.spacing.sm,
                          fontFamily: theme.fonts.semiBold,
                        },
                      ]}
                    >
                      Date:
                    </Text>
                  </View>
                  <Text
                    style={[
                      commonStyles.bodyText,
                      {
                        fontFamily: theme.fonts.semiBold,
                        color: currentType.color,
                      },
                    ]}
                  >
                    {formatDate(selectedDateTime)}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={theme.colors.textSecondary}
                    style={{ marginLeft: theme.spacing.sm }}
                  />
                </TouchableOpacity>
              )}

              {/* Time Selection */}
              <TouchableOpacity
                style={[
                  commonStyles.card,
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderColor: currentType.color + "40",
                    borderWidth: 2,
                  },
                ]}
                onPress={() => setShowTimePicker(true)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={currentType.color}
                  />
                  <Text
                    style={[
                      commonStyles.bodyText,
                      {
                        marginLeft: theme.spacing.sm,
                        fontFamily: theme.fonts.semiBold,
                      },
                    ]}
                  >
                    Time:
                  </Text>
                </View>
                <Text
                  style={[
                    commonStyles.bodyText,
                    {
                      fontFamily: theme.fonts.semiBold,
                      color: currentType.color,
                    },
                  ]}
                >
                  {selectedDateTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={theme.colors.textSecondary}
                  style={{ marginLeft: theme.spacing.sm }}
                />
              </TouchableOpacity>
            </View>

            {/* Repeat Settings */}
            <View style={{ marginBottom: theme.spacing.xl }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: theme.spacing.md,
                }}
              >
                <Text
                  style={[
                    commonStyles.bodyText,
                    {
                      fontFamily: theme.fonts.semiBold,
                      color: theme.colors.text,
                    },
                  ]}
                >
                  Repeat Daily
                </Text>
                <Switch
                  value={isRepeating}
                  onValueChange={(value) => {
                    setIsRepeating(value);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  trackColor={{
                    false: theme.colors.textLight,
                    true: currentType.color + "40",
                  }}
                  thumbColor={
                    isRepeating ? currentType.color : theme.colors.textSecondary
                  }
                />
              </View>

              {isRepeating && (
                <View>
                  <Text
                    style={[
                      commonStyles.bodyText,
                      {
                        fontSize: theme.fontSizes.sm,
                        color: theme.colors.textSecondary,
                        marginBottom: theme.spacing.sm,
                      },
                    ]}
                  >
                    Select Days
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    {dayNames.map((day, index) => (
                      <TouchableOpacity
                        key={day}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: selectedDays[index]
                            ? currentType.color
                            : theme.colors.surface,
                          alignItems: "center",
                          justifyContent: "center",
                          borderWidth: 2,
                          borderColor: selectedDays[index]
                            ? currentType.color
                            : theme.colors.border,
                        }}
                        onPress={() => toggleDay(index)}
                      >
                        <Text
                          style={{
                            fontSize: theme.fontSizes.sm,
                            fontFamily: theme.fonts.semiBold,
                            color: selectedDays[index]
                              ? "white"
                              : theme.colors.textSecondary,
                          }}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Preview Card */}
            <View
              style={[
                commonStyles.card,
                {
                  backgroundColor: currentType.color + "10",
                  borderColor: currentType.color + "30",
                  borderWidth: 1,
                },
              ]}
            >
              <Text
                style={[
                  commonStyles.bodyText,
                  {
                    fontFamily: theme.fonts.semiBold,
                    marginBottom: theme.spacing.xs,
                    color: theme.colors.text,
                  },
                ]}
              >
                Preview
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name={currentType.icon}
                  size={20}
                  color={currentType.color}
                />
                <Text
                  style={[
                    commonStyles.bodyText,
                    {
                      marginLeft: theme.spacing.sm,
                      flex: 1,
                    },
                  ]}
                >
                  {alertName || currentType.defaultName}
                </Text>
              </View>
              <Text
                style={[
                  commonStyles.bodyText,
                  {
                    fontSize: theme.fontSizes.sm,
                    color: theme.colors.textSecondary,
                    marginTop: theme.spacing.xs,
                  },
                ]}
              >
                {isRepeating ? "Daily" : "Once"} 
                {!isRepeating && ` on ${formatDate(selectedDateTime)}`} at{" "}
                {selectedDateTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {isRepeating && selectedDays.some((day) => day) && (
                  <Text>
                    {" "}
                    •{" "}
                    {selectedDays.filter((day) => day).length === 7
                      ? "Every day"
                      : `${selectedDays.filter((day) => day).length} days/week`}
                  </Text>
                )}
              </Text>
            </View>
          </ScrollView>

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={selectedDateTime}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              minimumDate={new Date()}
              textColor={theme.colors.text}
            />
          )}

          {/* Time Picker */}
          {showTimePicker && (
            <DateTimePicker
              value={selectedDateTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onTimeChange}
              textColor={theme.colors.text}
            />
          )}
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  );
}
