/* eslint-disable import/first */
import React from 'react'
import Todos from './Todos'

export default {
  title: 'Components | Todo'
}

export const todo = () => (
  <div className="container-fluid">
    <Todos />
  </div>
)
