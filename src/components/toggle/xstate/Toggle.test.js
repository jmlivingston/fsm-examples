import { fireEvent, render } from '@testing-library/react'
import { createModel } from '@xstate/test'
import React from 'react'
import { Machine } from 'xstate'
import { TOGGLE_STATES } from '../../../constants/TOGGLE'
import { combineMachineStates } from '../../../scripts/test/utility'
import Toggle from './Toggle'
import TOGGLE_MACHINE from './Toggle.machine'

const combinedMachine = combineMachineStates({
  machine: TOGGLE_MACHINE,
  testMachine: {
    states: {
      [TOGGLE_STATES.INACTIVE]: {
        meta: {
          test: ({ getByText }) => getByText(TOGGLE_STATES.INACTIVE)
        }
      },
      [TOGGLE_STATES.ACTIVE]: {
        meta: {
          test: ({ getByText }) => getByText(TOGGLE_STATES.ACTIVE)
        }
      }
    }
  }
})

const toggleModel = createModel(Machine(combinedMachine)).withEvents({
  [combinedMachine.id]: {
    exec: ({ container }) => fireEvent.click(container.querySelector('button'))
  }
})

describe(combinedMachine.id, () => {
  const testPlans = toggleModel.getShortestPathPlans()
  testPlans.forEach(plan => {
    describe(plan.description, () => {
      plan.paths.forEach(path => {
        it(path.description, () => path.test(render(<Toggle />)))
      })
    })
  })

  it('should have full coverage', () => {
    return toggleModel.testCoverage()
  })
})
