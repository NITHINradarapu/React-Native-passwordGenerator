import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { Formik } from 'formik';

import * as Yup from 'yup';

import BouncyCheckbox from 'react-native-bouncy-checkbox';
const PasswordSchema = Yup.object().shape({
  passwordLength: Yup.number()
    .min(4, 'min 4 chars')
    .max(16, 'max 16 chars')
    .required('Password is required'),
});

export default function App() {
  const [password, setPassword] = useState(''); // state to hold the generated password
  const [isPassGenerated, setIsPassGenerated] = useState(false); // state to track if password is generated or not
  const [lowercase, setLowercase] = useState(true); // state to track if lowercase characters should be included
  const [uppercase, setUppercase] = useState(false); // state to track if uppercase characters should be included
  const [numbers, setNumbers] = useState(false); // state to track if numbers should be included
  const [symbols, setSymbols] = useState(false); // state to track if symbols should be included

  const generatePasswordString = (passwordLength: number) => {
    let characterList = ''; // variable to hold the list of characters to generate password from

    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (lowercase) {
      characterList += lowercaseChars;
    }
    if (uppercase) {
      characterList += uppercaseChars;
    }
    if (numbers) {
      characterList += numberChars;
    }
    if (symbols) {
      characterList += symbolChars;
    }

    const passwordResult = createPassword(characterList, passwordLength);
    setPassword(passwordResult);
    setIsPassGenerated(true);
  };

  const createPassword = (characters: string, passwordLength: number) => {
    let result = '';
    for (let i = 0; i < passwordLength; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  };

  const resetPasswordState = () => {
    setPassword('');
    setIsPassGenerated(false);
    setLowercase(true);
    setUppercase(false);
    setNumbers(false);
    setSymbols(false);
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.appContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Password Generator</Text>
          <Formik
            initialValues={{ passwordLength: '' }}
            validationSchema={PasswordSchema}
            onSubmit={values => {
              generatePasswordString(+values.passwordLength);
            }}
          >
            {({
              values,
              errors,
              touched,
              isValid,
              handleChange,
              handleSubmit,
              handleReset,
              /* and other goodies */
            }) => (
              <>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputColumn}>
                    <Text style={styles.heading}>Password Length</Text>
                    {touched.passwordLength && errors.passwordLength && (
                      <Text style={styles.errorText}>
                        {errors.passwordLength}
                      </Text>
                    )}
                  </View>
                  <TextInput
                    style={styles.inputStyle}
                    value={values.passwordLength}
                    onChangeText={handleChange('passwordLength')}
                    placeholder="Ex 8"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Include Lowercase</Text>
                  <BouncyCheckbox
                    disableText={true}
                    isChecked={lowercase}
                    onPress={() => setLowercase(!lowercase)}
                    fillColor="#5DA3FA"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Include Uppercase</Text>
                  <BouncyCheckbox
                    disableText={true}
                    isChecked={uppercase}
                    onPress={() => setUppercase(!uppercase)}
                    fillColor="#5DA3FA"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Include Numbers</Text>
                  <BouncyCheckbox
                    disableText={true}
                    isChecked={numbers}
                    onPress={() => setNumbers(!numbers)}
                    fillColor="#5DA3FA"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Include Symbols</Text>
                  <BouncyCheckbox
                    disableText={true}
                    isChecked={symbols}
                    onPress={() => setSymbols(!symbols)}
                    fillColor="#5DA3FA"
                  />
                </View>
                <View style={styles.formActions}>
                  <TouchableOpacity
                    disabled={!isValid}
                    style={styles.primaryBtn}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.primaryBtnTxt}>Generate Password</Text>
                  </TouchableOpacity>


                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => {
                      handleReset();
                      resetPasswordState();
                    }}  
                  >
                    <Text style={styles.secondaryBtnTxt}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
        {isPassGenerated && (
          <View style={styles.card}>
            <View style={styles.cardElevated}>
              <Text selectable={true} style={styles.generatedPassword}>{password}</Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },

  formContainer: {
    margin: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1E293B',
  },

  heading: {
    fontSize: 15,
    fontWeight: '500',
    color: '#334155',
  },

  inputWrapper: {
    marginBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  inputColumn: {
    flexDirection: 'column',
  },

  inputStyle: {
    padding: 10,
    width: 70,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    textAlign: 'center',
  },

  errorText: {
    fontSize: 12,
    color: '#EF4444',
  },

  formActions: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  primaryBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    marginRight: 8,
  },

  primaryBtnTxt: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },

  secondaryBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    marginLeft: 8,
  },

  secondaryBtnTxt: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    color: '#334155',
  },

  card: {
    marginHorizontal: 16,
    marginTop: 20,
  },

  cardElevated: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    alignItems: 'center',
  },

  generatedPassword: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#0F172A',
  },
});

