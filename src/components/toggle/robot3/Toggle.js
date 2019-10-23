import React from 'react'
import { useMachine } from 'react-robot'
import { TOGGLE_EVENTS, TOGGLE_STATES } from '../../../constants/TOGGLE'
import TOGGLE_MACHINE from './Toggle.machine'

function Toggle() {
  const [current, send] = useMachine(TOGGLE_MACHINE)

  return (
    <button
      onClick={() => send(TOGGLE_EVENTS.TOGGLE)}
      className={`btn btn-${current.name === TOGGLE_STATES.INACTIVE ? 'info' : 'primary'}`}>
      {current.name}
    </button>
  )
}

export default Toggle
