import { StyleSheet, Text, View } from 'react-native';
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
  );
};

export default Index;

const styles = StyleSheet.create({
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