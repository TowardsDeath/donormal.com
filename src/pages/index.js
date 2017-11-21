import React from 'react'
import Link from 'gatsby-link'
import { Button } from '../components/navigation/Button'

const IndexPage = ({ data }) => {
  console.log(data)
  return (
    <div>
      <Link to="/page-2/">Go to page 2</Link>
      <Button type="button">Melp</Button>

      {data.allMarkdownRemark.edges.map(({ node }) =>
        <div key={node.id}>
          <Link to={node.fields.slug}>
            <h3>
              {node.frontmatter.title}{" "}
              <span>— {node.frontmatter.date}</span>
            </h3>
          </Link>
          <p>
            {node.excerpt}
          </p>
        </div>
      )}
    </div>
  )
}

export default IndexPage

export const query = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
  }`