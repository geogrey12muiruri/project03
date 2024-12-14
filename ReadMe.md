import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

import LoginSVG from '../../assets/images/misc/loginp.png';
import GoogleSVG from '../../assets/images/misc/google.svg';
import FacebookSVG from '../../assets/images/misc/facebook.svg';
import TwitterSVG from '../../assets/images/misc/twitter.svg';

import CustomButton from '../../components/CustomButton';
import InputField from '../../components/InputField';

// Define the validation schema using Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too Short!').required('Required'),
});

const LoginScreen = ({ navigation }) => {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <View style={{ paddingHorizontal: 25 }}>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={LoginSVG}
            style={{ height: 300, width: 300, transform: [{ rotate: '-5deg' }] }}
          />
        </View>

        <Text
          style={{
            fontFamily: 'Roboto-Medium',
            fontSize: 28,
            fontWeight: '500',
            color: '#333',
            marginBottom: 30,
          }}>
          Login
        </Text>

        <Formik
  initialValues={{ email: '', password: '' }}
  validationSchema={LoginSchema}
  onSubmit={(values) => {
    console.log('Formik onSubmit triggered with:', values);
    router.push('/(client)');

  }}
>
  {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
    <View>
      <InputField
        label="Email ID"
        icon={
          <MaterialIcons
            name="alternate-email"
            size={20}
            color="#666"
            style={{ marginRight: 5 }}
          />
        }
        keyboardType="email-address"
        onChangeText={(text) => {
          console.log('Email Input:', text);
          handleChange('email')(text);
        }}
        onBlur={handleBlur('email')}
        value={values.email}
      />
      {errors.email && touched.email && (
        <Text style={{ color: 'red' }}>{errors.email}</Text>
      )}

      <InputField
        label="Password"
        icon={
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#666"
            style={{ marginRight: 5 }}
          />
        }
        inputType="password"
        onChangeText={(text) => {
          console.log('Password Input:', text);
          handleChange('password')(text);
        }}
        onBlur={handleBlur('password')}
        value={values.password}
      />
      {errors.password && touched.password && (
        <Text style={{ color: 'red' }}>{errors.password}</Text>
      )}

      <CustomButton 
        label="Login" 
        onPress={() => {
          console.log('Button Pressed');
          handleSubmit();
        }} 
      />
    </View>
  )}
</Formik>


        <Text style={{ textAlign: 'center', color: '#666', marginBottom: 30 }}>
          Or, login with ...
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 30,
          }}>
          <TouchableOpacity
            onPress={() => { }}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}>
            <Image source={GoogleSVG} style={{ height: 24, width: 24 }} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { }}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}>
            <Image source={FacebookSVG} style={{ height: 24, width: 24 }} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { }}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}>
            <Image source={TwitterSVG} style={{ height: 24, width: 24 }} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text>New to the app?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{ color: '#AD40AF', fontWeight: '700' }}> Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;