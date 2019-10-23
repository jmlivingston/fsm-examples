import { createMachine, state, transition } from 'robot3'
import { TOGGLE_EVENTS, TOGGLE_STATES } from '../../../constants/TOGGLE'

const TOGGLE_MACHINE = createMachine({
  [TOGGLE_STATES.INACTIVE]: state(transition(TOGGLE_EVENTS.TOGGLE, TOGGLE_STATES.ACTIVE)),
  [TOGGLE_STATES.ACTIVE]: state(transition(TOGGLE_EVENTS.TOGGLE, TOGGLE_STATES.INACTIVE))
})

export default TOGGLE_MACHINE
