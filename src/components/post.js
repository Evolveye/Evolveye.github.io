import React from "react"
import { Link } from "gatsby"
import Highlight, { defaultProps } from "prism-react-renderer"
import theme from "prism-react-renderer/themes/vsDark"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { MDXProvider } from "@mdx-js/react"

import styles from "./posts.module.css"

const shortcodes = {
  Note: ({children, ...props}) => <note {...props} className={`${styles.postbox} ${styles.isNote}`}>{children}</note>,
  Info: ({children, ...props}) => <mark {...props} className={`${styles.postbox} ${styles.isInfo}`}>{children}</mark>,
  Aside: ({children, ...props}) => <i {...props} className={`${styles.postbox} ${styles.isAside}`}>{children}</i>,
  pre({ children:{ props } }) {
    const language = props.className?.match( /language-(.*)/ )[ 1 ]
    console.log( language )
    return <Highlight
      {...defaultProps}
      code={props.children.trim()}
      language={props.className?.match( /language-(.*)/ )[ 1 ]}
      theme={theme}
    >
      {({
        className,
        style,
        tokens,
        getLineProps,
        getTokenProps,
      }) => (
        <pre className={`${styles.postbox} ${styles.isPre} ${className}`} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i, className:styles.line })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  }
}

export default ({ mdxData:{ frontmatter, body }, previous=null, next=null }) => {
  const { date, author, categories, title } = frontmatter

  return <>
    <section className={styles.post}>
      <aside className={`${styles.meta} ${styles.isSticky}`}>
        <span className={styles.author}>{author}</span>
        <time className={styles.date} dateTime={date}>{date.replace( /-/g, `.` )}</time>
        <span className={styles.categories}>{categories.split( /, /g ).join( `  •  ` )}</span>
      </aside>
      <article className={styles.content}>
        <h1>{title}</h1>
        <MDXProvider components={shortcodes} >
          <MDXRenderer>{body}</MDXRenderer>
        </MDXProvider>
      </article>
      <aside className={`${styles.tableOfContent} ${styles.isSticky}`} />
    </section>
    <nav className={styles.adjacentPosts}>
      {
        previous && <div className={`${styles.adjacentPostsItem} ${styles.previous}`}>
          <Link to={previous.fields.slug}>{previous.frontmatter.title}</Link>
        </div>
      }
      {
        next && <div className={`${styles.adjacentPostsItem} ${styles.next}`}>
          <Link to={next.fields.slug}>{next.frontmatter.title}</Link>
        </div>
      }
    </nav>
  </>
}