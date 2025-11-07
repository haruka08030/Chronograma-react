import React from 'react';
import { View, Text, StyleSheet, ViewProps, TextProps } from 'react-native';
import { ChevronRight, MoreHorizontal } from 'lucide-react-native';
import { colors } from '../../theme/theme';

const Breadcrumb: React.FC<ViewProps> = (props) => {
  return <View style={styles.breadcrumb} {...props} />;
};

const BreadcrumbList: React.FC<ViewProps> = (props) => {
  return <View style={styles.breadcrumbList} {...props} />;
};

const BreadcrumbItem: React.FC<ViewProps> = (props) => {
  return <View style={styles.breadcrumbItem} {...props} />;
};

const BreadcrumbLink: React.FC<TextProps> = (props) => {
  return <Text style={styles.breadcrumbLink} {...props} />;
};

const BreadcrumbPage: React.FC<TextProps> = (props) => {
  return <Text style={styles.breadcrumbPage} {...props} />;
};

const BreadcrumbSeparator: React.FC<ViewProps> = ({ children, ...props }) => {
  return (
    <View style={styles.breadcrumbSeparator} {...props}>
      {children ?? <ChevronRight size={14} color={colors.textSubtle} />}
    </View>
  );
};

const BreadcrumbEllipsis: React.FC<ViewProps> = (props) => {
  return (
    <View style={styles.breadcrumbEllipsis} {...props}>
      <MoreHorizontal size={16} color={colors.textSubtle} />
    </View>
  );
};

const styles = StyleSheet.create({
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbList: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbLink: {
    color: colors.textSubtle,
    fontSize: 14,
  },
  breadcrumbPage: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  breadcrumbSeparator: {
    marginHorizontal: 4,
  },
  breadcrumbEllipsis: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};