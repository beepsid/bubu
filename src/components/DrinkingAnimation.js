import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, Text } from 'react-native';
import LottieView from 'lottie-react-native';

export default function DrinkingAnimation({ visible, onComplete }) {
  const [glassAnimation] = useState(new Animated.Value(1));
  const [waterAnimation] = useState(new Animated.Value(0));
  const [catAnimation] = useState(new Animated.Value(0));
  const [currentFrame, setCurrentFrame] = useState(0);
  const [frameInterval, setFrameInterval] = useState(null);
  const [animationTimeout, setAnimationTimeout] = useState(null);
  const happyCatRef = useRef(null);

  const drinkingFrames = ['🥤', '🥤', '🥛', '🥛', '🥤', '🥤'];

  useEffect(() => {
    if (visible) {
      startDrinkingAnimation();
    } else {
      // Cleanup when not visible
      cleanup();
    }

    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, [visible]);

  const cleanup = () => {
    if (frameInterval) {
      clearInterval(frameInterval);
      setFrameInterval(null);
    }
    if (animationTimeout) {
      clearTimeout(animationTimeout);
      setAnimationTimeout(null);
    }
    // Reset frame and animated values
    setCurrentFrame(0);
    glassAnimation.setValue(1);
    waterAnimation.setValue(0);
    catAnimation.setValue(0);
  };

  const startDrinkingAnimation = () => {
    // Clear any existing intervals/timeouts
    cleanup();

    // Start happy cat Lottie animation
    if (happyCatRef.current) {
      happyCatRef.current.play();
    }

    // Frame animation for drinking effect
    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % drinkingFrames.length);
    }, 300);
    setFrameInterval(interval);

    // Glass tilting animation
    Animated.sequence([
      Animated.timing(glassAnimation, {
        toValue: 0.8,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(glassAnimation, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(glassAnimation, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Water level animation
    Animated.timing(waterAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // Cat happy animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(catAnimation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(catAnimation, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 3 }
    ).start();

    // Complete animation after 3 seconds
    const timeout = setTimeout(() => {
      cleanup();
      if (onComplete) {
        onComplete();
      }
    }, 3000);
    setAnimationTimeout(timeout);
  };

  if (!visible) return null;

  const catScale = catAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const waterLevel = waterAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 20],
  });

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
    >
      {/* Drinking Animation */}
      <View style={{ alignItems: 'center', marginBottom: 40 }}>
        <Animated.Text
          style={{
            fontSize: 100,
            transform: [{ scale: glassAnimation }],
            marginBottom: 20,
          }}
        >
          {drinkingFrames[currentFrame]}
        </Animated.Text>

        {/* Water Level Indicator */}
        <View
          style={{
            width: 60,
            height: 100,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 10,
            overflow: 'hidden',
            marginBottom: 20,
          }}
        >
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: waterLevel,
              backgroundColor: '#2196F3',
              borderRadius: 10,
            }}
          />
        </View>

        <Text
          style={{
            color: 'white',
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          Glug glug glug! 💧
        </Text>
      </View>

      {/* Happy Cat */}
      <Animated.View
        style={{
          transform: [{ scale: catScale }],
        }}
      >
        <LottieView
          ref={happyCatRef}
          source={require("../../assets/images/cathappy.json")}
          style={{
            width: 180,
            height: 180,
          }}
          autoPlay={visible}
          loop={true}
          speed={1}
        />
      </Animated.View>

      <Text
        style={{
          color: 'white',
          fontSize: 18,
          textAlign: 'center',
          marginTop: 20,
          opacity: 0.8,
        }}
      >
        Great job staying hydrated! 🎉
      </Text>
    </View>
  );
}