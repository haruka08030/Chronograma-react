import React from 'react';
import { Switch as RNSwitch, SwitchProps } from 'react-native';
import { colors } from '@/theme/theme';

const Switch: React.FC<SwitchProps> = (props) => {
  return (
    <RNSwitch
      trackColor={{ false: colors.border, true: colors.primary }}
      thumbColor={colors.background}
      ios_backgroundColor={colors.border}
      {...props}
    />
  );
};

export { Switch };