import User, { UserDocument } from '../models/User.js';
import { signToken } from '../services/auth.js';
import axios from 'axios';
interface VolumeInfo {
  title: string;
  authors: string[];
  description: string;
  imageLinks: {
    thumbnail: string;
  };
}

interface Book {
  id: string;
  volumeInfo: VolumeInfo;
}

interface SearchBooksResponse {
  items: Book[];
}

const resolvers = {
  Query: {
    // Fetch all users
    users: async (): Promise<UserDocument[]> => {
      return await User.find();
    },

    // Fetch a single user by ID
    user: async (_parent: unknown, { id }: { id: string }): Promise<UserDocument | null> => {
      const user = await User.findById(id);
      if (!user) throw new Error('User not found');
      return user;
    },

    // Fetch the currently logged-in user
    me: async (_parent: unknown, _args: unknown, context: { user: UserDocument }): Promise<UserDocument | null> => {
      if (!context.user) throw new Error('Not authenticated');
      return context.user;
    },

    // Search for books using Google Books API
    searchBooks: async (_parent: unknown, { query }: { query: string }): Promise<Book[]> => {
      try {
        const response = await axios.get<SearchBooksResponse>('https://www.googleapis.com/books/v1/volumes', {
          params: {
            q: query,
            key: process.env.GOOGLE_BOOKS_API_KEY, // Use the API key from environment variables
          },
        });
        return response.data.items;
      } catch (error) {
        console.error('Error fetching books from Google Books API:', error);
        throw new Error('Failed to fetch books');
      }
    },
  },

  Mutation: {
    // Create a new user
    addUser: async (_parent: unknown, args: { username: string; email: string; password: string }) => {
      try {
        const existingUser = await User.findOne({ email: args.email });
        if (existingUser) {
          throw new Error('Email already exists');
        }
        const existingUsername = await User.findOne({ username: args.username });
        if (existingUsername) {
          throw new Error('Username already exists');
        }
        const user = await User.create(args);
        const token = signToken(user.username, user.email, user.id); // Use user.id after it is created
        return { token, user };
      } catch (err) {
        console.error('Error creating user:', err);
        throw new Error('Failed to create user. Please check your input data.');
      }
    },

    // Log in an existing user
    login: async (_parent: unknown, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) throw new Error('Incorrect credentials');
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    // Save a book to a user's savedBooks list
    saveBook: async (_parent: unknown, { userId, book }: { userId: string; book: any }) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { savedBooks: book } },
        { new: true, runValidators: true }
      );
      if (!updatedUser) throw new Error('User not found');
      return updatedUser;
    },

    // Delete a book from a user's savedBooks list
    deleteBook: async (_parent: unknown, { userId, bookId }: { userId: string; bookId: string }) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
      if (!updatedUser) throw new Error('User not found');
      return updatedUser;
    },
  },
};

export default resolvers;