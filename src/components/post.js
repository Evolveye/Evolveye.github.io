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

export default class Post extends React.Component {
  // static propTypes = {
  //   frontmatter: PropTypes.shape( {
  //     date: PropTypes.string.isRequired,
  //     title: PropTypes.string.isRequired,
  //     author: PropTypes.string.isRequired,
  //     categories: PropTypes.string.isRequired,        // it doesn't work, anybody know why?
  //     tags: PropTypes.string,
  //   } ).isRequired,
  //   body: PropTypes.string.isRequired,
  //   shouldBodyBeRendered: PropTypes.bool,
  //   titleLinkAddress: PropTypes.string,
  //   previous: PropTypes.string,
  //   next: PropTypes.string,
  // }

  render = () => {
    const {
      frontmatter,
      body,
      isEntry = false,
      titleLinkAddress = ``,
      previous = null,
      next = null,
      ...restProps
    } = this.props

    const { title, date, author, categories, tags=`` } = frontmatter

    if (!body) throw new Error( `Body property is required! (just add "body={...}" property)` )
    if (!frontmatter) throw new Error( `Frontmatter property is required! (just add "frontmatter={...}" property)` )

    if (!title) throw new Error( `Every post should have title!` )
    if (!date) throw new Error( `Every post should have publication date! Post "${title}" haven't!` )
    if (!author) throw new Error( `Every post should have author! Post "${title}" haven't!` )
    if (!categories) throw new Error( `Every post should have minimum one category! Post "${title}"` )

    const titleContent = titleLinkAddress ? <Link to={titleLinkAddress}>{title}</Link> : title

    return <>
      <article {...restProps} className={`${styles.post} ${isEntry ? styles.isEntry : ``}`}>
        {/* <aside className={`${styles.meta} ${styles.isSticky}`}></aside> */}
        <article className={`neumorphizm-white ${styles.content} is-separated-left`}>
          {isEntry ? <h3 className="h1">{titleContent}</h3> : <h1>{titleContent}</h1>}
          <aside className={styles.meta}>
            <span className={styles.author}>{author}</span>
            <time className={styles.date} dateTime={date}>{date.replace( /-/g, `.` )}</time>
            <article className={styles.categories}>
              {categories.map( category => <Link key={category} className={`neumorphizm${styles.category}`} to={`/category/${category}`}>{category}</Link> )}
            </article>
          </aside>
          {
            isEntry ? body : (
              <MDXProvider components={shortcodes} >
                <MDXRenderer>{body}</MDXRenderer>
              </MDXProvider>
            )
          }
        </article>
        {/* <aside className={`${styles.tableOfContent} ${styles.isSticky}`} /> */}
      </article>

      {
        tags && <article className={styles.tags}>
          {tags.map( tag => <Link key={tag} className={`box ${styles.tag} is-noText`} to={`/tag/${tag}`}>{tag}</Link> )}
        </article>
      }

      {
        !isEntry &&<nav className={styles.adjacentPosts}>
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
      }
    </>
  }
}