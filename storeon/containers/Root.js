import React, { Suspense, lazy } from 'react'
import {StoreContext} from 'storeon/react'
import store from '../store'

const LazyApp = lazy(() => import('./App'))

export default () => (
    <StoreContext.Provider value={store}>
        <Suspense fallback="Loading...">
            <LazyApp />
        </Suspense>
    </StoreContext.Provider>
)
