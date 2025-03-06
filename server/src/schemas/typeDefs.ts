import { gql } from 'graphql-tag';

const typeDefs = gql`
  type VolumeInfo {
    title: String
    authors: [String]
    description: String
    imageLinks: ImageLinks
  }

  type ImageLinks {
    thumbnail: String
  }

  type Book {
    id: String
    volumeInfo: VolumeInfo
  }

  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]
  }

  type Auth {
    token: String
    user: User
  }

  type Query {
    users: [User]
    user(id: ID!): User
    me: User
    searchBooks(query: String!): [Book]
  }

  input BookInput {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(userId: ID!, book: BookInput!): User
    deleteBook(userId: ID!, bookId: String!): User
  }
`;

export default typeDefs;