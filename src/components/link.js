import React from "react"
import { Link } from "gatsby"

export default ({ langKey, to, ...props }) => {
  if (!langKey) return <Link {...props} to={to} />

  const landPrefix = langKey === `en` ? `` : `/${langKey}`

  return <Link {...props} to={`${landPrefix}${to}`} />
}