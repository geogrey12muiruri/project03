import React from "react";
import { View, Button, Text } from "react-native";
import useInsurance from "../hooks/useInsurance";

const InsuranceComponent = () => {
  const { insuranceProviders, clearCacheAndFetchAfresh } = useInsurance();

  return (
    <View>
      <Button title="Clear Cache and Refresh" onPress={clearCacheAndFetchAfresh} />
      {insuranceProviders.map((provider, index) => (
        <Text key={index}>{provider.name}</Text>
      ))}
    </View>
  );
};

export default InsuranceComponent;
