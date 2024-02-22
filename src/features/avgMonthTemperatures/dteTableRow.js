import React, {Fragment} from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';
import {stations} from '../../synopticDictionaries'

const borderColor = '#90e5fc'
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        alignItems: 'center',
        fontSize: 9,
    },
    station: {
        width: '74px',
        textAlign: 'left',
        paddingLeft: 8,
    },
    val: {
        width: '22px',
        textAlign: 'right',
        paddingRight: 2,
    },
  });

const DteTableRow = ({items}) => {
  const rows = items.map( row => {
    let station = stations.find(s => +s.value === +row[0])
    const vals = [<Text key='0' style={styles.station}>{station.label}</Text>]
    for(let i=1; i<row.length; i++){
      vals.push(<Text key={i} style={{backgroundColor:(i%2==0?'#ffffff':'#bfbfbf'),...styles.val}} >{row[i]}</Text>)
    }
    return(
      <View style={styles.row} key={0}>
        {vals}
      </View>
    )
  })
  return (<Fragment>{rows}</Fragment> )
};
  
export default DteTableRow