import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Dimensions } from 'react-native';
import { Button, Card, TextInput, Title, Paragraph, Chip } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const Health = () => {
  const [activeChart, setActiveChart] = useState('bp'); // 'bp' for blood pressure, 'sugar' for sugar levels
  const [bpEntries, setBpEntries] = useState([]); // Stores systolic/diastolic data
  const [sugarEntries, setSugarEntries] = useState([]); // Stores sugar level data
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [sugar, setSugar] = useState('');

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

  const handleBpSubmit = () => {
    if (systolic && diastolic) {
      setBpEntries((prev) => [...prev, { systolic: +systolic, diastolic: +diastolic, time: new Date().toLocaleTimeString() }]);
      setSystolic('');
      setDiastolic('');
    }
  };

  const handleSugarSubmit = () => {
    if (sugar) {
      setSugarEntries((prev) => [...prev, { level: +sugar, time: new Date().toLocaleTimeString() }]);
      setSugar('');
    }
  };

  const renderChartData = () => {
    if (activeChart === 'bp') {
      const systolicData = bpEntries.map((entry) => entry.systolic);
      const diastolicData = bpEntries.map((entry) => entry.diastolic);
      return {
        labels: bpEntries.map((_, idx) => `#${idx + 1}`),
        datasets: [
          { data: systolicData, color: () => 'red', label: 'Systolic' },
          { data: diastolicData, color: () => 'blue', label: 'Diastolic' },
        ],
      };
    } else {
      const sugarData = sugarEntries.map((entry) => entry.level);
      return {
        labels: sugarEntries.map((_, idx) => `#${idx + 1}`),
        datasets: [{ data: sugarData, strokeWidth: 2 }],
      };
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Chart Selector */}
      <View style={styles.chipContainer}>
        <Chip
          selected={activeChart === 'bp'}
          onPress={() => setActiveChart('bp')}
          style={styles.chip}
        >
          Blood Pressure
        </Chip>
        <Chip
          selected={activeChart === 'sugar'}
          onPress={() => setActiveChart('sugar')}
          style={styles.chip}
        >
          Sugar Levels
        </Chip>
      </View>

      {/* Chart */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>{activeChart === 'bp' ? 'Blood Pressure Chart' : 'Sugar Level Chart'}</Title>
          <LineChart
            data={renderChartData()}
            width={screenWidth - 40}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      {/* Data Input */}
      {activeChart === 'bp' ? (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Enter Blood Pressure</Title>
            <TextInput
              label="Systolic"
              style={styles.input}
              keyboardType="numeric"
              value={systolic}
              onChangeText={setSystolic}
            />
            <TextInput
              label="Diastolic"
              style={styles.input}
              keyboardType="numeric"
              value={diastolic}
              onChangeText={setDiastolic}
            />
            <Button mode="contained" onPress={handleBpSubmit}>
              Add Entry
            </Button>
          </Card.Content>
        </Card>
      ) : (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Enter Sugar Level</Title>
            <TextInput
              label="Sugar Level"
              style={styles.input}
              keyboardType="numeric"
              value={sugar}
              onChangeText={setSugar}
            />
            <Button mode="contained" onPress={handleSugarSubmit}>
              Add Entry
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* Data Log */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>{activeChart === 'bp' ? 'Blood Pressure Log' : 'Sugar Level Log'}</Title>
          {activeChart === 'bp' && bpEntries.length === 0 && <Paragraph>No entries yet</Paragraph>}
          {activeChart === 'sugar' && sugarEntries.length === 0 && <Paragraph>No entries yet</Paragraph>}
          {activeChart === 'bp' &&
            bpEntries.map((entry, idx) => (
              <Paragraph key={idx}>
                {`Systolic: ${entry.systolic}, Diastolic: ${entry.diastolic} at ${entry.time}`}
              </Paragraph>
            ))}
          {activeChart === 'sugar' &&
            sugarEntries.map((entry, idx) => (
              <Paragraph key={idx}>{`Sugar: ${entry.level} at ${entry.time}`}</Paragraph>
            ))}
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
  chipContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  chip: {
    marginHorizontal: 5,
  },
});
