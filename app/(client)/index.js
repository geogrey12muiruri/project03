import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Clinics from '../../components/client/Clinics';
import Doctors from '../../components/client/Doctors';
import Category from '../../components/client/Category';
import SearchBar from '../../components/client/SearchBar';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = () => {
    // Handle search submit if needed
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSubmit={handleSearchSubmit}
          />
          <Category searchQuery={searchQuery} />
          <Clinics searchQuery={searchQuery} />
          <Doctors searchQuery={searchQuery} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f39a',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});