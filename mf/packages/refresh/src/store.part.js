import fetch from 'isomorphic-fetch'

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'

export const selectedSubreddit = store => {
  store.on('@init', () => {
    return {
      selectedSubreddit: 'reactjs',
    }
  })

  store.on(SELECT_SUBREDDIT, (_, selectedSubreddit) => {
    return {
      selectedSubreddit,
    }
  })
}

export const posts = store => {
  store.on('@init', () => {
    return {
      posts: {
        isFetching: false,
        didInvalidate: false,
        items: [],
      },
    }
  })

  store.on(INVALIDATE_SUBREDDIT, s => {
    return {
      posts: {
        ...s.posts,
        didInvalidate: true,
      },
    }
  })

  store.on(REQUEST_POSTS, (s, subreddit) => {
    if (!s.posts.isFetching) {
      fetch(`https://www.reddit.com/r/${subreddit}.json`)
        .then(response => response.json())
        .then(json => store.dispatch(RECEIVE_POSTS, json))
    }

    return {
      posts: {
        ...s.posts,
        isFetching: true,
        didInvalidate: false,
      },
    }
  })

  store.on(RECEIVE_POSTS, (s, action) => {
    return {
      posts: {
        ...s.posts,
        isFetching: false,
        didInvalidate: false,
        items: action.data.children.map(child => child.data),
        lastUpdated: action.receivedAt,
      },
    }
  })
}
