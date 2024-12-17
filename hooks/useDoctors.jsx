import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctors } from '../app/(redux)/doctorSlice';
import store from '../app/(redux)/store';

const useDoctors = () => {
  const dispatch = useDispatch();
  const rawDoctorList = useSelector((state) => state.doctors.doctorList);

  useEffect(() => {
    console.log('Raw doctor data:', rawDoctorList);
  }, [rawDoctorList]);

  const doctorList = rawDoctorList.map(doctor => ({
    id: doctor._id,
    name: `${doctor.firstName} ${doctor.lastName}`,
    specialty: doctor.specialty || 'General',
    experience: doctor.clinic?.experiences || [],
    profileImage: doctor.profileImage,
    clinicAddress: doctor.clinic?.address,
    insuranceCompanies: doctor.clinic?.insuranceCompanies || [],
  }));

  const loading = useSelector((state) => state.doctors.loading);
  const error = useSelector((state) => state.doctors.error);

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  return { doctorList, loading, error };
};

export default useDoctors;
