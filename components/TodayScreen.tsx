import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Clock, Target, TrendingUp } from 'lucide-react-native';

// This is a simplified Card component. In a real app, you might want to create a separate file for it.
const Card = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View style={[styles.card, style]}>{children}</View>
);

// This is a simplified Progress component.
const Progress = ({ value }: { value: number }) => (
  <View style={styles.progressContainer}>
    <View style={[styles.progressBar, { width: `${value}%` }]} />
  </View>
);

export default function TodayScreen() {
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Chronograma</Text>
        <Text style={styles.headerDate}>{dateString}</Text>
      </View>

      {/* Daily Stats */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <View style={[styles.statIconContainer, { backgroundColor: '#eff6ff' }]}>
              <Target color="#2563eb" width={20} height={20} />
            </View>
            <Text style={styles.statLabel}>Tasks</Text>
            <Text style={styles.statValue}>8/12</Text>
          </View>
        </Card>
        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <View style={[styles.statIconContainer, { backgroundColor: '#f5f3ff' }]}>
              <TrendingUp color="#7c3aed" width={20} height={20} />
            </View>
            <Text style={styles.statLabel}>Habits</Text>
            <Text style={styles.statValue}>5/7</Text>
          </View>
        </Card>
        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <View style={[styles.statIconContainer, { backgroundColor: '#f0fdf4' }]}>
              <Clock color="#16a34a" width={20} height={20} />
            </View>
            <Text style={styles.statLabel}>Focus</Text>
            <Text style={styles.statValue}>6.5h</Text>
          </View>
        </Card>
      </View>

      {/* Progress Summary */}
      <Card style={styles.progressCard}>
        <View>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Today's Progress</Text>
            <Text style={styles.progressValue}>67%</Text>
          </View>
          <Progress value={67} />
          <Text style={styles.progressDescription}>
            順調です！今日はあと4つのタスクが残っています。
          </Text>
        </View>
      </Card>

      {/* Placeholder for the timeline */}
      <View style={styles.timelinePlaceholder}>
        <Text>Timeline will be implemented here</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 16,
  },
  headerContainer: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerDate: {
    fontSize: 16,
    color: '#475569',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  statContent: {
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  progressCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f0f5ff', // Simplified gradient
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    color: '#334155',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  progressDescription: {
    fontSize: 12,
    color: '#475569',
    marginTop: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },
  timelinePlaceholder: {
    height: 400, // To be replaced with actual timeline
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
});
