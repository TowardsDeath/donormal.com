import React from 'react';
import Link from 'gatsby-link';
import { Box, Card, Subhead, Text } from 'rebass';
import { SplitContainer } from '../components/layouts/SplitContainer';
import '../queries/markdown.js';

const IndexPage = ({ data }) => {
  return (
    <SplitContainer>
      <Box bg="pinkHippie">
        Logo
      </Box>
      <div>
        {data.writing.edges.map(({ node }) =>
          <div key={node.id}>
            <Card bg="pinkHippie">
              <Link to={node.fields.slug}>
                <Subhead children={node.frontmatter.title} />
                <Text>{`Published on ${node.frontmatter.date}`}</Text>
              </Link>
            </Card>
          </div>
        )}
      </div>
    </SplitContainer>
  )
};

export default IndexPage;

export const query = graphql`
  query IndexQuery {
    writing: allMarkdownRemark(limit: 3, filter: { fields: { type: { eq: "writing" } } }, sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        ...markdown_node
      }
    }
  }`;
