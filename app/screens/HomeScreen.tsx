import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

type Expense = {
    amount: string;
    description: string;
    category: string;
  };

export default function HomeScreen({ navigation, route }: { navigation: any; route: any }) {
  const [ expenses, setExpenses ] = useState<Expense[]>(route.params?.expenses || []);

  //Load expenses from AsyncStorage when the component mounts
  useFocusEffect(
    React.useCallback(() => {
      const loadExpenses = async () => {
        try {
         const storedExpenses = await AsyncStorage.getItem('expenses');
          if (storedExpenses) {
            setExpenses(JSON.parse(storedExpenses));
          }
        } catch (error) {
         console.error('Failed to load Expenses: ', error);
        }
     };

    loadExpenses();
  }, [])
);

  // Save expenses to AsyncStorage whenever the expenses list changes
  useEffect ( () => {
    const saveExpenses = async () => {
      try {
        await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
      } catch(error) {
        console.error('Failed to save expenses to storage: ', error);
      }
    };
    if (expenses.length)
    {
      saveExpenses(); //only save if there are expenses to store
    }
  }, [expenses])

  // Update expenses when coming back from AddExpenseScreen
  useEffect(() => {
    if (route.params?.expenses) {
      setExpenses(route.params.expenses); // Update the state with the updated expenses from AddExpenseScreen
    }
  }, [route.params?.expenses]);
   
  //Function to delete expenses
  const handleDeleteExpense = (index : number) => {
    const updatedExpenses = [...expenses];
    updatedExpenses.splice(index, 1); // Remove the expense at specified index
    setExpenses(updatedExpenses); // Update the new Expense
  }

  const totalAmount = expenses.reduce((total: number, expense: Expense) => {
    return total + parseFloat(expense.amount || '0');
  }, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Expenses</Text>
      <Text style={styles.totalAmount}>Total Expenses: ${totalAmount.toFixed(2)}</Text>
      {expenses.length > 0 ? (
        <FlatList
          data={expenses}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.expenseCard}>
              <Text style={styles.expenseAmount}>Amount: ${item.amount}</Text>
              <Text style={styles.expenseDescription}>Description: {item.description}</Text>
              <Text style={styles.expenseCategory}>Category: {item.category}</Text>
              <TouchableOpacity style = {styles.deleteButton} onPress={() => handleDeleteExpense(index)}>
                <Text style = {styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton} onPress={() => 
                navigation.navigate('AddExpense', {expenses, expensesToEdit : { ...item, index},
                })
              }
              >
              <Text style = {styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noExpenses}>No expenses added yet.</Text>
      )}
      <Button
        title="Add Expense"
        onPress={() => navigation.navigate('AddExpense', { expenses })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#e74c3c',
  },
  expenseCard: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#000',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a085',
  },
  expenseDescription: {
    fontSize: 16,
    color: '#555',
  },
  expenseCategory: {
    fontSize: 14,
    color: '#aaa',
  },
  deleteButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  editButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  noExpenses: {
    marginTop: 20,
    fontStyle: 'italic',
    color: '#999',
  },
});

