import uuid from 'uuid/v4'
import { assign, spawn } from 'xstate'
import { todoMachine } from './Todo.machine'

const createTodo = title => ({
  id: uuid(),
  title: title,
  completed: false
})

// const todoMachine = Machine(TODO_MACHINE)

const TODOS_EVENTS = Object.freeze({
  TODOS: 'todos'
})

const TODOS_STATES = Object.freeze({
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

const TODOS_MACHINE = Object.freeze({
  id: TODOS_EVENTS.TODOS,
  context: {
    todo: '', // new todo
    todos: []
  },
  initial: 'initializing',
  states: {
    initializing: {
      entry: assign({
        todos: (ctx, e) =>
          ctx.todos.map(todo => ({
            ...todo,
            ref: spawn(todoMachine.withContext(todo))
          }))
      }),
      on: {
        '': 'all'
      }
    },
    all: {},
    active: {},
    completed: {}
  },
  on: {
    [TODOS_STATES.NEWTODO_CHANGE]: {
      actions: assign({
        todo: (ctx, e) => e.value
      })
    },
    [TODOS_STATES.NEWTODO_COMMIT]: {
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
    [TODOS_STATES.TODO_COMMIT]: {
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
    [TODOS_STATES.TODO_DELETE]: {
      actions: [
        assign({
          todos: (ctx, e) => ctx.todos.filter(todo => todo.id !== e.id)
        }),
        'persist'
      ]
    },
    [TODOS_STATES.SHOW_ALL]: '.all',
    [TODOS_STATES.SHOW_ACTIVE]: '.active',
    [TODOS_STATES.SHOW_COMPLETED]: '.completed',
    [TODOS_STATES.MARK_COMPLETED]: {
      actions: ctx => {
        ctx.todos.forEach(todo => todo.ref.send('SET_COMPLETED'))
      }
    },
    [TODOS_STATES.MARK_ACTIVE]: {
      actions: ctx => {
        ctx.todos.forEach(todo => todo.ref.send('SET_ACTIVE'))
      }
    },
    CLEAR_COMPLETED: {
      actions: assign({
        todos: ctx => ctx.todos.filter(todo => !todo.completed)
      })
    }
  }
})

export { TODOS_MACHINE, TODOS_STATES }
