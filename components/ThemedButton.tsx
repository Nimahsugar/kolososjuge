import { ButtonStyles, Colors } from '@/constants/theme';
import React from 'react';
import { ActivityIndicator, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'ghost' | 'danger' | 'dangerOutlined';
type ButtonSize = 'default' | 'small';

interface ThemedButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * ThemedButton - Reusable button component with built-in theme styles
 * 
 * @example
 * <ThemedButton 
 *   title="Save" 
 *   onPress={handleSave} 
 *   variant="primary"
 * />
 * 
 * @example
 * <ThemedButton 
 *   title="Delete" 
 *   onPress={handleDelete} 
 *   variant="danger"
 *   loading={isDeleting}
 * />
 */
export function ThemedButton({
  title,
  onPress,
  variant = 'primary',
  size = 'default',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ThemedButtonProps) {
  // Get button style based on variant
  const getButtonStyle = (): ViewStyle => {
    if (disabled) return ButtonStyles.disabled;
    
    switch (variant) {
      case 'primary':
        return ButtonStyles.primary;
      case 'secondary':
        return ButtonStyles.secondary;
      case 'outlined':
        return ButtonStyles.outlined;
      case 'ghost':
        return ButtonStyles.ghost;
      case 'danger':
        return ButtonStyles.danger;
      case 'dangerOutlined':
        return ButtonStyles.dangerOutlined;
      default:
        return ButtonStyles.primary;
    }
  };

  // Get text style based on variant
  const getTextStyle = (): TextStyle => {
    if (disabled) return ButtonStyles.disabledText;
    
    switch (variant) {
      case 'primary':
        return ButtonStyles.primaryText;
      case 'secondary':
        return ButtonStyles.secondaryText;
      case 'outlined':
        return ButtonStyles.outlinedText;
      case 'ghost':
        return ButtonStyles.ghostText;
      case 'danger':
        return ButtonStyles.dangerText;
      case 'dangerOutlined':
        return ButtonStyles.dangerOutlinedText;
      default:
        return ButtonStyles.primaryText;
    }
  };

  // Get loading indicator color based on variant
  const getLoadingColor = (): string => {
    if (disabled) return Colors.textDisabled;
    if (variant === 'outlined' || variant === 'ghost' || variant === 'dangerOutlined') {
      return variant === 'dangerOutlined' ? Colors.error : Colors.primary;
    }
    return Colors.white;
  };

  const buttonStyle = getButtonStyle();
  const textStyleVariant = getTextStyle();

  return (
    <TouchableOpacity
      style={[
        buttonStyle,
        size === 'small' && ButtonStyles.small,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getLoadingColor()} size="small" />
      ) : (
        <Text
          style={[
            textStyleVariant,
            size === 'small' && ButtonStyles.smallText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

