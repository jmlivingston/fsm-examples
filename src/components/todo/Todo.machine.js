import { actions, Machine, sendParent } from 'xstate'
import { TODOS_STATES } from './Todos.machine'
const { assign } = actions

const TODO_EVENTS = Object.freeze({
  TODO: 'todo'
})

const TODO_STATES = Object.freeze({
  BLUR: 'BLUR',
  CANCEL: 'CANCEL',
  CHANGE: 'CHANGE',
  COMMIT: 'COMMIT',
  DELETE: 'DELETE',
  DELETED: 'deleted',
  EDIT: 'EDIT',
  EDITING: 'editing',
  READING: 'reading',
  TOGGLE_COMPLETE: 'TOGGLE_COMPLETE',
  UNKNOWN: 'unknown'
})

const todoMachine = Machine({
  id: TODO_EVENTS.TODO,
  initial: TODO_STATES.READING,
  context: {
    id: undefined,
    title: '',
    prevTitle: ''
  },
  on: {
    [TODO_STATES.TOGGLE_COMPLETE]: {
      target: '.reading.completed',
      actions: [
        assign({ completed: true }),
        sendParent(ctx => ({ type: TODOS_STATES.TODO_COMMIT, todo: ctx }))
      ]
    },
    [TODO_STATES.DELETE]: [TODO_STATES.DELETED]
  },
  states: {
    [TODO_STATES.DELETED]: {
      onEntry: sendParent(ctx => ({ type: TODOS_STATES.TODO_DELETE, id: ctx.id }))
    },
    [TODO_STATES.EDITING]: {
      onEntry: assign({ prevTitle: ctx => ctx.title }),
      on: {
        CHANGE: {
          actions: assign({
            title: (ctx, e) => e.value
          })
        },
        COMMIT: [
          {
            target: 'reading.hist',
            actions: sendParent(ctx => ({ type: TODOS_STATES.TODO_COMMIT, todo: ctx })),
            cond: ctx => ctx.title.trim().length > 0
          },
          { target: TODO_STATES.DELETED }
        ],
        BLUR: {
          target: TODO_STATES.READING,
          actions: sendParent(ctx => ({ type: TODOS_STATES.TODO_COMMIT, todo: ctx }))
        },
        CANCEL: {
          target: TODO_STATES.READING,
          actions: assign({ title: ctx => ctx.prevTitle })
        }
      }
    },
    [TODO_STATES.READING]: {
      initial: TODO_STATES.UNKNOWN,
      states: {
        [TODO_STATES.UNKNOWN]: {
          on: {
            '': [{ target: 'completed', cond: ctx => ctx.completed }, { target: 'pending' }]
          }
        },
        pending: {
          on: {
            SET_COMPLETED: {
              target: 'completed',
              actions: [
                assign({ completed: true }),
                sendParent(ctx => ({ type: TODOS_STATES.TODO_COMMIT, todo: ctx }))
              ]
            }
          }
        },
        completed: {
          on: {
            TOGGLE_COMPLETE: {
              target: 'pending',
              actions: [
                assign({ completed: false }),
                sendParent(ctx => ({ type: TODOS_STATES.TODO_COMMIT, todo: ctx }))
              ]
            },
            SET_ACTIVE: {
              target: 'pending',
              actions: [
                assign({ completed: false }),
                sendParent(ctx => ({ type: TODOS_STATES.TODO_COMMIT, todo: ctx }))
              ]
            }
          }
        },
        hist: {
          type: 'history'
        }
      },
      on: {
        EDIT: {
          target: 'editing',
          actions: 'focusInput'
        }
      }
    }
  }
})

export { TODO_EVENTS, todoMachine, TODO_STATES }
