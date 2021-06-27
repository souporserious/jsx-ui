import React from 'react'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import Highlight, { defaultProps } from 'prism-react-renderer'
import { MDXProvider } from '@mdx-js/react'
import { preToCodeBlock } from 'mdx-utils'
import css from './css'

import { nightOwl } from '../theme/night-owl'

const RE = /{([\d,-]+)}/

export function calculateLinesToHighlight(meta) {
  if (RE.test(meta)) {
    const lineNumbers = RE.exec(meta)[1]
      .split(',')
      .map((v) => v.split('-').map((y) => parseInt(y, 10)))
    return (index) => {
      const lineNumber = index + 1
      const inRange = lineNumbers.some(([start, end]) =>
        end ? lineNumber >= start && lineNumber <= end : lineNumber === start
      )
      return inRange
    }
  } else {
    return () => false
  }
}

function LiveCode({ codeString }) {
  return (
    <LiveProvider code={codeString} theme={nightOwl} noInline={true}>
      <div
        className={css({
          gridColumn: '1/-1',
          display: 'grid',
          gridTemplateColumns: '1fr 32em 1fr 1fr',
          position: 'relative',
          backgroundColor: nightOwl.plain.backgroundColor,
        })}
      >
        <LiveEditor
          padding={0}
          className={css({
            gridColumn: '2',
            fontFamily: `Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace`,
            fontSize: '0.6em',
            ':focus-within': {
              backgroundColor: 'hsl(206, 90%, 14%)',
            },
            '> textarea, > pre': {
              gridColumn: '2/3',
              outline: 0,
              ':hover': {
                backgroundColor: 'hsl(206, 90%, 14%)',
              },
            },
          })}
          style={{
            fontFamily: undefined,
            padding: undefined,
            backgroundColor: undefined,
          }}
        />
        <LivePreview
          className={css({
            alignSelf: 'start',
            gridColumn: '3',
            padding: '1em',
            backgroundColor: 'white',
            position: 'sticky',
            top: 0,
          })}
        />
        <LiveError
          className={css({
            gridColumn: '1/-1',
            gridRow: '2',
            padding: '1em',
            backgroundColor: '#d83d3d',
            color: 'white',
            position: 'sticky',
            bottom: 0,
          })}
        />
        {/* <div
        className={css({
          gridColumn: '1',
          gridRow: '1',
          padding: '0.5em',
          backgroundColor: 'white',
          color: 'black',
          //   position: 'absolute',
          //   top: '1em',
          //   left: '1em',
        })}
      >
        Live
      </div> */}
      </div>
    </LiveProvider>
  )
}

function SyntaxHighligher({ codeString, language, metastring }) {
  const shouldHighlightLine = calculateLinesToHighlight(metastring)
  return (
    <Highlight
      {...defaultProps}
      code={codeString}
      language={language}
      theme={nightOwl}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: '1fr minmax(auto, 32em) 1fr',
            gridColumn: '1/-1',
            maxWidth: '100%',
            padding: '1em 0',
            backgroundColor: nightOwl.plain.backgroundColor,
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
          })}
        >
          <pre
            className={
              css({
                gridColumn: '2/3',
                fontFamily: `Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace`,
                fontSize: '0.6em',
              }) +
              ' ' +
              className
            }
            style={style}
          >
            {tokens.map((line, index) => (
              <div
                {...getLineProps({ line, key: index })}
                className={css({
                  display: 'flex',
                  backgroundColor: shouldHighlightLine(index)
                    ? 'hsl(209, 58%, 14%)'
                    : undefined,
                })}
              >
                <span
                  className={css({
                    display: 'inline-block',
                    width: '2ch',
                    padding: '0 0.5ch',
                    marginRight: '1ch',
                    textAlign: 'right',
                    borderLeft: '0.25em solid',
                    borderLeftColor: shouldHighlightLine(index)
                      ? 'rgb(173, 219, 103)'
                      : 'transparent',
                    backgroundColor: shouldHighlightLine(index)
                      ? 'hsl(209, 58%, 14%)'
                      : nightOwl.plain.backgroundColor,
                    color: 'rgba(255,255,255,0.46)',
                    userSelect: 'none',
                    position: 'sticky',
                    left: 0,
                  })}
                >
                  {index + 1}
                </span>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        </div>
      )}
    </Highlight>
  )
}

const createHeading = (Tag) => (props) => (
  <Tag id={props.id}>
    <a
      href={`#${props.id}`}
      className={css({ textDecoration: 'none !important' })}
    >
      {props.children}
    </a>
  </Tag>
)

const components = {
  h2: createHeading(`h2`),
  h3: createHeading(`h3`),
  h4: createHeading(`h4`),
  pre: (props) => {
    const codeProps = preToCodeBlock(props)
    if (codeProps) {
      if (props.children.props.live) {
        return <LiveCode {...codeProps} />
      } else {
        return <SyntaxHighligher {...codeProps} />
      }
    } else {
      return <pre {...props} />
    }
  },
}

export function Provider({ children }) {
  return <MDXProvider components={components}>{children}</MDXProvider>
}
