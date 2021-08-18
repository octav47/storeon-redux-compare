import React, { Suspense, lazy } from 'react'
import { StoreContext } from 'storeon/react'
import store from '../store'
import App from './App'

export default () => (
  <StoreContext.Provider value={store}>
    <App />
  </StoreContext.Provider>
)
