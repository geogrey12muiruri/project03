import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import HorizontalLine from '../../components/common/HorizontalLine';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import usePatientProfile  from '../../hooks/usePatientProfile';

const ProfileScreen = () => {
  const router = useRouter();
  const { patientProfile, pickImage } = usePatientProfile();
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [editingField, setEditingField] = useState(null);

  const handleEdit = (field) => {
    setEditingField(editingField === field ? null : field);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(false);
    setDob(currentDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <FeatherIcon name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.profileImageWrapper} onPress={pickImage}>
            {patientProfile.picture ? (
              <Image source={{ uri: patientProfile.picture }} style={styles.profileImage} />
            ) : (
              <FeatherIcon name="camera" size={50} color="#ccc" />
            )}
            <View style={styles.editIconWrapper}>
              <FeatherIcon name="edit-3" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
        <HorizontalLine />
        {/* Editable Fields */}
        <EditableField
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          isEditing={editingField === 'fullName'}
          onEdit={() => handleEdit('fullName')}
          iconColor="#007bff"
          iconName="user"
        />
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <View style={[styles.inputIconWrapper, { backgroundColor: '#fe9400' }]}>
              <FeatherIcon name="calendar" size={20} color="#fff" />
            </View>
            <Text style={styles.inputLabel}>Date of Birth</Text>
            <Text style={styles.inputValue}>{dob.toDateString()}</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <FeatherIcon name="edit-3" size={20} color="#fe9400" />
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={dob}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <View style={[styles.inputIconWrapper, { backgroundColor: '#32c759' }]}>
              <FeatherIcon name="user-check" size={20} color="#fff" />
            </View>
            <Text style={styles.inputLabel}>Gender</Text>
            <Picker
              selectedValue={gender}
              style={styles.picker}
              onValueChange={(itemValue) => setGender(itemValue)}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
        </View>
        <EditableField
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          isEditing={editingField === 'phoneNumber'}
          onEdit={() => handleEdit('phoneNumber')}
          iconColor="#007afe"
          iconName="phone"
        />
        <HorizontalLine />
        <Text style={styles.sectionTitle}>Address</Text>
        <EditableField
          label="Street"
          value={address.street}
          onChangeText={(text) => setAddress({ ...address, street: text })}
          isEditing={editingField === 'street'}
          onEdit={() => handleEdit('street')}
          iconColor="#007bff"
          iconName="map-pin"
        />
        <EditableField
          label="City"
          value={address.city}
          onChangeText={(text) => setAddress({ ...address, city: text })}
          isEditing={editingField === 'city'}
          onEdit={() => handleEdit('city')}
          iconColor="#fe9400"
          iconName="map"
        />
        <EditableField
          label="State"
          value={address.state}
          onChangeText={(text) => setAddress({ ...address, state: text })}
          isEditing={editingField === 'state'}
          onEdit={() => handleEdit('state')}
          iconColor="#32c759"
          iconName="map"
        />
        <EditableField
          label="Zip Code"
          value={address.zipCode}
          onChangeText={(text) => setAddress({ ...address, zipCode: text })}
          isEditing={editingField === 'zipCode'}
          onEdit={() => handleEdit('zipCode')}
          iconColor="#007afe"
          iconName="map-pin"
        />
        <HorizontalLine />
        <TouchableOpacity style={styles.sectionLink} onPress={() => router.push('/insurance')}>
          <Text style={styles.sectionLinkText}>Insurance Provider</Text>
          <FeatherIcon name="chevron-right" size={20} color="#007bff" />
        </TouchableOpacity>
        <HorizontalLine />
        <EditableField
          label="Emergency Contact"
          value={emergencyContact}
          onChangeText={setEmergencyContact}
          isEditing={editingField === 'emergencyContact'}
          onEdit={() => handleEdit('emergencyContact')}
          iconColor="#ff6347"
          iconName="phone-call"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const EditableField = ({ label, value, onChangeText, isEditing, onEdit, iconColor, iconName }) => (
  <View style={styles.inputContainer}>
    <View style={styles.inputWrapper}>
      <View style={[styles.inputIconWrapper, { backgroundColor: iconColor }]}>
        <FeatherIcon name={iconName} size={20} color="#fff" />
      </View>
      <Text style={styles.inputLabel}>{label}</Text>
      <Text style={styles.inputValue}>{value || `Enter ${label}`}</Text>
      <TouchableOpacity onPress={onEdit}>
        <FeatherIcon name="edit-3" size={20} color={iconColor} />
      </TouchableOpacity>
    </View>
    {isEditing && (
      <TextInput
        style={styles.input}
        placeholder={`Enter ${label}`}
        value={value}
        onChangeText={onChangeText}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'linear-gradient(to bottom, #f7f7f7, #e8e8e8)',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#333',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#007bff',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  editIconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007bff',
    borderRadius: 12,
    padding: 4,
  },
  inputContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 20, // Increased padding
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  inputValue: {
    fontSize: 16,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12, // Increased padding
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#333',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  sectionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  sectionLinkText: {
    fontSize: 16,
    color: '#007bff',
  },
});

export default ProfileScreen;
