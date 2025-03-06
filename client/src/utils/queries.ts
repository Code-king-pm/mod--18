import { gql } from '@apollo/client';

export const SEARCH_GOOGLE_BOOKS = gql`
  query searchGoogleBooks($query: String!) {
    searchBooks(query: $query) {
      id
      volumeInfo {
        title
        authors
        description
        imageLinks {
          thumbnail
        }
      }
    }
  }
`;

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        title
        description
        image
        link
      }
    }
  }
`;