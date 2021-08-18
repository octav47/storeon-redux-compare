import React, { Component } from 'react'

import Picker from './components/Picker'
import packageJson from '../package.json'

export default class App extends Component {
  render() {
    const { context } = this.props
    const { lastUpdated, isFetching, onRefresh } = context

    return (
      <p data-mf="refresh">
        {lastUpdated && (
          <span>
            Last updated at {new Date(lastUpdated).toLocaleTimeString()}.{' '}
          </span>
        )}
        {!isFetching && <button onClick={onRefresh}>Refresh</button>}
      </p>
    )
  }
}

window.LoadedMF[packageJson.name] = App
