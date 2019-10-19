import { Machine } from 'xstate'

const TOGGLE_EVENTS = Object.freeze({
  TOGGLE: 'TOGGLE'
})

const TOGGLE_STATES = Object.freeze({
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
})

const toggleMachine = Machine({
  id: 'toggle',
  initial: TOGGLE_STATES.INACTIVE,
  states: {
    [TOGGLE_STATES.INACTIVE]: { on: { [TOGGLE_EVENTS.TOGGLE]: TOGGLE_STATES.ACTIVE } },
    [TOGGLE_STATES.ACTIVE]: { on: { [TOGGLE_EVENTS.TOGGLE]: TOGGLE_STATES.INACTIVE } }
  }
})

export { toggleMachine, TOGGLE_EVENTS, TOGGLE_STATES }
