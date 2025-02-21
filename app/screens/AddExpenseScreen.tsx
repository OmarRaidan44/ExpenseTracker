import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddExpenseScreen({ navigation, route }: { navigation: any; route: any }) {
  const { expenses = [], expensesToEdit = null } = route.params || {};

  // Initialize fields with values from `expenseToEdit` if editing
  const [amount, setAmount] = useState(expensesToEdit?.amount || '');
  const [description, setDescription] = useState(expensesToEdit?.description || '');
  const [category, setCategory] = useState(expensesToEdit?.category || '');

  useEffect(() => {
    // Set state only if `expensesToEdit` is available (edit mode)
    if (expensesToEdit) {
      setAmount(expensesToEdit.amount);
      setDescription(expensesToEdit.description);
      setCategory(expensesToEdit.category);
    }
  }, [expensesToEdit]); // Re-run when `expensesToEdit` change
  const handleSave = async () => {
    if (!amount || !description || !category) {
      alert('Please fill in all the fields before saving.');
      return;
    }

    const newExpense = { amount, description, category };
    
    try {
      // Fetch current expenses from AsyncStorage
      const storedExpenses = await AsyncStorage.getItem('expenses');
      const currentExpenses = storedExpenses ? JSON.parse(storedExpenses) : [];
  
      if (expensesToEdit) {
        // Editing an existing expense
        currentExpenses[expensesToEdit.index] = newExpense;
      } else {
        // Adding a new expense
        currentExpenses.push(newExpense);
      }
  
      // Save updated expenses back to AsyncStorage
      await AsyncStorage.setItem('expenses', JSON.stringify(currentExpenses));
  
      // Navigate back to HomeScreen
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Expense Amount:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholder={expensesToEdit ? expensesToEdit.amount : "Enter amount"}
      />
      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder={expensesToEdit ? expensesToEdit.description : "Enter description"}
      />
      <Text style={styles.label}>Category:</Text>
      <RNPickerSelect
        onValueChange={(value) => setCategory(value)}
        value={category} // Ensure the picker shows the selected category
        items={[
          { label: 'Food', value: 'Food' },
          { label: 'Transport', value: 'Transport' },
          { label: 'Shopping', value: 'Shopping' },
          { label: 'Bills', value: 'Bills' },
          { label: 'Others', value: 'Others' },
        ]}
        style={{
          inputAndroid: styles.picker,
          inputIOS: styles.picker,
        }}
        placeholder={{
          label: expensesToEdit ? expensesToEdit.category : 'Select a category...' ,
          value: null,
        }}
      />
      <Button title="Save Expense" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color : '#fff', 
  },
  input: {
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#fff',
  },
  picker: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
  },
});
