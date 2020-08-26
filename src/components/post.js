import React from "react"
import { Link } from "gatsby"
import Highlight, { defaultProps } from "prism-react-renderer"
import theme from "prism-react-renderer/themes/vsDark"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { MDXProvider } from "@mdx-js/react"

import styles from "./posts.module.css"

const shortcodes = {
  Note: ({children, ...props}) => <strong {...props} className={`${styles.postbox} ${styles.isNote}`}>{children}</strong>,
  Info: ({children, ...props}) => <mark {...props} className={`${styles.postbox} ${styles.isInfo}`}>{children}</mark>,
  Aside: ({children, ...props}) => <i {...props} className={`${styles.postbox} ${styles.isAside}`}>{children}</i>,
  pre: ({ children:{ props } }) => <Highlight
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

export default ({ mdxData:{ frontmatter, body }, previous=null, next=null }) => {
  const { date, author, categories, tags=``, title } = frontmatter

  return <>
    <article className={styles.post}>
      <aside className={`${styles.meta} ${styles.isSticky}`}></aside>
      <article className={styles.content}>
        <h1>{title}</h1>
        <aside className={`${styles.meta}`}>
          <span className={styles.author}>{author}</span>
          <time className={styles.date} dateTime={date}>{date.replace( /-/g, `.` )}</time>
          <article className={styles.categories}>
            {categories.split( /, /g ).map( category => <Link key={category} className={styles.category} to="/">{category}</Link> )}
          </article>
        </aside>
        <MDXProvider components={shortcodes} >
          <MDXRenderer>{body}</MDXRenderer>
        </MDXProvider>
      </article>
      <aside className={`${styles.tableOfContent} ${styles.isSticky}`} />
    </article>
    {
      tags && <article className={styles.tags}>
        {tags.split( /, /g ).map( tag => <Link key={tag} className={styles.tag} to="/">{tag}</Link> )}
      </article>
    }
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