import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../(redux)/authSlice';
import useInsurance from '../../hooks/useInsurance';
import { useRouter } from 'expo-router';
import { debounce } from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditableField = ({ value, onChangeText, isEditing, onEdit, iconColor, iconName }) => (
  <View style={styles.inputContainer}>
    <View style={styles.inputWrapper}>
      <View style={[styles.inputIconWrapper, { backgroundColor: iconColor }]}>
        <FeatherIcon name={iconName} size={20} color="#fff" />
      </View>
      <Text style={styles.inputValue}>{value || 'Enter value'}</Text>
      <TouchableOpacity onPress={onEdit}>
        <FeatherIcon name="edit-3" size={20} color={iconColor} />
      </TouchableOpacity>
    </View>
    {isEditing && (
      <TextInput
        style={styles.input}
        placeholder="Enter value"
        value={value}
        onChangeText={onChangeText}
        onBlur={() => onChangeText(value)}
      />
    )}
  </View>
);

const InsuranceScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const profileData = useSelector((state) => state.auth.profileData); // Assuming profile data is stored in Redux
  const { insuranceProviders } = useInsurance();
  const router = useRouter();

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [formData, setFormData] = useState({
    insuranceNumber: '',
    groupNumber: '',
    policyholderName: '',
    relationshipToPolicyholder: '',
    effectiveDate: '',
    expirationDate: '',
  });
  const [insuranceCardImage, setInsuranceCardImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const slideAnim = useState(new Animated.Value(-1000))[0];
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    const loadInsuranceData = async () => {
      try {
        const storedInsuranceData = await AsyncStorage.getItem('insuranceData');
        if (storedInsuranceData) {
          const parsedInsuranceData = JSON.parse(storedInsuranceData);
          setFormData(parsedInsuranceData);
          setSelectedProvider(parsedInsuranceData.selectedProvider); // Load selected provider
        }
      } catch (error) {
        console.error('Failed to load insurance data', error);
      }
    };
    loadInsuranceData();
  }, []);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const handleProviderSelect = async (provider) => {
    setSelectedProvider(provider);
    console.log('Selected Provider:', provider);
    const updatedFormData = { ...formData, selectedProvider: provider };
    try {
      await AsyncStorage.setItem('insuranceData', JSON.stringify(updatedFormData));
    } catch (error) {
      console.error('Error saving selected provider to AsyncStorage:', error);
    }
  };

  const handleSave = async (updatedFormData) => {
    const { insuranceNumber, groupNumber, policyholderName, relationshipToPolicyholder } = updatedFormData;
  
    if (!selectedProvider || !insuranceNumber || !policyholderName || !relationshipToPolicyholder) {
      return;
    }
  
    const payload = {
      userId: user.userId,
      ...profileData,
      insuranceProvider: selectedProvider.name,
      ...updatedFormData,
      insuranceCardImage,
    };
  
    setLoading(true);
  
    try {
      await AsyncStorage.setItem('insuranceData', JSON.stringify(payload));
      dispatch(updateProfile(payload));
    } catch (error) {
      console.error('Error saving insurance data to AsyncStorage:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const debouncedSave = debounce(handleSave, 1000);
  
  const handleInputChange = async (field, value) => {
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);
    debouncedSave(updatedFormData);
    try {
      await AsyncStorage.setItem('insuranceData', JSON.stringify(updatedFormData));
    } catch (error) {
      console.error('Error saving insurance data to AsyncStorage:', error);
    }
  };

  const handleEdit = (field) => {
    setEditingField(editingField === field ? null : field);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FeatherIcon color="#000" name="arrow-left" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Insurance Information</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <EditableField
          value={formData.insuranceNumber}
          onChangeText={(value) => handleInputChange('insuranceNumber', value)}
          isEditing={editingField === 'insuranceNumber'}
          onEdit={() => handleEdit('insuranceNumber')}
          iconColor="#007bff"
          iconName="file-text"
        />
        <EditableField
          value={formData.groupNumber}
          onChangeText={(value) => handleInputChange('groupNumber', value)}
          isEditing={editingField === 'groupNumber'}
          onEdit={() => handleEdit('groupNumber')}
          iconColor="#fe9400"
          iconName="hash"
        />
        <EditableField
          value={formData.policyholderName}
          onChangeText={(value) => handleInputChange('policyholderName', value)}
          isEditing={editingField === 'policyholderName'}
          onEdit={() => handleEdit('policyholderName')}
          iconColor="#32c759"
          iconName="user"
        />
        <EditableField
          value={formData.relationshipToPolicyholder}
          onChangeText={(value) => handleInputChange('relationshipToPolicyholder', value)}
          isEditing={editingField === 'relationshipToPolicyholder'}
          onEdit={() => handleEdit('relationshipToPolicyholder')}
          iconColor="#007afe"
          iconName="users"
        />
        <EditableField
          value={formData.effectiveDate}
          onChangeText={(value) => handleInputChange('effectiveDate', value)}
          isEditing={editingField === 'effectiveDate'}
          onEdit={() => handleEdit('effectiveDate')}
          iconColor="#ff6347"
          iconName="calendar"
        />
        <EditableField
          value={formData.expirationDate}
          onChangeText={(value) => handleInputChange('expirationDate', value)}
          isEditing={editingField === 'expirationDate'}
          onEdit={() => handleEdit('expirationDate')}
          iconColor="#ff6347"
          iconName="calendar"
        />
        <Text style={styles.addProviderText}>Add Insurance Provider</Text>
        <FlatList
          data={insuranceProviders}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.insuranceCard,
                item.name === selectedProvider?.name && styles.selectedInsuranceCard,
              ]}
              onPress={() => handleProviderSelect(item)}
            >
              <View style={styles.insuranceCardIconContainer}>
                <Image source={{ uri: item.icon }} style={styles.insuranceCardIcon} />
              </View>
              <Text style={styles.insuranceCardName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.insuranceListContent}
        />
      </ScrollView>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  insuranceListContent: {
    paddingHorizontal: 10,
  },
  insuranceCard: {
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  insuranceCardIconContainer: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 8,
  },
  selectedInsuranceCard: {
    borderColor: '#007BFF',
    borderWidth: 2,
  },
  insuranceCardIcon: {
    width: 40,
    height: 40,
  },
  insuranceCardName: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
  },
  uploadButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  insuranceCardPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 8,
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 20,
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
  addProviderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginVertical: 10,
  },
});

export default InsuranceScreen;

