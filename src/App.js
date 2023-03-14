import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { Navbar } from './app/Navbar'
import { StationsList } from './features/stations/stationsList'
import { StormsList } from './features/storms/stormsList'
// import { Counter } from './features/counter/Counter';
// import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          {/* <Route
            exact
            path="/stations"
            render={() => (
              <React.Fragment>
                <StationsList />
              </React.Fragment>
            )}
          /> */}
          {/* <Route exact path="/posts/:postId" component={SinglePostPage} /> */}
          {/* <Route exact path="/editPost/:postId" component={EditPostForm} /> */}
          {/* <Route exact path="/users" component={UsersList} /> */}
          {/* <Route exact path="/users/:userId" component={UserPage} /> */}
          <Route exact path="/storms" element={<StormsList />} />
          <Route exact path="/stations" element={<StationsList />} />
          {/* <Route path="/" element={<StationsList />} /> */}
          {/* <Route path="/" element={<Navigate to="/" />} /> */}
          {/* <Navigate to="/" /> */}
        </Routes>
      </div>
    </Router>
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
