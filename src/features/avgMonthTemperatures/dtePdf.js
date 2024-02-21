import React from 'react';
import { PDFViewer, Font, Page, Image, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import {useLocation} from 'react-router-dom'
import DteItemsTable from './dteItemsTable'
import logo from '../../components/images/logo2015_2.png'
// import Roboto from "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf"
// import RobotoBold from "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf"
Font.register({
  family: 'RobotoBold', 
  fonts: [{src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 'bold'}]
//     { src: RobotoBold, fontWeight: 600 },
//   ],
//   format: 'truetype',
});

Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf"
  // src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf"
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    fontFamily: "Roboto",
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 40,
    paddingRight: 40,
    // lineHeight: 1.5,
    flexDirection: "column"
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  logo: {
    // marginVertical: 15,
    width: 70,
    height: 70
  },
  mainHeader: {
    display: "flex",
    fontWeight: 700,
    // fontWeight: 'normal',
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center"
  }
});

// Create Document Component
const DteDoc = ({year,month,nDays,m}) => (
  <Document>
    <Page size="A4" orientation='landscape' style={styles.page}>
      <View style={styles.mainHeader}>
        <Image
          style={styles.logo}
          src = {logo}
        />
        <Text>Средняя за сутки (00:01-24:00) температура воздуха (°С) за {month} месяц {year} года на метеостанциях ДНР</Text>
      </View>
      <DteItemsTable m={m} nDays={nDays} />
    </Page>
  </Document>
);

export const DtePdf = ()=>{
  const location = useLocation();
  return (
    <div>
      <PDFViewer style={{width: "100%", height:"500px", className:"app"}} showToolbar={false}>
        <DteDoc year={location.state.year} month={location.state.month} nDays={location.state.nDays} m={location.state.m}/>
      </PDFViewer>
    </div>
  );
}