import React, { Component } from 'react'

import Picker from './components/Picker'
import packageJson from '../package.json'

export default class App extends Component {
  render() {
    const { context } = this.props
    const { selectedSubreddit, onChange } = context

    return (
      <Picker
        options={['reactjs', 'frontend']}
        value={selectedSubreddit}
        onChange={onChange}
      />
    )
  }
}

window.LoadedMF[packageJson.name] = App
