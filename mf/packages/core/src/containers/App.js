import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connectStoreon } from 'storeon/react'
import { SELECT_SUBREDDIT, REQUEST_POSTS } from '../store.part'
import Picker from '../components/Picker'
import Posts from '../components/Posts'
import AsyncLoader from './AsyncLoader'

class AsyncApp extends Component {
  componentDidMount() {
    const { selectedSubreddit, dispatch } = this.props

    dispatch(REQUEST_POSTS, selectedSubreddit)
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedSubreddit !== prevProps.selectedSubreddit) {
      const { selectedSubreddit, dispatch } = this.props

      dispatch(REQUEST_POSTS, selectedSubreddit)
    }
  }

  handleChange = nextSubreddit => {
    const { dispatch } = this.props

    dispatch(SELECT_SUBREDDIT, nextSubreddit)
    dispatch(REQUEST_POSTS, nextSubreddit)
  }

  handleRefreshClick = e => {
    e.preventDefault()

    const { selectedSubreddit, dispatch } = this.props

    dispatch(REQUEST_POSTS, selectedSubreddit)
  }

  render() {
    const {
      selectedSubreddit,
      posts: { isFetching, lastUpdated, items },
    } = this.props

    return (
      <div>
        <AsyncLoader
          mfName="header"
          context={{
            onChange: nextSubreddit => {
              const { dispatch } = this.props

              dispatch(SELECT_SUBREDDIT, nextSubreddit)
              dispatch(REQUEST_POSTS, nextSubreddit)
            },
            selectedSubreddit,
          }}
        />
        <AsyncLoader
          mfName="refresh"
          context={{
            lastUpdated,
            onRefresh: this.handleRefreshClick,
          }}
        />
        {/*<Picker*/}
        {/*  value={selectedSubreddit}*/}
        {/*  onChange={this.handleChange}*/}
        {/*  options={['reactjs', 'frontend']}*/}
        {/*/>*/}
        {/*<p>*/}
        {/*  {lastUpdated && (*/}
        {/*    <span>*/}
        {/*      Last updated at {new Date(lastUpdated).toLocaleTimeString()}.{' '}*/}
        {/*    </span>*/}
        {/*  )}*/}
        {/*  {!isFetching && (*/}
        {/*    <button onClick={this.handleRefreshClick}>Refresh</button>*/}
        {/*  )}*/}
        {/*</p>*/}
        {isFetching && items.length === 0 && <h2>Loading...</h2>}
        {!isFetching && items.length === 0 && <h2>Empty.</h2>}
        {items.length > 0 && (
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <Posts posts={items} />
          </div>
        )}
      </div>
    )
  }
}

AsyncApp.propTypes = {
  selectedSubreddit: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  fetchPostsIfNeeded: PropTypes.func.isRequired,
  selectSubreddit: PropTypes.func.isRequired,
}

export default connectStoreon('selectedSubreddit', 'posts', AsyncApp)
