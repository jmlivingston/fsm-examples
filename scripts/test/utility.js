// Not crazy about keeping tests in machine, so this combines them.

function combineMachineStates({ machine, testMachine }) {
  return {
    ...machine,
    states: Object.keys(machine.states).reduce(
      (acc, key) => ({
        ...acc,
        [key]: {
          ...machine.states[key],
          meta: {
            ...machine.states[key].meta,
            test: testMachine.states[key].meta.test
          }
        }
      }),
      {}
    )
  }
}

export { combineMachineStates }
