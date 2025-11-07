import React from 'react';
import { View, Image, Text, StyleSheet, ViewProps, ImageProps, TextProps } from 'react-native';
import { colors } from '../../theme/theme';

interface AvatarProps extends ViewProps {}

const Avatar: React.FC<AvatarProps> = ({ style, ...props }) => {
  return <View style={[styles.avatar, style]} {...props} />;
};

interface AvatarImageProps extends ImageProps {}

const AvatarImage: React.FC<AvatarImageProps> = ({ style, ...props }) => {
  return <Image style={[styles.avatarImage, style]} {...props} />;
};

interface AvatarFallbackProps extends ViewProps {
  children?: React.ReactNode;
}

const AvatarFallback: React.FC<AvatarFallbackProps> = ({ children, style, ...props }) => {
  return (
    <View style={[styles.avatarFallback, style]} {...props}>
      <Text style={styles.avatarFallbackText}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    position: 'relative',
    width: 40,
    height: 40,
    flexShrink: 0,
    overflow: 'hidden',
    borderRadius: 20,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarFallbackText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export { Avatar, AvatarFallback, AvatarImage };