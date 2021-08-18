import React, { Component, Suspense } from 'react'
import ReactDOM from 'react-dom'
import fetch from 'isomorphic-fetch'
import { connectStoreon } from 'storeon/react'

const mfMap = {
  header: {
    url: 'http://localhost:8081',
  },
  refresh: {
    url: 'http://localhost:8082',
  },
}

class AsyncLoader extends Component {
  constructor(props) {
    super(props)

    if (!window.React) {
      window.React = React
      window.ReactDOM = ReactDOM
    }

    const { mfName } = this.props

    const MFApp = window.LoadedMF[mfName]

    if (MFApp) {
      this.state = {
        MFApp,
      }

      return
    }

    this.state = {}
  }

  componentDidMount() {
    this.loadManifest()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.context !== this.props.context) {
      this.createContext()
    }
  }

  componentDidCatch(error, errorInfo) {
    debugger
  }

  loadManifest = async () => {
    const { mfName } = this.props
    const manifest = await fetch(
      `${mfMap[mfName].url}/app-manifest-${mfName}.json`
    ).then(r => r.json())
    const bundle = manifest[mfName]
    const chunks = Object.keys(manifest)
      .map(assetName => {
        const asset = manifest[assetName]

        return assetName.startsWith('vendor') ? asset : null
      })
      .filter(e => e)

    if (chunks.length) {
      await Promise.all(
        chunks.reduce((prev, chunk) => {
          if (chunk.js) {
            prev.push(this.createScript(chunk.js))
          }

          if (chunk.css) {
            prev.push(this.createStyle(chunk.css))
          }

          return prev
        }, [])
      )
    }

    await this.createScript(bundle.js)
    await this.createStyle(bundle.css)

    const MFApp = window.LoadedMF[mfName]

    this.setState({ MFApp })

    this.createContext()
  }

  createScript = src => {
    return new Promise(resolve => {
      const { mfName } = this.props
      const script = document.createElement('script')

      script.onload = () => resolve()
      script.setAttribute('data-mf', mfName)
      script.setAttribute('src', `${mfMap[mfName].url}${src}`)

      document.body.appendChild(script)
    })
  }

  createStyle = src => {
    return new Promise(resolve => {
      const { mfName } = this.props
      const style = document.createElement('link')

      style.setAttribute('data-mf', mfName)
      style.setAttribute('rel', 'stylesheet')
      style.setAttribute('href', `${mfMap[mfName].url}${src}`)

      document.head.appendChild(style)

      resolve()
    })
  }

  createContext = () => {
    const { context: contextFromProps } = this.props
    const context = {
      ...contextFromProps,
    }

    this.setState({
      context,
    })
  }

  render() {
    const { MFApp, context } = this.state

    return (
      <Suspense fallback="Loading">
        {MFApp && context ? <MFApp context={context} /> : 'Loading'}
      </Suspense>
    )
  }
}

export default connectStoreon('selectedSubreddit', 'posts', AsyncLoader)
