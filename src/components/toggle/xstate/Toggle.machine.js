import { TOGGLE_EVENTS, TOGGLE_STATES } from '../../../constants/TOGGLE'

const TOGGLE_MACHINE = Object.freeze({
  id: 'toggle',
  initial: TOGGLE_STATES.INACTIVE,
  states: {
    [TOGGLE_STATES.INACTIVE]: { on: { [TOGGLE_EVENTS.TOGGLE]: TOGGLE_STATES.ACTIVE } },
    [TOGGLE_STATES.ACTIVE]: { on: { [TOGGLE_EVENTS.TOGGLE]: TOGGLE_STATES.INACTIVE } }
  }
})

export default TOGGLE_MACHINE
