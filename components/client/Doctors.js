import React from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import useDoctors from '../../hooks/useDoctors';
import SubHeading from '../client/SubHeading';
import Colors from '../../components/Shared/Colors';

const Doctors = ({ searchQuery }) => {
  const router = useRouter();
  const { doctorList, loading, error } = useDoctors();

  const handleConsult = (doctorId) => {
    router.push(`/doctors/${doctorId}`);
  };

  const filteredDoctors = doctorList.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  if (error) {
    return <Text>Error loading doctors: {error}</Text>;
  }

  return (
    <View style={{ marginTop: 10 }}>
      <SubHeading subHeadingTitle="Discover Doctors Near You" />
      {filteredDoctors.length === 0 && searchQuery ? (
        <Text>No results found</Text>
      ) : (
        <FlatList
          data={filteredDoctors.length > 0 ? filteredDoctors : doctorList}
          horizontal
          renderItem={({ item }) => (
            <View style={styles.doctorItem}>
              <Image
                source={{
                  uri:
                    item.profileImage ||
                    'https://res.cloudinary.com/dws2bgxg4/image/upload/v1726073012/nurse_portrait_hospital_2d1bc0a5fc.jpg',
                }}
                style={styles.doctorImage}
              />
              <View style={styles.nameCategoryContainer}>
                <Text style={styles.doctorName}>{item.name}</Text>
                <Text style={styles.doctorName}>{item.specialty}</Text>
              </View>
              <Text>{item.clinicAddress || 'Location not specified'}</Text>
              <TouchableOpacity
                style={[styles.button, styles.consultButton]}
                onPress={() => handleConsult(item.id)}
              >
                <Text style={styles.buttonText}>View</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  doctorItem: {
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    borderRadius: 10,
    padding: 10,
    width: 240,
  },
  doctorImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  nameCategoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  doctorName: {
    fontFamily: 'SourceSans3-Bold',
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  consultButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    alignSelf: 'center',
  },
  buttonText: {
    color: Colors.PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Doctors;
