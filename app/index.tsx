import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, PanResponder, Animated, Dimensions } from "react-native";

const SLIDER_WIDTH = Dimensions.get("window").width * 0.9;
const SLIDER_HEIGHT = 10;
const THUMB_SIZE = 30;
const MIN = 1;
const MAX = 100;

export default function index() {
  const [minValue, setMinValue] = useState(25);
  const [maxValue, setMaxValue] = useState(75);

  // Calculate positions
  const range = MAX - MIN;
  const minLeft = ((minValue - MIN) / range) * (SLIDER_WIDTH - THUMB_SIZE);
  const maxLeft = ((maxValue - MIN) / range) * (SLIDER_WIDTH - THUMB_SIZE);

  // PanResponder for dragging the progress bar
  
  const progressPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const delta = Math.round((gesture.dx / (SLIDER_WIDTH - THUMB_SIZE)) * range);
        let newMin = minValue + delta;
        let newMax = maxValue + delta;
        if (newMin < MIN) {
          newMax += MIN - newMin;
          newMin = MIN;
        }
        if (newMax > MAX) {
          newMin -= newMax - MAX;
          newMax = MAX;
        }
        if (newMin >= MIN && newMax <= MAX && newMin < newMax) {
          setMinValue(newMin);
          setMaxValue(newMax);
        }
      },
    })
  ).current;

  // PanResponder for min thumb
  const minPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        let newMin = Math.round(
          ((minLeft + gesture.dx) / (SLIDER_WIDTH - THUMB_SIZE)) * range + MIN
        );
        newMin = Math.max(MIN, Math.min(newMin, maxValue - 1));
        setMinValue(newMin);
      },
    })
  ).current;

  // PanResponder for max thumb
  const maxPan = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        let newMax = Math.round(
          ((maxLeft + gesture.dx) / (SLIDER_WIDTH - THUMB_SIZE)) * range + MIN
        );
        newMax = Math.min(MAX, Math.max(newMax, minValue + 1));
        setMaxValue(newMax);
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter by Price</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={minValue.toString()}
          onChangeText={text => {
            let val = Math.max(MIN, Math.min(Number(text) || MIN, maxValue - 1));
            setMinValue(val);
          }}
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={maxValue.toString()}
          onChangeText={text => {
            let val = Math.min(MAX, Math.max(Number(text) || MAX, minValue + 1));
            setMaxValue(val);
          }}
        />
      </View>
      <View style={styles.sliderContainer}>
        <View style={styles.sliderTrack} />
        {/* Progress bar */}
        <Animated.View
          style={[
            styles.progress,
            {
              left: minLeft + THUMB_SIZE / 2,
              width: maxLeft - minLeft,
            },
          ]}
          {...progressPan.panHandlers}
        />
        {/* Min thumb */}
        <Animated.View
          style={[styles.thumb, { left: minLeft }]}
          {...minPan.panHandlers}
        />
        {/* Max thumb */}
        <Animated.View
          style={[styles.thumb, { left: maxLeft }]}
          {...maxPan.panHandlers}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#222",
    marginBottom: 24,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    width: "90%",
    textAlign: "center",
    elevation: 2,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 32,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    elevation: 2,
  },
  input: {
    backgroundColor: "#77889926",
    fontSize: 22,
    fontWeight: "500",
    borderRadius: 5,
    minWidth: 64,
    padding: 10,
    textAlign: "center",
    marginHorizontal: 10,
  },
  sliderContainer: {
    width: SLIDER_WIDTH,
    height: THUMB_SIZE,
    justifyContent: "center",
    marginTop: 16,
  },
  sliderTrack: {
    position: "absolute",
    height: SLIDER_HEIGHT,
    width: "100%",
    backgroundColor: "#77889926",
    borderRadius: 5,
    top: (THUMB_SIZE - SLIDER_HEIGHT) / 2,
  },
  progress: {
    position: "absolute",
    height: SLIDER_HEIGHT,
    backgroundColor: "#357ded",
    borderRadius: 5,
    top: (THUMB_SIZE - SLIDER_HEIGHT) / 2,
    zIndex: 1,
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    backgroundColor: "#357ded",
    borderRadius: THUMB_SIZE / 2,
    top: 0,
    zIndex: 2,
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 3,
  },
});