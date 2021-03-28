import React from 'react'
import { Overrides, Text, Variants } from '@jsxui/react'
import { getData } from '../../utils'

function Column({ header, cell, cellVariants = null, width = null }) {
  return null
}

function Table({ children, data, spacing }) {
  const columns = React.Children.toArray(children).map((child) => child.props)
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: columns
          .map((column) => column.width || 'min-content')
          .join(' '),
        gridGap: spacing,
        padding: spacing,
      }}
    >
      {columns.map((column, columnIndex) => (
        <Text key={columnIndex} weight={600}>
          {column.header}
        </Text>
      ))}
      {data.map((row, rowIndex) =>
        columns.map((column, columnIndex) => (
          <Variants
            key={`${rowIndex}-${columnIndex}`}
            value={{
              firstCell: columnIndex === 0,
              lastCell: columnIndex === columns.length - 1,
              ...(typeof column.cellVariants === 'function'
                ? column.cellVariants(row)
                : column.cellVariants),
            }}
          >
            <Text>
              {typeof column.cell === 'string'
                ? row[column.cell]
                : column.cell(row)}
            </Text>
          </Variants>
        ))
      )}
    </div>
  )
}

const data = getData(50)

export default function TableExample() {
  return (
    <Overrides
      value={[
        <Text
          variants={{
            pastDue: { color: 'red' },
          }}
        />,
      ]}
    >
      <Table data={data} spacing="32px">
        <Column
          header="Name"
          cell={(data) => `${data.firstName} ${data.lastName}`}
          cellVariants={(data) => ({ pastDue: data.pastDue })}
          width="max-content"
        />
        <Column header="Age" cell="age" />
        <Column header="Username" cell="username" />
        <Column header="Occupation" cell="occupation" width="1fr" />
      </Table>
    </Overrides>
  )
}
