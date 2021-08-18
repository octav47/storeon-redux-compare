import { createStoreon } from 'storeon'
import { storeonLogger } from 'storeon/devtools'
import {selectedSubreddit, posts} from './store.part'

export default createStoreon([selectedSubreddit, posts, storeonLogger])