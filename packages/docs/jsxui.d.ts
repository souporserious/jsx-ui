export type StackProps = {
  alignment?: 'start' | 'center' | 'end'
  children: React.ReactNode
}

export type TextProps = {
  color: string
  children: React.ReactNode
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      Stack: StackProps
      Text: TextProps
    }
  }
}
