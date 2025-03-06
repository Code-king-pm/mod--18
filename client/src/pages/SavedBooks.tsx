import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client'; // ✅ Import Apollo hooks
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { GET_ME } from '../utils/queries'; // ✅ Import GraphQL query
import { DELETE_BOOK } from '../utils/mutation'; // ✅ Import GraphQL mutation
import type { User } from '../models/User';

const SavedBooks = () => {
  const [userData, setUserData] = useState<User>({
    username: '',
    email: '',
    password: '',
    savedBooks: [],
  });

  // ✅ Use Apollo's useQuery to fetch user data
  const { loading, error, data } = useQuery(GET_ME);

  // ✅ Use Apollo's useMutation to delete a book
  const [deleteBookMutation] = useMutation(DELETE_BOOK, {
    refetchQueries: [{ query: GET_ME }], // ✅ Refetch user data after deletion
  });

  // ✅ Update userData when GraphQL query returns data
  useEffect(() => {
    if (data) {
      setUserData(data.me);
    }
  }, [data]);

  // ✅ Function to handle deleting a book
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await deleteBookMutation({
        variables: { bookId }, // ✅ Pass bookId to the mutation
      });

      // ✅ Remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error('Error deleting book:', err);
    }
  };

  // ✅ If data is still loading, show a loading message
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  // ✅ If there's an error, show an error message
  if (error) {
    return <h2>Error: {error.message}</h2>;
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md='4' key={book.bookId}>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
