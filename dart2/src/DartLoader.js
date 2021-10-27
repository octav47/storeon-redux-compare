import React, { Component } from 'react'

export class DartLoader extends Component {
  constructor(props) {
    super(props)

    this.state = {
      C: null,
    }

    this.interval = null
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.loadComponent()
    }, 50)
  }

  loadComponent = () => {
    if (window.__dart2js__) {
      const { component } = this.props

      if (window.__dart2js__[component]) {
        clearInterval(this.interval)

        this.setState({
          C: window.__dart2js__[component]().reactClass,
        })
      }
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  render() {
    const { C } = this.state
    const { component, ...rest } = this.props

    if (!C) {
      return null
    }

    return <C {...rest} />
  }
}
