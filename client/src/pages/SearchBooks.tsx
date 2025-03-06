import { useState, useEffect, FormEvent } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { SEARCH_GOOGLE_BOOKS, GET_ME } from '../utils/queries';
import { SAVE_BOOK } from '../utils/mutation';
import Auth from '../utils/auth';
import { getSavedBookIds, saveBookIds } from '../utils/localStorage';
import { GoogleAPIBook } from '../models/GoogleAPIBook';
import { Book } from '../models/Book';
import { Container, Form, Button, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState<Book[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());
  const [errorMessage, setErrorMessage] = useState('');

  const [searchBooks, { loading: queryLoading, data, error }] = useLazyQuery(SEARCH_GOOGLE_BOOKS);

  const [saveBookMutation] = useMutation(SAVE_BOOK, {
    refetchQueries: [{ query: GET_ME }],
  });

  useEffect(() => {
    // Save saved book IDs when component unmounts
    return () => saveBookIds(savedBookIds);
  }, [savedBookIds]);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(''); // Reset prior error messages

    if (!searchInput) return;

    try {
      await searchBooks({ variables: { query: searchInput } });
    } catch (err) {
      console.error('Error searching books:', err);
      setErrorMessage('An error occurred while searching for books.');
    }
  };

  useEffect(() => {
    if (data && data.searchBooks) {
      const bookData = data.searchBooks.map((book: GoogleAPIBook) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
      }));
      setSearchedBooks(bookData);
    }
    if (error) {
      console.error('Error fetching books:', error);
      setErrorMessage('An error occurred while fetching the book data.');
    }
  }, [data, error]);

  const handleSaveBook = async (bookId: string) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId)!;

    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) return;

    const user = Auth.getProfile();
    if (!user) {
      console.error('User not logged in');
      return;
    }

    try {
      await saveBookMutation({
        variables: { userId: user._id, book: bookToSave },
      });

      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error('Error saving book:', err);
      setErrorMessage('An error occurred while saving the book.');
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>} {/* Show error if exists */}
          {error && <Alert variant="danger">An error occurred: {error.message}</Alert>} {/* Display GraphQL error */}
          <Form onSubmit={handleFormSubmit}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Search for a book"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" variant="success" disabled={queryLoading}>
              {queryLoading ? <Spinner animation="border" size="sm" /> : 'Submit Search'}
            </Button>
          </Form>
        </Container>
      </div>
      <Container>
        <h2>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => (
            <Col key={book.bookId} md="4">
              <Card border="dark">
                {book.image && (
                  <Card.Img 
                    src={book.image} 
                    alt={`The cover for ${book.title}`} 
                    variant="top" 
                  />
                )}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors.join(', ')}</p>
                  <Card.Text>{book.description || 'No description available.'}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedBookIds.includes(book.bookId)}
                      className="btn-block btn-info"
                      onClick={() => handleSaveBook(book.bookId)}
                    >
                      {savedBookIds.includes(book.bookId)
                        ? 'This book has already been saved!'
                        : 'Save this Book!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;