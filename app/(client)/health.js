import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Button, Card, TextInput, Title, Paragraph } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit'; // Ensure to install react-native-chart-kit
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const Health = () => {
  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#007AFF',
    },
  };

  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        data: [120, 122, 125, 123, 119],
        strokeWidth: 2, // optional
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      {/* Clinical Data */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Clinical Data</Title>
          <LineChart
            data={data}
            width={screenWidth - 40}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
          <TextInput
            label="Blood Pressure (Manual Input)"
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            label="Heart Rate (Manual Input)"
            style={styles.input}
            keyboardType="numeric"
          />
          <Button mode="contained" onPress={() => {}}>Sync Wearables</Button>
        </Card.Content>
      </Card>

      {/* Reports Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Lab Reports</Title>
          <Paragraph>No lab reports available</Paragraph>
          <Button mode="text" onPress={() => {}}>View All</Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Imaging Reports</Title>
          <Paragraph>No imaging reports available</Paragraph>
          <Button mode="text" onPress={() => {}}>View All</Button>
        </Card.Content>
      </Card>

      {/* Prescriptions Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Prescriptions</Title>
          <Button mode="contained" onPress={() => {}}>Upload Prescription</Button>
          <Paragraph>No prescriptions available</Paragraph>
        </Card.Content>
      </Card>

      {/* Consultations Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Consultations</Title>
          <Paragraph>No consultations available</Paragraph>
          <Button mode="text" onPress={() => {}}>View All</Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default Health;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f4f4f4',
  },
  card: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  chart: {
    marginVertical: 10,
    borderRadius: 10,
  },
});
