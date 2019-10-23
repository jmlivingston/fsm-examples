import uuid from 'uuid/v4'
import { assign, spawn } from 'xstate'
import { todoMachine, TODO_EVENTS } from './Todo.machine'

const createTodo = title => ({
  id: uuid(),
  title: title,
  completed: false
})

const TODOS_EVENTS = Object.freeze({
  CLEAR_COMPLETED: 'CLEAR_COMPLETED',
  MARK_ACTIVE: 'MARK.active',
  MARK_COMPLETED: 'MARK.completed',
  NEWTODO_CHANGE: 'NEWTODO.CHANGE',
  NEWTODO_COMMIT: 'NEWTODO.COMMIT',
  SHOW_ACTIVE: 'SHOW.active',
  SHOW_ALL: 'SHOW.all',
  SHOW_COMPLETED: 'SHOW.completed',
  TODO_COMMIT: 'TODO.COMMIT',
  TODO_DELETE: 'TODO.DELETE'
})

const TODOS_STATES = Object.freeze({
  ACTIVE_VISIBLE: 'active',
  ALL_VISIBLE: 'all',
  COMPLETED_VISIBLE: 'completed',
  INITIALIZING: 'initializing'
})

const TODOS_MACHINE = Object.freeze({
  id: 'todos',
  context: {
    todo: '',
    todos: []
  },
  initial: TODOS_STATES.INITIALIZING,
  states: {
    [TODOS_STATES.INITIALIZING]: {
      entry: assign({
        todos: (ctx, e) =>
          ctx.todos.map(todo => ({
            ...todo,
            ref: spawn(todoMachine.withContext(todo))
          }))
      }),
      on: {
        '': TODOS_STATES.ALL_VISIBLE
      }
    },
    [TODOS_STATES.ALL_VISIBLE]: {},
    [TODOS_STATES.ACTIVE_VISIBLE]: {},
    [TODOS_STATES.COMPLETED_VISIBLE]: {}
  },
  on: {
    [TODOS_EVENTS.NEWTODO_CHANGE]: {
      actions: assign({
        todo: (ctx, e) => e.value
      })
    },
    [TODOS_EVENTS.NEWTODO_COMMIT]: {
      actions: [
        assign({
          todo: '',
          todos: (ctx, e) => {
            const newTodo = createTodo(e.value.trim())
            return ctx.todos.concat({
              ...newTodo,
              ref: spawn(todoMachine.withContext(newTodo))
            })
          }
        }),
        'persist'
      ],
      cond: (ctx, e) => e.value.trim().length
    },
    [TODOS_EVENTS.TODO_COMMIT]: {
      actions: [
        assign({
          todos: (ctx, e) =>
            ctx.todos.map(todo =>
              todo.id === e.todo.id ? { ...todo, ...e.todo, ref: todo.ref } : todo
            )
        }),
        'persist'
      ]
    },
    [TODOS_EVENTS.TODO_DELETE]: {
      actions: [
        assign({
          todos: (ctx, e) => ctx.todos.filter(todo => todo.id !== e.id)
        }),
        'persist'
      ]
    },
    [TODOS_EVENTS.SHOW_ALL]: `.${TODOS_STATES.ALL_VISIBLE}`,
    [TODOS_EVENTS.SHOW_ACTIVE]: `.${TODOS_STATES.ACTIVE_VISIBLE}`,
    [TODOS_EVENTS.SHOW_COMPLETED]: `.${TODOS_STATES.COMPLETED_VISIBLE}`,
    [TODOS_EVENTS.MARK_COMPLETED]: {
      actions: ctx => ctx.todos.forEach(todo => todo.ref.send(TODO_EVENTS.SET_COMPLETED))
    },
    [TODOS_EVENTS.MARK_ACTIVE]: {
      actions: ctx => ctx.todos.forEach(todo => todo.ref.send(TODO_EVENTS.SET_ACTIVE))
    },
    [TODOS_EVENTS.CLEAR_COMPLETED]: {
      actions: assign({
        todos: ctx => ctx.todos.filter(todo => !todo.completed)
      })
    }
  }
})

export { TODOS_EVENTS, TODOS_MACHINE, TODOS_STATES }
