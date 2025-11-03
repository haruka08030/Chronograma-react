import { Bell, Calendar, Cloud, Palette, User, Shield, HelpCircle, ChevronRight, LogOut } from 'lucide-react';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';

export default function SettingsScreen() {
  const settingsSections = [
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
        { icon: Calendar, label: 'Calendar Sync', value: 'Google Calendar', hasChevron: true },
      ],
    },
    {
      title: 'Data',
      items: [
        { icon: Cloud, label: 'Backup & Restore', hasChevron: true },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Support', hasChevron: true },
      ],
    },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-slate-900">Settings</h1>
        <p className="text-slate-600">Manage your preferences</p>
      </div>

      {/* Profile Card */}
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-sm border-blue-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
            <span className="text-xl">JD</span>
          </div>
          <div className="flex-1">
            <p className="text-slate-900">John Doe</p>
            <p className="text-sm text-slate-600 mt-1">john.doe@email.com</p>
            <p className="text-xs text-blue-600 mt-1">Premium Member</p>
          </div>
        </div>
      </Card>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-2">
          <h2 className="text-slate-900 px-1">{section.title}</h2>
          <Card className="bg-white rounded-2xl shadow-sm border-slate-200 overflow-hidden">
            {section.items.map((item, itemIndex) => {
              const Icon = item.icon;
              return (
                <div key={itemIndex}>
                  <button className="w-full p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-slate-900">{item.label}</p>
                      {item.value && (
                        <p className="text-sm text-slate-500 mt-0.5">{item.value}</p>
                      )}
                    </div>
                    {item.hasSwitch && (
                      <Switch defaultChecked={item.enabled} />
                    )}
                    {item.hasChevron && (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                  {itemIndex < section.items.length - 1 && (
                    <Separator className="mx-4" />
                  )}
                </div>
              );
            })}
          </Card>
        </div>
      ))}

      {/* App Info */}
      <Card className="p-4 bg-white rounded-2xl shadow-sm border-slate-200">
        <div className="text-center space-y-2">
          <p className="text-slate-900">Chronograma</p>
          <p className="text-sm text-slate-500">Version 1.0.0</p>
          <p className="text-xs text-slate-400">© 2025 Chronograma. All rights reserved.</p>
        </div>
      </Card>

      {/* Logout Button */}
      <button className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-2 text-red-600">
        <LogOut className="w-5 h-5" />
        <span>Log Out</span>
      </button>
    </div>
  );
}
