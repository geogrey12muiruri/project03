import React, { useState, useEffect } from "react";
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
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { logoutAction } from "../(redux)/authSlice";
import FeatherIcon from "react-native-vector-icons/Feather";
import ProtectedRoute from "../../components/ProtectedRoute";
import InsuranceProvider from "../../components/InsuranceProvider";
import useInsurance from "../../hooks/useInsurance";

export default function Settings() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [form, setForm] = useState({
    emailNotifications: true,
    pushNotifications: false,
  });

  const [patientProfile, setPatientProfile] = useState({
    fullName: `${user?.firstName || ""} ${user?.lastName || ""}`,
    dateOfBirth: user?.dateOfBirth || "",
    gender: user?.gender || "",
    insuranceProvider: user?.insuranceProvider || "",
  });

  const insuranceProviders = useInsurance();

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

  const handleLogout = () => {
    dispatch(logoutAction());
    router.push("/");
  };

  return (
    <ProtectedRoute>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity>
              <FeatherIcon color="#000" name="arrow-left" size={24} />
            </TouchableOpacity>
            <Text numberOfLines={1} style={styles.headerTitle}>
              Settings
            </Text>
            <TouchableOpacity>
              <FeatherIcon color="#000" name="more-vertical" size={24} />
            </TouchableOpacity>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.sectionBody}>
              <TouchableOpacity style={styles.profile}>
                <Image
                  alt=""
                  source={{ uri: user?.picture || "https://via.placeholder.com/150" }}
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
            </View>
          </View>

          {/* Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.sectionBody}>
              <View style={[styles.rowWrapper, styles.rowFirst]}>
                <TouchableOpacity style={styles.row}>
                  <Text style={styles.rowLabel}>Language</Text>
                  <View style={styles.rowSpacer} />
                  <Text style={styles.rowValue}>English</Text>
                  <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                </TouchableOpacity>
              </View>
              <View style={styles.rowWrapper}>
                <TouchableOpacity style={styles.row}>
                  <Text style={styles.rowLabel}>Location</Text>
                  <View style={styles.rowSpacer} />
                  <Text style={styles.rowValue}>Los Angeles, CA</Text>
                  <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
                </TouchableOpacity>
              </View>
              <View style={styles.rowWrapper}>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Email Notifications</Text>
                  <View style={styles.rowSpacer} />
                  <Switch
                    onValueChange={(emailNotifications) =>
                      setForm({ ...form, emailNotifications })
                    }
                    value={form.emailNotifications}
                  />
                </View>
              </View>
              <View style={[styles.rowWrapper, styles.rowLast]}>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Push Notifications</Text>
                  <View style={styles.rowSpacer} />
                  <Switch
                    onValueChange={(pushNotifications) =>
                      setForm({ ...form, pushNotifications })
                    }
                    value={form.pushNotifications}
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
                  onPress={() =>
                    setPatientProfile({ ...patientProfile, insuranceProvider: item.name })
                  }
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
});
