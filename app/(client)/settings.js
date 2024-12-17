import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  FlatList,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { logoutAction, setProfileImage } from "../(redux)/authSlice";
import FeatherIcon from "react-native-vector-icons/Feather";
import ProtectedRoute from "../../components/ProtectedRoute";
import InsuranceProvider from "../../components/InsuranceProvider";
import useInsurance from "../../hooks/useInsurance";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
// import { Camera } from 'expo-camera'; // Remove Camera import
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dws2bgxg4/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'medplus';

export default function Settings() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  console.log('User:', user); // Log the user object to locate the userId

  const [form, setForm] = useState({
    emailNotifications: true,
    pushNotifications: false,
  });

  const [patientProfile, setPatientProfile] = useState({
    fullName: `${user?.firstName || ""} ${user?.lastName || ""}`,
    dateOfBirth: user?.dateOfBirth || "",
    gender: user?.gender || "",
    phoneNumber: user?.phoneNumber || "", // Ensure phoneNumber has an initial value
    insuranceProvider: user?.insuranceProvider || "",
  });

  const [isPersonalInfoCollapsed, setIsPersonalInfoCollapsed] = useState(true);

  const insuranceProviders = useInsurance();

  const [preferences, setPreferences] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    emailNotifications: true,
    pushNotifications: false,
  });

  const [isLocationCollapsed, setIsLocationCollapsed] = useState(true);

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setPatientProfile({
        fullName: `${user.firstName} ${user.lastName}`,
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "",
        insuranceProvider: user.insuranceProvider || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const loadPreferences = async () => {
      const storedPreferences = await AsyncStorage.getItem('preferences');
      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences));
      }
      const storedInsuranceProvider = await AsyncStorage.getItem('insuranceProvider');
      if (storedInsuranceProvider) {
        setPatientProfile((prevProfile) => ({
          ...prevProfile,
          insuranceProvider: storedInsuranceProvider,
        }));
      }
    };
    loadPreferences();
  }, []);

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const response = await fetch('https://project03-rj91.onrender.com/api/users/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`, // Assuming you have the token stored in the user object
          },
        });

        if (response.ok) {
          const data = await response.json();
          const profile = data.user;

          if (profile) {
            setPatientProfile({
              fullName: `${profile.firstName} ${profile.lastName}`,
              dateOfBirth: profile.dateOfBirth || "",
              gender: profile.gender || "",
              phoneNumber: profile.phoneNumber || "",
              insuranceProvider: profile.insuranceProvider || "",
            });

            setPreferences({
              street: profile.preferences.street || '',
              city: profile.preferences.city || '',
              state: profile.preferences.state || '',
              zipCode: profile.preferences.zipCode || '',
              emailNotifications: profile.preferences.emailNotifications !== undefined ? profile.preferences.emailNotifications : true,
              pushNotifications: profile.preferences.pushNotifications !== undefined ? profile.preferences.pushNotifications : false,
            });
          } else {
            console.error('Profile is null');
          }
        } else {
          console.error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (user) {
      fetchPatientProfile();
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutAction());
    router.push("/");
  };

  const handlePersonalInfoToggle = () => {
    setIsPersonalInfoCollapsed(!isPersonalInfoCollapsed);
  };

  const handleSaveProfile = async () => {
    const payload = {
      userId: user.userId,
      fullName: patientProfile.fullName,
      dateOfBirth: patientProfile.dateOfBirth,
      gender: patientProfile.gender,
      phoneNumber: patientProfile.phoneNumber,
      insuranceProvider: patientProfile.insuranceProvider,
      preferences: {
        street: preferences.street,
        city: preferences.city,
        state: preferences.state,
        zipCode: preferences.zipCode,
        emailNotifications: preferences.emailNotifications,
        pushNotifications: preferences.pushNotifications,
      },
    };
  
    try {
      const response = await fetch('https://project03-rj91.onrender.com/api/users/updatePatientProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`, // Include the token in the header
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const data = await response.json();
        
        // Show success feedback to the user
        if (Platform.OS === 'web') {
          alert(data.message);
        } else {
          Alert.alert('Success', data.message);
        }
  
        // Reset the form fields
        setPatientProfile({
          fullName: `${user?.firstName || ""} ${user?.lastName || ""}`,
          dateOfBirth: user?.dateOfBirth || "",
          gender: user?.gender || "",
          phoneNumber: user?.phoneNumber || "",
          insuranceProvider: user?.insuranceProvider || "",
        });
  
        // Optionally reset preferences
        setPreferences({
          street: '',
          city: '',
          state: '',
          zipCode: '',
          emailNotifications: true,
          pushNotifications: false,
        });
      } else {
        const errorData = await response.json();
        if (Platform.OS === 'web') {
          alert(errorData.message || 'Failed to update profile');
        } else {
          Alert.alert('Error', errorData.message || 'Failed to update profile');
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (Platform.OS === 'web') {
        alert('Something went wrong. Please try again.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    }
  };
  

  const handlePreferenceChange = (key, value) => {
    const updatedPreferences = { ...preferences, [key]: value };
    setPreferences(updatedPreferences);
    AsyncStorage.setItem('preferences', JSON.stringify(updatedPreferences));
  };

  const handleLocationToggle = () => {
    setIsLocationCollapsed(!isLocationCollapsed);
  };

  const handleInsuranceProviderChange = async (provider) => {
    setPatientProfile({ ...patientProfile, insuranceProvider: provider });
    await AsyncStorage.setItem('insuranceProvider', provider);
  };

  const handleProfileChange = (key, value) => {
    setPatientProfile({ ...patientProfile, [key]: value });
  };

  const resizeImage = async (uri) => {
    const result = await ImageManipulator.manipulateAsync(uri, [
      { resize: { width: 800 } },
    ]);
    return result.uri;
  };

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const resizedUri = await resizeImage(result.assets[0].uri);
      setIsUploading(true);
      try {
        const imageUrl = await uploadImageToCloudinary(resizedUri);
        await AsyncStorage.setItem('profileImage', imageUrl);
         dispatch(setProfileImage(imageUrl));
        setPatientProfile((prevProfile) => ({
          ...prevProfile,
          picture: imageUrl,
        }));
        Alert.alert('Success', 'Image uploaded successfully!');
      } catch (error) {
        console.error('Error uploading images:', error);
        Alert.alert('Error', 'An error occurred while uploading images');
      } finally {
        setIsUploading(false);
      }
    }
  }, [dispatch]);

  const uploadImageToCloudinary = async (imageUri) => {
    const data = new FormData();
    const response = await fetch(imageUri);
    const blob = await response.blob();

    data.append('file', blob);
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    data.append('quality', 'auto');
    data.append('fetch_format', 'auto');

    try {
      const uploadResponse = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: data,
      });
      const result = await uploadResponse.json();
      return result.secure_url;
    } catch (uploadError) {
      console.error('Error uploading image to Cloudinary:', uploadError);
      throw uploadError;
    }
  };

  useEffect(() => {
    const loadProfileImage = async () => {
      const storedImageUrl = await AsyncStorage.getItem('profileImage');
      if (storedImageUrl) {
        setPatientProfile((prevProfile) => ({
          ...prevProfile,
          picture: storedImageUrl,
        }));
      }
    };
    loadProfileImage();
  }, []);

  return (
    <ProtectedRoute>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Header */}
          <View style={styles.header}>
          
            <Text numberOfLines={1} style={styles.headerTitle}>
              Settings
            </Text>
            <TouchableOpacity>
              <FeatherIcon color="#000" name="more-vertical" size={24} />
            </TouchableOpacity>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <TouchableOpacity onPress={handlePersonalInfoToggle}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </TouchableOpacity>
            <View style={styles.sectionBody}>
              <TouchableOpacity style={styles.profile} onPress={handlePersonalInfoToggle}>
                <Image
                  alt=""
                  source={{ uri: patientProfile.picture || "https://via.placeholder.com/150" }}
                  style={styles.profileAvatar}
                />
                <View style={styles.profileBody}>
                  <Text style={styles.profileName}>
                    {user ? `${user.firstName} ${user.lastName}` : "John Doe"}
                  </Text>
                  <Text style={styles.profileHandle}>{user ? user.email : "john@example.com"}</Text>
                </View>
                <FeatherIcon color="#bcbcbc" name="chevron-right" size={22} />
              </TouchableOpacity>
              {!isPersonalInfoCollapsed && (
                <>
                  <TouchableOpacity onPress={pickImage}>
                    <Text style={styles.uploadButton}>Upload Image</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={patientProfile.fullName}
                    onChangeText={(text) => handleProfileChange("fullName", text)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Date of Birth"
                    value={patientProfile.dateOfBirth}
                    onChangeText={(text) => handleProfileChange("dateOfBirth", text)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    value={patientProfile.phoneNumber}
                    onChangeText={(text) => handleProfileChange("phoneNumber", text)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Gender"
                    value={patientProfile.gender}
                    onChangeText={(text) => handleProfileChange("gender", text)}
                  />
                </>
              )}
            </View>
          </View>

          {/* Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.sectionBody}>
              <View style={[styles.rowWrapper, styles.rowFirst]}>
                <TouchableOpacity style={styles.row} onPress={handleLocationToggle}>
                  <Text style={styles.rowLabel}>Location</Text>
                  <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                </TouchableOpacity>
                {!isLocationCollapsed && (
                  <>
                    <View style={styles.row}>
                      <Text style={styles.rowLabel}>Street</Text>
                      <TextInput
                        style={styles.rowValue}
                        placeholder="Street"
                        value={preferences.street}
                        onChangeText={(text) => handlePreferenceChange('street', text)}
                      />
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.rowLabel}>City</Text>
                      <TextInput
                        style={styles.rowValue}
                        placeholder="City"
                        value={preferences.city}
                        onChangeText={(text) => handlePreferenceChange('city', text)}
                      />
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.rowLabel}>State</Text>
                      <TextInput
                        style={styles.rowValue}
                        placeholder="State"
                        value={preferences.state}
                        onChangeText={(text) => handlePreferenceChange('state', text)}
                      />
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.rowLabel}>Zip Code</Text>
                      <TextInput
                        style={styles.rowValue}
                        placeholder="Zip Code"
                        value={preferences.zipCode}
                        onChangeText={(text) => handlePreferenceChange('zipCode', text)}
                      />
                    </View>
                  </>
                )}
              </View>
              <View style={styles.rowWrapper}>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Email Notifications</Text>
                  <View style={styles.rowSpacer} />
                  <Switch
                    onValueChange={(emailNotifications) =>
                      handlePreferenceChange('emailNotifications', emailNotifications)
                    }
                    value={preferences.emailNotifications}
                  />
                </View>
              </View>
              <View style={[styles.rowWrapper, styles.rowLast]}>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Push Notifications</Text>
                  <View style={styles.rowSpacer} />
                  <Switch
                    onValueChange={(pushNotifications) =>
                      handlePreferenceChange('pushNotifications', pushNotifications)
                    }
                    value={preferences.pushNotifications}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Insurance Providers */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Insurance Providers</Text>
            <FlatList
              data={insuranceProviders}
              horizontal
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.insuranceCard,
                    item.name === patientProfile.insuranceProvider && styles.selectedInsuranceCard,
                  ]}
                  onPress={() => handleInsuranceProviderChange(item.name)}
                >
                  <Text style={styles.insuranceCardText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item._id.toString()}
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.insuranceListContent}
            />
          </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>

          {/* Resources */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resources</Text>
            <View style={styles.sectionBody}>
              <TouchableOpacity style={styles.row}>
                <Text style={styles.rowLabel}>Contact Us</Text>
                <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.row}>
                <Text style={styles.rowLabel}>Report Bug</Text>
                <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.row}>
                <Text style={styles.rowLabel}>Terms and Privacy</Text>
                <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
              </TouchableOpacity>
            </View>
          </View>

        

          {/* Logout */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionBody: {
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    backgroundColor: "#fff",
    padding: 12,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 9999,
    marginRight: 12,
  },
  profileBody: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#292929",
  },
  profileHandle: {
    fontSize: 16,
    color: "#858585",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  rowWrapper: {
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
  },
  rowFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  rowLabel: {
    fontSize: 16,
    color: "#000",
  },
  rowSpacer: {
    flex: 1,
  },
  rowValue: {
    fontSize: 16,
    color: "#ababab",
  },
  rowLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  insuranceListContent: {
    paddingVertical: 8,
  },
  insuranceCard: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginHorizontal: 4,
    elevation: 2,
  },
  selectedInsuranceCard: {
    borderColor: "#007BFF",
    borderWidth: 1,
  },
  insuranceCardText: {
    fontSize: 14,
    color: "#333",
  },
  logoutButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#FF3B30",
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  uploadButton: {
    color: "#007BFF",
    marginVertical: 8,
    textAlign: "center",
  },
});
