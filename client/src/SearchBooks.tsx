import { useQuery, gql, ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { useState } from 'react';

// ...existing code...

const GET_BOOKS = gql`
  query getBooks($title: String!) {
    books(title: $title) {
      title
      authors
      description
      image
      link
    }
  }
`;

// ...existing code...

const SearchBooks = () => {
  const [searchInput, setSearchInput] = useState('');

  const { loading, error, data } = useQuery(GET_BOOKS, {
    variables: { title: searchInput },
  });

  // ...existing code...

  if (error) {
    console.error('Error fetching books:', error);
  }

  // ...existing code...

  return (
    <div>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search for books"
      />
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <ul>
          {data.books.map((book: any) => (
            <li key={book.title}>
              <h3>{book.title}</h3>
              <p>{book.authors.join(', ')}</p>
              <p>{book.description}</p>
              <img src={book.image} alt={book.title} />
              <a href={book.link}>More Info</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql', // Ensure this URL is correct
  cache: new InMemoryCache(),
});

const App = () => (
  <ApolloProvider client={client}>
    <SearchBooks />
  </ApolloProvider>
);

export default App;