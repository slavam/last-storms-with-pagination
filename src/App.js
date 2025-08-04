import React from 'react'
import {
  Routes,
  Route,
  Navigate, useNavigate, useLocation
} from 'react-router-dom'
import { Navbar1 } from './app/Navbar'
import { WmoStationsList } from './features/stations/stationsList'
import { StationsListSoap } from './features/stations/stationsListSoap'
import { HydropostsList } from './features/hydroposts/hydropostsList'
import { MeasurementsList } from './features/measurements/measurementsList'
import { AvgTemperatures } from './features/temperatures/avgTemperatures'
import { AvgMonthlyTemperatures } from './features/avgMonthTemperatures/avgMonthTemps'
import { AvgMonthTemperature15Hours } from './features/avgMonthTemp15/avgMonthTemp15Hours'
import { RadiationSoap } from './features/radiation/radiationSoap'
import { FireDanger } from './features/fireDanger/fireDanger'
// import { ObservationPage } from './features/synoptics/observationPage'
import { StormsList } from './features/storms/stormsList'
// import { WindsList } from './features/otherData/windsList'
// import { TempsList } from './features/otherData/tempsList'
// import { PrecipitationList } from './features/otherData/precipitationList'
import { Login } from './login/Login';
import { Profile } from './login/profile'
import { history } from './components/history'
// import { PrivateRoute } from './components/PrivateRoute'
// import './style.css';
import './App.css'
import Layout from './app/Layout'
import { SynopticData } from './features/synopticData/synopticData'
import { BulletinsList } from './features/bulletins/bulletinsList'
import { NewStormBulletin } from './features/bulletins/stormForm'
import { SelectObservations } from './features/observations/selectObservations'
import { SelectSoapObservations } from './features/observations/selectSoapObservations'
import { DtePdf } from './features/avgMonthTemperatures/dtePdf'
import { InputHydroTelegram } from './features/hydro/inputTelegram'
import {Precipitation} from './features/otherData/precipitation'

function App() {
  history.navigate = useNavigate();
  history.location = useLocation();
  
  return (
    <div >
      <Navbar1 />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route exact path="/storms" element={<StormsList />} />
          <Route path='/inputHydroTelegram' element={<InputHydroTelegram />} />
          {/* <Route exact path="/synopticObservations" element={<SynopticsList />} /> */}
          {/* <Route exact path="/synopticObservations/:observationId" element={<ObservationPage />} /> */}
          {/* <Route exact path='/otherDataWinds' element={<WindsList />} /> */}
          {/* <Route exact path='/otherDataTemps' element={<TempsList />} /> */}
          <Route exact path='/radiation' element={<RadiationSoap />} />
          {/* <Route exact path='/otherDataPrecipitation' element={<PrecipitationList />} /> */}
          <Route exact path='/precipitation' element={<Precipitation />} />
          <Route path="/login" element={<Login />} />
          <Route path='/profile' element={<Profile />} />
          <Route path="/logout" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
          {/* <Route path="/" element={
            <PrivateRoute>
              <StationsList />
            </PrivateRoute>
            } /> */}
          </Route>
          <Route path="/stations" element={<WmoStationsList />} />
          <Route path="/fireDanger" element={<FireDanger />} />
          <Route path='/stationsSoap' element={<StationsListSoap />} />
          <Route path="/hydroposts" element={<HydropostsList />} />
          <Route path="/measurements" element={<MeasurementsList />} />
          <Route path="/observations" element={<SelectObservations />} />
          <Route path="/observationsSoap" element={<SelectSoapObservations />} />
          <Route path="/monthlyAvgTemp" element={<AvgMonthlyTemperatures />} />
          <Route path='/monthlyAvgTemp15Hours' element={<AvgMonthTemperature15Hours />} />
          <Route exact path="/avgDailyTemp" element={<AvgTemperatures />} />
          <Route exact path="/synopticData" element={<SynopticData />} />
          <Route exact path="/stormBulletins" element={<BulletinsList />} />
          <Route exact path='/createStormBulletin' element={<NewStormBulletin />} />
          <Route exact path='/createDtePdf' element={<DtePdf />} />
      </Routes>
    </div>
  )
}

export default App
