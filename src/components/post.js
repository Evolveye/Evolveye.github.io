import React from "react"
import { Link } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { MDXProvider } from "@mdx-js/react"

import styles from "./posts.module.css"

const shortcodes = {
  Note: ({children, ...props}) => <note {...props} className={`${styles.postbox} ${styles.isNote}`}>{children}</note>,
  Info: ({children, ...props}) => <mark {...props} className={`${styles.postbox} ${styles.isInfo}`}>{children}</mark>,
  Aside: ({children, ...props}) => <i {...props} className={`${styles.postbox} ${styles.isAside}`}>{children}</i>,
}

export default ({ mdxData:{ frontmatter, body }, previous=null, next=null }) => {
  const { date, author, categories, title } = frontmatter

  return <article className={styles.entry}>
    <article className={styles.main}>
      <h1 className={styles.title}>{title}</h1>
      <MDXProvider className={styles.content} components={shortcodes} >
        <MDXRenderer>{body}</MDXRenderer>
      </MDXProvider>
    </article>
    <aside className={`${styles.aside} ${styles.isSticky}`}>
      <span className={styles.author}>{author}</span>
      <time className={styles.date} dateTime={date}>{date.replace( /-/g, `.` )}</time>
      <span className={styles.categories}>{categories.split( /, /g ).join( `  •  ` )}</span>
      <nav className={styles.nav}>
        {previous && <Link className={styles.previous} to={previous.fields.slug}>{previous.frontmatter.title}</Link>}
        {next && <Link className={styles.next} to={next.fields.slug}>{next.frontmatter.title}</Link>}
      </nav>
    </aside>
  </article>
}