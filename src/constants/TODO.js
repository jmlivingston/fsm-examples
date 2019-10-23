const TODO_EVENTS = Object.freeze({
  BLUR: 'BLUR',
  CANCEL: 'CANCEL',
  CHANGE: 'CHANGE',
  COMMIT: 'COMMIT',
  DELETE: 'DELETE',
  EDIT: 'EDIT',
  SET_ACTIVE: 'SET_ACTIVE',
  SET_COMPLETED: 'SET_COMPLETED',
  TOGGLE_COMPLETE: 'TOGGLE_COMPLETE'
})

const TODO_STATES = Object.freeze({
  COMPLETED: 'completed',
  DELETED: 'deleted',
  EDITING: 'editing',
  HISTORY: 'hist',
  PENDING: 'pending',
  READING: 'reading',
  READING_COMPLETED: 'reading.completed',
  READING_HISTORY: 'reading.hist',
  UNKNOWN: 'unknown'
})

export { TODO_EVENTS, TODO_STATES }
