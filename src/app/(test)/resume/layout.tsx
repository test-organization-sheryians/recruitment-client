import React from 'react'
import { TestLayout } from '../TestLayout'

const layout = ({ children }: { children: React.ReactNode }) => {
  return <TestLayout> {children} </TestLayout>
}

export default layout
