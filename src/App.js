import React from 'react'
import {
  Routes,
  Route,
  Navigate, useNavigate, useLocation
} from 'react-router-dom'
import { Navbar } from './app/Navbar'
import { StationsList } from './features/stations/stationsList'
import { SynopticsList } from './features/synoptics/synopticsList'
import { ObservationPage } from './features/synoptics/observationPage'
import { StormsList } from './features/storms/stormsList'
import { WindsList } from './features/otherData/windsList'
import { Login } from './login/Login';
import { Profile } from './login/profile'
import { history } from './components/history'
import { PrivateRoute } from './components/PrivateRoute'
// import './style.css';
import './App.css'
import Layout from './app/Layout'

function App() {
  history.navigate = useNavigate();
  history.location = useLocation();
  return (
    <div >
      <Navbar />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route exact path="/storms" element={<StormsList />} />
          <Route exact path="/synopticObservations" element={<SynopticsList />} />
          <Route exact path="/synopticObservations/:observationId" element={<ObservationPage />} />
          <Route exact path='/otherDataWinds' element={<WindsList />} />
          <Route path="/login" element={<Login />} />
          <Route path='/profile' element={<Profile />} />
          <Route path="/logout" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/" element={
            <PrivateRoute>
              <StationsList />
              {/* <SynopticsList /> */}
              {/* <ObservationPage /> */}
            </PrivateRoute>
            } />
          </Route>
      </Routes>
    </div>
  )
}

export default App
