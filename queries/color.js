/* eslint-disable no-tabs */
import gql from 'graphql-tag'

const COLOR_QUERY = gql`
	query color ($id: ID!, $endCursor: String, $count: Int) {
		color(id: $id) {
			id
			link
			name
			slug
			uri
			count
			posts (first: $count, after: $endCursor) {
				nodes {
					id
					title
					slug
					date
					postId
					featuredImage {
						node {
							id
							uri
							title
							srcSet
							sourceUrl
						}
					}
					categories {
						nodes {
							name
						}
					}
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
					startCursor
				}
			}
		}
	}
`

export default COLOR_QUERY
