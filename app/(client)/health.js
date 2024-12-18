import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';
import { Button, Card, TextInput, Title, Paragraph } from 'react-native-paper';

const Health = () => {
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Upload Prescription</Title>
          <Button mode="contained" onPress={() => {}}>Upload</Button>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Medical Data</Title>
          <TextInput label="Blood Pressure" style={styles.input} />
          <TextInput label="Heart Rate" style={styles.input} />
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Diagnostics</Title>
          <Paragraph>No diagnostics available</Paragraph>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Lab Reports</Title>
          <Paragraph>No lab reports available</Paragraph>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Consultations</Title>
          <Paragraph>No consultations available</Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

export default Health;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
});