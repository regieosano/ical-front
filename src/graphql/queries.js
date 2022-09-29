import { gql } from '@apollo/client';

export const GET_SCHOOLS = gql`
    query getSchools {
			schools {
				id
				name
				code
				athletics
				activity
				nonpublished
				rental
			}
		}
`