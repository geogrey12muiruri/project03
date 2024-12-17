import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Async thunk to fetch doctors
export const fetchDoctors = createAsyncThunk(
  'doctors/fetchDoctors',
  async (_, { dispatch }) => {
    const cachedDoctors = await AsyncStorage.getItem('doctorList');
    if (cachedDoctors) {
      const parsedDoctors = JSON.parse(cachedDoctors);
      fetchFreshDoctors();
      return parsedDoctors;
    }
    const response = await axios.get('https://medplus-health.onrender.com/api/professionals');
    
    // Transform response to include insurance companies from the clinic
    const doctorsWithInsurance = response.data.map((doctor) => ({
      ...doctor,
      clinic: doctor.clinicId,  // Attach the entire clinic object here
    }));
    
    await AsyncStorage.setItem('doctorList', JSON.stringify(doctorsWithInsurance));
    return doctorsWithInsurance;
  }
);

const fetchFreshDoctors = async () => {
  try {
    const response = await axios.get('https://medplus-health.onrender.com/api/professionals');
    const doctorsWithInsurance = response.data.map((doctor) => ({
      ...doctor,
      clinic: doctor.clinicId,
    }));
    await AsyncStorage.setItem('doctorList', JSON.stringify(doctorsWithInsurance));
  } catch (error) {
    console.error('Failed to fetch fresh doctors', error);
  }
};

// Initial state
const initialState = {
  doctorList: [],
  selectedDoctor: null,  // Initialize as null
  loading: false,
  error: null,
};

// Doctor slice
const doctorsSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    setSelectedDoctor(state, action) {
      console.log('Setting selected doctor with ID:', action.payload); // Debugging log
      state.selectedDoctor = state.doctorList.find((doctor) => doctor._id === action.payload) || null;
      console.log('Selected doctor:', state.selectedDoctor); // Debugging log
    },
    clearSelectedDoctor(state) {
      state.selectedDoctor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.doctorList = action.payload;
        state.loading = false;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load doctors';
      });
  },
});

// Action exports
export const { setSelectedDoctor, clearSelectedDoctor } = doctorsSlice.actions;

// Selector to select all doctors
export const selectDoctors = (state) => state.doctors.doctorList;

// Selector to select the current selected doctor
export const selectSelectedDoctor = (state) => state.doctors.selectedDoctor;

export default doctorsSlice.reducer;
