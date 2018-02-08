import { remove, lensIndex, compose, map, curry, memoize } from 'ramda'

const LIB_NAME = 'DEMUT'
const SHOULD_BE_HANDLED = `THIS_ACTION_SHOULD_BE_HANDLED_BY_${LIB_NAME}`

export const metaReducer = reducer => (state, action) => {
  const actionData = action[SHOULD_BE_HANDLED] ? action :
                     action.payload && action.payload[SHOULD_BE_HANDLED] ? action.payload :
                     null

  if (actionData) return demutReducer(state, actionData)

  return reducer(state, action)
}

function demutReducer(state, action) {
  const { path, mutation, args, handler } = action

  return lensMutations[mutation](path, ...args)(state)
}

export const enhancer = createStore => (rootReducer, initialState) => 
  createStore(metaReducer(rootReducer), initialState)


// default mutations
export const push = curry((x, arr) => (arr || []).concat(x))

const lens = x => typeof x === 'number' ? lensIndex(x) :
                   typeof x === 'string' ? lensProp(x) :
                   new Error('All arguments to lens must be either integers or strings')

const lensPath = p => compose(...map(lens, p))

export const lens_ = memoize(p => (Array.isArray(p) ? lensPath : lens)(p))

export const set_ = curry((p, x, o) => set(lens_(p), x, o))

export const over_ = curry((p, f, o) => over(lens_(p), f, o))

export const view_ = curry((p, o) => view(lens_(p), o))

const lensMutations = { 
  set_, 
  over_,
  remove_: (path, start, count) => over_(path, remove(start, count)),
  push_: (path, x) => over_(path, push(x)),
  filterVal_: (path, x) => over_(path, s => s.filter(y => y !== x)),
  toggle_: (path) => over_(path, s => !s),
}

export const createMutation = name => (path, ...args) => ({
  [SHOULD_BE_HANDLED]: true,
  path,
  mutation: name,
  args
})

export const set_a = createMutation('set_')

export const over_a = createMutation('over_')

export const remove_a = createMutation('remove_')

export const push_a = createMutation('push_')

export const filterVal_a = createMutation('filterVal_')

export const toggle_a = createMutation('toggle_')

