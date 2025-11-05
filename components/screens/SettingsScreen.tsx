import { Bell, ChevronRight, LogOut, Palette, Shield, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import useLocalization from '../hooks/useLocalization';

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
  const { t } = useLocalization();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const toggleNotifications = () => setNotificationsEnabled(previousState => !previousState);

  const settingsSections: SettingsSection[] = [
    {
      title: t('settings.account'),
      items: [
        { icon: User, label: t('settings.profile'), value: 'John Doe', hasChevron: true },
        { icon: Shield, label: t('settings.privacy'), hasChevron: true },
      ],
    },
    {
      title: t('settings.preferences'),
      items: [
        { icon: Palette, label: t('settings.theme'), value: t('settings.light'), hasChevron: true },
        { icon: Bell, label: t('settings.notifications'), hasSwitch: true, enabled: true },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('settings.subtitle')}</Text>
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
                  {item.hasSwitch && <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />}
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
        <Text style={styles.logoutButtonText}>{t('settings.logout')}</Text>
      </Pressable>

    </ScrollView>
  );
}

import { colors } from '../theme';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  contentContainer: { padding: 16 },
  headerContainer: { marginBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  headerSubtitle: { fontSize: 16, color: colors.textMuted },
  profileCard: { padding: 16, borderRadius: 16, backgroundColor: colors.primaryLight, marginBottom: 16 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: 'white', fontSize: 24 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  profileEmail: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 8, paddingHorizontal: 4 },
  settingsCard: { borderRadius: 16, backgroundColor: 'white', overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  settingIconContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  settingLabel: { fontSize: 16, color: colors.text },
  settingValue: { fontSize: 14, color: colors.textSubtle, marginTop: 2 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, backgroundColor: 'white', borderWidth: 1, borderColor: colors.border, gap: 8, marginTop: 16 },
  logoutButtonText: { color: colors.rose, fontSize: 16 },
  card: { backgroundColor: 'white', borderRadius: 8, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2 },
});
