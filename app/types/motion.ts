/**
 * Tags the motion kit components may render as. A literal union (not `string`) keeps
 * motion-v's `<Motion :as>` typings resolvable.
 */
export type MotionTag =
  | "div" | "span" | "p" | "section" | "article" | "header" | "footer"
  | "h1" | "h2" | "h3" | "h4" | "ul" | "ol" | "li" | "dl" | "blockquote" | "figure";
