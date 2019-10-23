const TOGGLE_EVENTS = Object.freeze({
  TOGGLE: 'TOGGLE'
})

const TOGGLE_STATES = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive'
})

const TOGGLE_MACHINE = Object.freeze({
  id: 'toggle',
  initial: TOGGLE_STATES.INACTIVE,
  states: {
    [TOGGLE_STATES.INACTIVE]: { on: { [TOGGLE_EVENTS.TOGGLE]: TOGGLE_STATES.ACTIVE } },
    [TOGGLE_STATES.ACTIVE]: { on: { [TOGGLE_EVENTS.TOGGLE]: TOGGLE_STATES.INACTIVE } }
  }
})

export { TOGGLE_MACHINE, TOGGLE_EVENTS, TOGGLE_STATES }
