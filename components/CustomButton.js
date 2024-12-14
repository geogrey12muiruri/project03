import {Text, TouchableOpacity, ActivityIndicator, View} from 'react-native';
import React from 'react';

export default function CustomButton({label, onPress, isPending, isError, isSuccess}) {
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: '#AD40AF',
          padding: 20,
          borderRadius: 10,
          marginBottom: 30,
          opacity: isPending ? 0.7 : 1,
        }}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '700',
              fontSize: 16,
              color: '#fff',
            }}>
            {label}
          </Text>
        )}
      </TouchableOpacity>
      {isError && (
        <Text style={{color: 'red', textAlign: 'center', marginTop: 10}}>
          An error occurred. Please try again.
        </Text>
      )}
      {isSuccess && (
        <Text style={{color: 'green', textAlign: 'center', marginTop: 10}}>
          Operation successful!
        </Text>
      )}
    </View>
  );
}