import { Colors, InputStyles } from '@/constants/theme';
import React, { useState } from 'react';
import { Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

interface ThemedInputProps extends TextInputProps {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
}

/**
 * ThemedInput - Reusable input component with built-in theme styles
 * 
 * @example
 * <ThemedInput
 *   label="Email"
 *   required
 *   placeholder="Enter email"
 *   value={email}
 *   onChangeText={setEmail}
 *   error={errors.email}
 * />
 * 
 * @example
 * <ThemedInput
 *   label="Notes"
 *   multiline
 *   numberOfLines={4}
 *   helperText="Optional field"
 * />
 */
export function ThemedInput({
  label,
  required = false,
  error,
  helperText,
  containerStyle,
  editable = true,
  multiline = false,
  style,
  ...textInputProps
}: ThemedInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[InputStyles.container, containerStyle]}>
      {/* Label */}
      {label && (
        <Text style={InputStyles.label}>
          {label}
          {required && <Text style={InputStyles.required}> *</Text>}
        </Text>
      )}

      {/* Input Field */}
      <TextInput
        style={[
          InputStyles.input,
          multiline && InputStyles.textArea,
          isFocused && InputStyles.inputFocused,
          error && InputStyles.inputError,
          !editable && InputStyles.inputDisabled,
          style as any,
        ]}
        editable={editable}
        multiline={multiline}
        placeholderTextColor={Colors.textTertiary}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...textInputProps}
      />

      {/* Error Text */}
      {error && <Text style={InputStyles.errorText}>{error}</Text>}

      {/* Helper Text */}
      {!error && helperText && (
        <Text style={InputStyles.helperText}>{helperText}</Text>
      )}
    </View>
  );
}

