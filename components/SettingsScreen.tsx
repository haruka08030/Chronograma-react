import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { Bell, Calendar, Cloud, Palette, User, Shield, HelpCircle, ChevronRight, LogOut } from 'lucide-react-native';

const Card = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View style={[styles.card, style]}>{children}</View>
);

interface SettingsItem {
  icon: any;
  label: string;
  value?: string;
  hasChevron?: boolean;
  hasSwitch?: boolean;
  enabled?: boolean;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

export default function SettingsScreen() {
  const settingsSections: SettingsSection[] = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile', value: 'John Doe', hasChevron: true },
        { icon: Shield, label: 'Privacy & Security', hasChevron: true },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Palette, label: 'Theme', value: 'Light', hasChevron: true },
        { icon: Bell, label: 'Notifications', hasSwitch: true, enabled: true },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your preferences</Text>
      </View>

      {/* Profile Card */}
      <Card style={styles.profileCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>john.doe@email.com</Text>
          </View>
        </View>
      </Card>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Card style={styles.settingsCard}>
            {section.items.map((item, itemIndex) => {
              const Icon = item.icon;
              return (
                <Pressable key={itemIndex} style={styles.settingItem}>
                  <View style={styles.settingIconContainer}>
                    <Icon color="#475569" width={20} height={20} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    {item.value && <Text style={styles.settingValue}>{item.value}</Text>}
                  </View>
                  {item.hasSwitch && <Switch value={item.enabled} />}
                  {item.hasChevron && <ChevronRight color="#94a3b8" width={20} height={20} />}
                </Pressable>
              );
            })}
          </Card>
        </View>
      ))}

      {/* Logout Button */}
      <Pressable style={styles.logoutButton}>
        <LogOut color="#ef4444" width={20} height={20} />
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </Pressable>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  contentContainer: { padding: 16 },
  headerContainer: { marginBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  headerSubtitle: { fontSize: 16, color: '#475569' },
  profileCard: { padding: 16, borderRadius: 16, backgroundColor: '#f0f5ff', marginBottom: 16 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: 'white', fontSize: 24 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  profileEmail: { fontSize: 14, color: '#475569', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 8, paddingHorizontal: 4 },
  settingsCard: { borderRadius: 16, backgroundColor: 'white', overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  settingIconContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  settingLabel: { fontSize: 16, color: '#1e293b' },
  settingValue: { fontSize: 14, color: '#64748b', marginTop: 2 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, backgroundColor: 'white', borderWidth: 1, borderColor: '#e2e8f0', gap: 8, marginTop: 16 },
  logoutButtonText: { color: '#ef4444', fontSize: 16 },
  card: { backgroundColor: 'white', borderRadius: 8, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2 },
});
