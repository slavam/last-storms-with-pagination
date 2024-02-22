import React from 'react';
import {View, StyleSheet } from '@react-pdf/renderer';
import DteTableHeader from './dteTableHeader'
import DteTableRow from './dteTableRow'

const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#bff0fd',
    },
});

const DteItemsTable = ({m,nDays}) => (
  <View style={styles.tableContainer}>
    <DteTableHeader nDays={nDays}/>
    <DteTableRow items={m}/>
  </View>
);
export default DteItemsTable
