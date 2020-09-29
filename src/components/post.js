import React from "react"
// import PropTypes from "prop-types"
import { Link } from "gatsby"
import Highlight, { defaultProps, Prism } from "prism-react-renderer"
import theme from "prism-react-renderer/themes/vsDark"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { MDXProvider } from "@mdx-js/react"

import styles from "./posts.module.css"

(typeof global !== "undefined" ? global : window).Prism = Prism

require( `prismjs/components/prism-rust` )

const shortcodes = {
  Note: ({children, ...props}) => <strong {...props} className={`box is-red ${styles.box}`}>{children}</strong>,
  Info: ({children, ...props}) => <mark {...props} className={`box is-blue ${styles.box}`}>{children}</mark>,
  Aside: ({children, ...props}) => <i {...props} className={`box ${styles.box}`}>{children}</i>,
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
          <div {...getLineProps({ line, key:i })}>
            {line.map((token, key) => (
              <span {...getTokenProps({ token, key })} />
            ))}
          </div>
        ))}
      </pre>
    )}
  </Highlight>
}

function validateProps( props ) {
  const { frontmatter, body } = props
  const { title, date, author, categories } = frontmatter

  if (!body) throw new Error( `Body property is required! (just add "body={...}" property)` )
  if (!frontmatter) throw new Error( `Frontmatter property is required! (just add "frontmatter={...}" property)` )

  if (!title) throw new Error( `Every post should have title!` )
  if (!date) throw new Error( `Every post should have publication date! Post "${title}" haven't!` )
  if (!author) throw new Error( `Every post should have author! Post "${title}" haven't!` )
  if (!categories) throw new Error( `Every post should have minimum one category! Post "${title}"` )

  return props
}

export default props => {
  const {
    frontmatter,
    body,
    previous = null,
    next = null,
    ...restProps
  } = validateProps( props )

  const { title, date, author, categories, tags=`` } = frontmatter

  return <article>
    <section {...restProps} className={`neumorphizm-white ${styles.content}`}>
      <h1>{title}</h1>

      <aside className={styles.meta}>
        <span className={styles.author}>{author}</span>

        <time className={styles.date} dateTime={date}>{date.replace( /-/g, `.` )}</time>

        <article className={styles.categories}>
          {categories.map( category => <Link key={category} className={`${styles.category}`} to={`/category/${category}`}>{category}</Link> )}
        </article>
      </aside>

       <MDXProvider components={shortcodes} >
         <MDXRenderer>{body}</MDXRenderer>
       </MDXProvider>
    </section>

    {
      tags && <nav className={styles.tags}>
        {tags.map( tag => <Link key={tag} className={`box ${styles.tag} is-not-decorative`} to={`/tag/${tag}`}>{tag}</Link> )}
      </nav>
    }

    <nav className={styles.adjacentPosts}>
      {
        previous && <div className={`${styles.adjacentPostsItem} ${styles.previous}`}>
          <Link to={`/post${previous.fields.slug}`}>{previous.frontmatter.title}</Link>
        </div>
      }{
        next && <div className={`${styles.adjacentPostsItem} ${styles.next}`}>
          <Link to={`/post${next.fields.slug}`}>{next.frontmatter.title}</Link>
        </div>
      }
    </nav>
  </article>
}

export const BlogpostEntry = props => {
  const {
    frontmatter,
    body,
    titleLinkAddress = ``,
    className = ``,
    ...restProps
  } = validateProps( props )

  const { title, date, author, categories } = frontmatter
  const titleContent = titleLinkAddress ? <Link to={titleLinkAddress} className={`${styles.titleLink} is-not-decorative`}>{title}</Link> : title

  return <article {...restProps} className={`neumorphizm-white is-hoverable ${styles.entry} ${className}`}>
    <div class={styles.neumorphizmTransformFix}>
      <h3 className={styles.title}>{titleContent}</h3>

      <aside className={styles.meta}>
        <span className={styles.author}>{author}</span>

        <time className={styles.date} dateTime={date}>{date.replace( /-/g, `.` )}</time>

        <article className={styles.categories}>
          {categories.map( category => <Link key={category} className={`${styles.category}`} to={`/category/${category}`}>{category}</Link> )}
        </article>
      </aside>

      <p>{body}</p>
    </div>
  </article>
}