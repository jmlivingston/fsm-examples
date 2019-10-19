const toggleService = interpret(toggleMachine)
  .onTransition(state => console.log(state.value))
  .start()

export default toggleService
