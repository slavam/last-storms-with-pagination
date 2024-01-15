import React from 'react'
import {
  Routes,
  Route,
  Navigate, useNavigate, useLocation
} from 'react-router-dom'
import { Navbar1 } from './app/Navbar'
import { StationsList } from './features/stations/stationsList'
import { MeasurementsList } from './features/measurements/measurementsList'
import { AvgTemperatures } from './features/temperatures/avgTemperatures'
import { SynopticsList } from './features/synoptics/synopticsList'
import { ObservationPage } from './features/synoptics/observationPage'
import { StormsList } from './features/storms/stormsList'
import { WindsList } from './features/otherData/windsList'
import { TempsList } from './features/otherData/tempsList'
import { PrecipitationList } from './features/otherData/precipitationList'
import { Login } from './login/Login';
import { Profile } from './login/profile'
import { history } from './components/history'
import { PrivateRoute } from './components/PrivateRoute'
// import './style.css';
import './App.css'
import Layout from './app/Layout'
import { SynopticData } from './features/synopticData/synopticData'
import { BulletinsList } from './features/bulletins/bulletinsList'
import { NewStormBulletin } from './features/bulletins/stormForm'
import { SelectObservations } from './features/observations/selectObservations'

function App() {
  history.navigate = useNavigate();
  history.location = useLocation();
  return (
    <div >
      <Navbar1 />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route exact path="/storms" element={<StormsList />} />
          <Route exact path="/synopticObservations" element={<SynopticsList />} />
          <Route exact path="/synopticObservations/:observationId" element={<ObservationPage />} />
          <Route exact path='/otherDataWinds' element={<WindsList />} />
          <Route exact path='/otherDataTemps' element={<TempsList />} />
          <Route exact path='/otherDataPrecipitation' element={<PrecipitationList />} />
          <Route path="/login" element={<Login />} />
          <Route path='/profile' element={<Profile />} />
          <Route path="/logout" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/" element={
            <PrivateRoute>
              <StationsList />
            </PrivateRoute>
            } />
          </Route>
          <Route path="/measurements" element={<MeasurementsList />} />
          <Route path="/observations" element={<SelectObservations />} />
          <Route exact path="/avgDailyTemp" element={<AvgTemperatures />} />
          <Route exact path="/synopticData" element={<SynopticData />} />
          <Route exact path="/stormBulletins" element={<BulletinsList />} />
          <Route exact path='/createStormBulletin' element={<NewStormBulletin />} />
      </Routes>
    </div>
  )
}

export default App
