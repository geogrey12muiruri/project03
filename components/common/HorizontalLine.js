import React from 'react';
import { View } from 'react-native';
import Colors from '../Shared/Colors';

const HorizontalLine = () => {
  return (
    <View style={{
      borderWidth: 1, borderColor: Colors.gray, margin: 5, marginBottom: 15, marginTop: 15
    }} />
  );
}

export default HorizontalLine;
