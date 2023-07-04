import React from 'react'
import {
  Routes,
  Route,
  Navigate, useNavigate, useLocation
} from 'react-router-dom'
import { Navbar } from './app/Navbar'
import { StationsList } from './features/stations/stationsList'
import { SynopticsList } from './features/synoptics/synopticsList'
import { StormsList } from './features/storms/stormsList'
import { Login } from './login/Login';
import { history } from './components/history'
import { PrivateRoute } from './components/PrivateRoute'
// import './App.css';

function App() {
  history.navigate = useNavigate();
  history.location = useLocation();
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route exact path="/storms" element={<StormsList />} />
        <Route exact path="/synopticObservations" element={<SynopticsList />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/" element={
          <PrivateRoute>
            <StationsList />
          </PrivateRoute>
          } />
      </Routes>
    </div>
  )
}

export default App



// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         {/* <Counter /> */}
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <span>
//           <span>Learn </span>
//           <a
//             className="App-link"
//             href="https://reactjs.org/"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             React
//           </a>
//           <span>, </span>
//           <a
//             className="App-link"
//             href="https://redux.js.org/"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Redux
//           </a>
//           <span>, </span>
//           <a
//             className="App-link"
//             href="https://redux-toolkit.js.org/"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Redux Toolkit
//           </a>
//           ,<span> and </span>
//           <a
//             className="App-link"
//             href="https://react-redux.js.org/"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             React Redux
//           </a>
//         </span>
//       </header>
//     </div>
//   );
// }

// export default App;
