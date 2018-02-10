import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Book from './Book';

class ListBooks extends Component {
  static propTypes = {
    books: PropTypes.array.isRequired,
    onBookUpdate: PropTypes.func.isRequired,
    availableBookshelves: PropTypes.array.isRequired,
    loadingBooks: PropTypes.bool
  }

  render() {
    const {books, onBookUpdate, availableBookshelves, loadingBooks} = this.props;
    return (
      <ol className="books-grid">
        {loadingBooks ? (
          <li className='loading'>Loading</li>
        ) : (
          books.map( (book, idx) => (
            <li key={book.id}>
              <Book
                bookData={book}
                onBookUpdate={onBookUpdate}
                availableBookshelves={availableBookshelves}
              />
            </li>
          ))
        )}

      </ol>
    );
  }
}

export default ListBooks;
