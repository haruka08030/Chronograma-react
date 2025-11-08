import { colors } from '@/theme/theme';
import React, { useRef, useState } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface DropdownOption<T> {
  label: string;
  value: T;
}

interface DropdownProps<T> {
  value: T;
  onChange: (value: T) => void;
  options: DropdownOption<T>[];
  placeholder?: string;
}

export const Dropdown = <T extends string | number>({ value, onChange, options, placeholder }: DropdownProps<T>) => {
  const [showMenu, setShowMenu] = useState(false);
  const anchorRef = useRef<View>(null);
  const [anchor, setAnchor] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const openMenu = () => {
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setShowMenu(true);
    });
  };

  const handleSelect = (v: T) => {
    onChange(v);
    setShowMenu(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <>
      <View ref={anchorRef} collapsable={false} style={styles.pickerContainer}>
        <Pressable
          style={styles.pressableButton}
          onPress={openMenu}
          accessibilityRole="button"
          accessibilityLabel={placeholder}
        >
          <Text style={styles.valueText}>{selectedOption?.label || placeholder}</Text>
        </Pressable>
      </View>
      {showMenu && (
        <Modal
          transparent
          visible
          animationType="fade"
          onRequestClose={() => setShowMenu(false)}
        >
          <Pressable style={styles.dropdownBackdrop} onPress={() => setShowMenu(false)}>
            <View pointerEvents="box-none" style={{ flex: 1 }}>
              {(() => {
                const screenW = Dimensions.get('window').width;
                const left = Math.min(
                  Math.max(8, anchor.x),
                  screenW - anchor.width - 8
                );
                const top = anchor.y + anchor.height + 4;
                return (
                  <View
                    style={[
                      styles.dropdown,
                      { top, left, width: anchor.width },
                    ]}
                  >
                    {options.map((opt) => (
                      <Pressable
                        key={opt.value}
                        style={[
                          styles.dropdownOption,
                          value === opt.value && styles.dropdownOptionActive,
                        ]}
                        onPress={() => handleSelect(opt.value)}
                      >
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            value === opt.value && styles.dropdownOptionTextActive,
                          ]}
                        >
                          {opt.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                );
              })()}
            </View>
          </Pressable>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    justifyContent: 'center',
  },
  pressableButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  valueText: {
    fontSize: 16,
    color: colors.text,
  },
  dropdownBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.001)',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  dropdownOptionActive: {
    backgroundColor: '#EEF2FF',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: colors.text,
  },
  dropdownOptionTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});
