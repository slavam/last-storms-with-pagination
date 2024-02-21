import React from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = '#90e5fc'
const styles = StyleSheet.create({
  container: {
      flexDirection: 'row',
      borderBottomColor: '#bff0fd',
      backgroundColor: '#bff0fd',
      borderBottomWidth: 1,
      alignItems: 'center',
      height: 24,
      // fontSize: 9,
      textAlign: 'center',
      // fontStyle: 'bold',
      // flexGrow: 1,
  },
  stations: {
      width: '74px',
      borderRightColor: borderColor,
      borderRightWidth: 1,
  },
  day: {
      width: '22px',
      borderRightColor: borderColor,
      borderRightWidth: 1,
  },
});

const DteTableHeader = ({nDays}) =>     {
  let days = []  
  for(let i=1; i<=nDays; i++){
    days.push(<Text style={styles.day} key={i}>{i}</Text>)
  }
  return (
  <div>
    <View style={styles.container}>
      <Text style={styles.stations}>Метеостанции</Text>
      {days}
    </View>
  </div>)
};

export default DteTableHeader