export const markdownNodeFragment = graphql`
    fragment markdown_node on MarkdownRemarkEdge {
        node {
            frontmatter {
                title
                date(formatString: "MMMM DD, YYYY"),
                deck
            }
            fields {
                slug,
                type
            }
        }
    }`;
