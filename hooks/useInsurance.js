import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useInsurance = () => {
  const [insuranceProviders, setInsuranceProviders] = useState([]);

  useEffect(() => {
    const fetchInsuranceProviders = async () => {
      try {
        const storedProviders = await AsyncStorage.getItem("insuranceProviders");
        if (storedProviders) {
          setInsuranceProviders(JSON.parse(storedProviders));
        } else {
          const response = await fetch("https://project03-rj91.onrender.com/insurance");
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data && Array.isArray(data)) {
            setInsuranceProviders(data);
            await AsyncStorage.setItem("insuranceProviders", JSON.stringify(data));
          } else {
            console.error("Unexpected response format:", data);
          }
        }
      } catch (error) {
        console.error("Error fetching insurance providers:", error);
      }
    };

    fetchInsuranceProviders();
  }, []);

  return insuranceProviders;
};

export default useInsurance;