import React, { createContext, useCallback, useContext, useEffect, useState, useRef } from 'react';
import { ScrollView, View, Pressable, StyleSheet, ViewProps, ScrollViewProps, PressableProps } from 'react-native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { colors } from '../../theme/theme';

interface CarouselContextProps {
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

const CarouselContext = createContext<CarouselContextProps | null>(null);

const useCarousel = () => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }
  return context;
};

interface CarouselProps extends ViewProps {
  orientation?: 'horizontal' | 'vertical';
}

const Carousel: React.FC<CarouselProps> = ({ orientation = 'horizontal', ...props }) => {
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollPrev = useCallback(() => {
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
  }, []);

  const scrollNext = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  return (
    <CarouselContext.Provider
      value={{
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <View {...props} />
    </CarouselContext.Provider>
  );
};

const CarouselContent: React.FC<ScrollViewProps> = (props) => {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} {...props} />;
};

const CarouselItem: React.FC<ViewProps> = (props) => {
  return <View style={styles.carouselItem} {...props} />;
};

const CarouselPrevious: React.FC<PressableProps> = (props) => {
  const { scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Pressable style={[styles.arrow, !canScrollPrev && styles.disabled]} onPress={scrollPrev} {...props}>
      <ArrowLeft color={colors.text} />
    </Pressable>
  );
};

const CarouselNext: React.FC<PressableProps> = (props) => {
  const { scrollNext, canScrollNext } = useCarousel();

  return (
    <Pressable style={[styles.arrow, !canScrollNext && styles.disabled]} onPress={scrollNext} {...props}>
      <ArrowRight color={colors.text} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  carouselItem: {
    flex: 1,
    minWidth: '80%',
    marginRight: 16,
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  disabled: {
    opacity: 0.5,
  },
});

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };