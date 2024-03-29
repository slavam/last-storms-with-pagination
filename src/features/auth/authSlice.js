import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { history } from '../../components/history';
import { fetchWrapper } from '../../components/fetch-wrapper'

const name = 'auth';
const initialState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports
export const authActions = { ...slice.actions, ...extraActions };
export const authReducer = slice.reducer;

// implementation
function createInitialState() {
    return {
        // initialize state from local storage to enable user to stay logged in
        user: null, //JSON.parse(localStorage.getItem('user')),
        error: null
    }
}

function createReducers() {
    return {
        logout
    };

    function logout(state) {
        state.user = null;
        localStorage.removeItem('user');
        history.navigate('/login');
    }
}

function createExtraActions() {
  // const baseUrl = 'http://10.54.0.23:3000'
  const baseUrl = 'http://localhost:3000'
  // const baseUrl = 'http://10.54.1.6:8080'
  // const baseUrl = 'http://localhost:8080'
  return {
      login: login()
  };    

  function login() {
    return createAsyncThunk(
      `${name}/login`,
      async ({ username, password }) => await fetchWrapper.post(`${baseUrl}/login.json?login=${username}&password=${password}`, { username, password })
    );
  }

  //   function login() {
  //       return createAsyncThunk(
  //           `${name}/login`,
  //           async ({ username, password }) => {await fetch(
  //              `${baseUrl}/login.json?login=${username}&password=${password}`, {
  //              method: 'POST',
  //              headers: { "Access-Control-Allow-Origin": "*", 'Content-Type': 'application/json' },
  //              })
  //   })
  // }
}

function createExtraReducers() {
    return {
        ...login()
    };

    function login() {
        var { pending, fulfilled, rejected } = extraActions.login;
        return {
            [pending]: (state) => {
                state.error = null;
            },
            [fulfilled]: (state, action) => {
                const user = action.payload.user ? action.payload.user : null;
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                state.user = user;

                // get return url from location state or default to home page
                const { from } = history.location.state || { from: { pathname: '/logout' } };
                history.navigate(from);
            },
            [rejected]: (state, action) => {
                state.error = action.error;
            }
        };
    }
}