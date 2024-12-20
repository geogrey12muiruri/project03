import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView, Alert } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import HorizontalLine from '../../components/common/HorizontalLine';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import usePatientProfile from '../../hooks/usePatientProfile';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../(redux)/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { patientProfile, pickImage } = usePatientProfile();
  const profileData = useSelector((state) => state.auth.profileData); // Get profile data from Redux
  const [fullName, setFullName] = useState(profileData.fullName || '');
  const [dob, setDob] = useState(new Date(profileData.dob) || new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState(profileData.gender || '');
  const [phoneNumber, setPhoneNumber] = useState(profileData.phoneNumber || '');
  const [address, setAddress] = useState(profileData.address || {
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [emergencyContact, setEmergencyContact] = useState(profileData.emergencyContact || '');
  const [editingField, setEditingField] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedProfileData = await AsyncStorage.getItem('profileData');
        if (storedProfileData) {
          const parsedProfileData = JSON.parse(storedProfileData);
          setFullName(parsedProfileData.fullName);
          setDob(new Date(parsedProfileData.dob));
          setGender(parsedProfileData.gender);
          setPhoneNumber(parsedProfileData.phoneNumber);
          setAddress(parsedProfileData.address);
          setEmergencyContact(parsedProfileData.emergencyContact);
        }
      } catch (error) {
        console.error('Failed to load profile data', error);
      }
    };
    loadProfileData();
  }, []);

  const saveProfileData = async (updatedData) => {
    try {
      await AsyncStorage.setItem('profileData', JSON.stringify(updatedData));
      dispatch(updateProfile(updatedData));
    } catch (error) {
      console.error('Failed to save profile data', error);
    }
  };

  const handleEdit = (field) => {
    setEditingField(editingField === field ? null : field);
  };

  const handleSave = (field, value) => {
    setLoading(true);
    const updatedData = {
      fullName,
      dob,
      gender,
      phoneNumber,
      address,
      emergencyContact,
    };
    switch (field) {
      case 'fullName':
        updatedData.fullName = value;
        setFullName(value);
        break;
      case 'dob':
        updatedData.dob = new Date(value);
        setDob(new Date(value));
        break;
      case 'gender':
        updatedData.gender = value;
        setGender(value);
        break;
      case 'phoneNumber':
        updatedData.phoneNumber = value;
        setPhoneNumber(value);
        break;
      case 'emergencyContact':
        updatedData.emergencyContact = value;
        setEmergencyContact(value);
        break;
      case 'street':
        updatedData.address.street = value;
        setAddress({ ...address, street: value });
        break;
      case 'city':
        updatedData.address.city = value;
        setAddress({ ...address, city: value });
        break;
      case 'state':
        updatedData.address.state = value;
        setAddress({ ...address, state: value });
        break;
      case 'zipCode':
        updatedData.address.zipCode = value;
        setAddress({ ...address, zipCode: value });
        break;
      default:
        break;
    }
    saveProfileData(updatedData);
    setLoading(false);
    setEditingField(null);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(false);
    setDob(currentDate);
    handleSave('dob', currentDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <FeatherIcon name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.profileSection}>
          <View style={styles.profileBackground}>
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
        </View>
        <HorizontalLine />
        <EditableField
          value={fullName}
          isEditing={editingField === 'fullName'}
          onEdit={() => handleEdit('fullName')}
          onSave={(value) => handleSave('fullName', value)}
          iconColor="#007bff"
          iconName="user"
        />
        <EditableField
          value={dob.toDateString()}
          isEditing={editingField === 'dob'}
          onEdit={() => setShowDatePicker(true)}
          onSave={(value) => handleSave('dob', value)}
          iconColor="#ff6347"
          iconName="calendar"
        />
        {showDatePicker && (
          <DateTimePicker
            value={dob}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <View style={[styles.inputIconWrapper, { backgroundColor: '#32c759' }]}>
              <FeatherIcon name="user-check" size={20} color="#fff" />
            </View>
            <Picker
              selectedValue={gender}
              style={styles.picker}
              onValueChange={(itemValue) => handleSave('gender', itemValue)}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
        </View>
        <EditableField
          value={phoneNumber}
          isEditing={editingField === 'phoneNumber'}
          onEdit={() => handleEdit('phoneNumber')}
          onSave={(value) => handleSave('phoneNumber', value)}
          iconColor="#007afe"
          iconName="phone"
        />
        <HorizontalLine />
        <EditableField
          value={address.street}
          isEditing={editingField === 'street'}
          onEdit={() => handleEdit('street')}
          onSave={(value) => handleSave('street', value)}
          iconColor="#007bff"
          iconName="map-pin"
        />
        <EditableField
          value={address.city}
          isEditing={editingField === 'city'}
          onEdit={() => handleEdit('city')}
          onSave={(value) => handleSave('city', value)}
          iconColor="#fe9400"
          iconName="map"
        />
        <EditableField
          value={address.state}
          isEditing={editingField === 'state'}
          onEdit={() => handleEdit('state')}
          onSave={(value) => handleSave('state', value)}
          iconColor="#32c759"
          iconName="map"
        />
        <EditableField
          value={address.zipCode}
          isEditing={editingField === 'zipCode'}
          onEdit={() => handleEdit('zipCode')}
          onSave={(value) => handleSave('zipCode', value)}
          iconColor="#007afe"
          iconName="map-pin"
        />
        <HorizontalLine />
        <EditableField
          value={emergencyContact}
          isEditing={editingField === 'emergencyContact'}
          onEdit={() => handleEdit('emergencyContact')}
          onSave={(value) => handleSave('emergencyContact', value)}
          iconColor="#ff6347"
          iconName="phone-call"
        />
        <HorizontalLine />
        <TouchableOpacity style={styles.navigationButton} onPress={() => router.push('/insurance')}>
          <Text style={styles.navigationButtonText}>Next: Insurance Provider</Text>
          <FeatherIcon name="chevron-right" size={20} color="#007bff" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const EditableField = ({ value, isEditing, onEdit, onSave, iconColor, iconName }) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleBlur = () => {
    onSave(inputValue);
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <View style={[styles.inputIconWrapper, { backgroundColor: iconColor }]}>
          <FeatherIcon name={iconName} size={20} color="#fff" />
        </View>
        <Text style={styles.inputValue}>{value || `Enter value`}</Text>
        <TouchableOpacity onPress={onEdit}>
          <FeatherIcon name="edit-3" size={20} color={iconColor} />
        </TouchableOpacity>
      </View>
      {isEditing && (
        <TextInput
          style={styles.input}
          placeholder={`Enter value`}
          value={inputValue}
          onChangeText={setInputValue}
          onBlur={handleBlur}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  scrollViewContent: {
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 50,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileBackground: {
    backgroundColor: '#e8f4ff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
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
    marginHorizontal: 10, // Add margin to the sides
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
    marginHorizontal: 10, // Add margin to the sides
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
  saveIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    marginHorizontal: 8,
  },
  navigationButtonText: {
    fontSize: 16,
    color: '#007bff',
    marginHorizontal: 8,
  },
});

export default ProfileScreen;