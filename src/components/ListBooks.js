import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Book from './Book';

class ListBooks extends Component {
  static propTypes = {
    books: PropTypes.array.isRequired,
    onBookUpdate: PropTypes.func.isRequired,
    availableBookshelves: PropTypes.array.isRequired
  }

  render() {
    const {books, onBookUpdate, availableBookshelves} = this.props;
    return (
      <ol className="books-grid">
        {books.map( (book, idx) => (
          <li key={book.id}>
            <Book
              bookData={book}
              onBookUpdate={onBookUpdate}
              availableBookshelves={availableBookshelves}
            />
          </li>
        ))}
      </ol>
    );
  }
}

export default ListBooks;
