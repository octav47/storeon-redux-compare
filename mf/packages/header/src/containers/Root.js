import React, { Component } from 'react'
import { StoreContext } from 'storeon/react'
import packageJson from '../../package.json'
import store from '../store'

export default class App extends Component {
  render() {
    return <div>mf header</div>
  }
}

window.LoadedMF[packageJson.name] = App
