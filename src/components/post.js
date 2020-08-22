import React from "react"
import { MDXRenderer } from "gatsby-plugin-mdx"

import styles from "./posts.module.css"

export default ({ mdxData:{ frontmatter, body } }) => {
  const { date, author, categories, title } = frontmatter

  return <article className={styles.entry}>
    <article className={styles.main}>
      <h3 className={styles.title}>{title}</h3>
      <MDXRenderer className={styles.content}>{body}</MDXRenderer>
    </article>
    <aside className={`${styles.aside} ${styles.isSticky}`}>
      <span className={styles.author}>{author}</span>
      <time className={styles.date} dateTime={date}>{date.replace( /-/g, `.` )}</time>
      <span className={styles.categories}>{categories.split( /, /g ).join( `  •  ` )}</span>
    </aside>
  </article>
}