import React, {Component} from 'react';
import PropTypes from 'prop-types';
import sortBy from 'sort-by';
import Book from './Book';

class ListBooks extends Component {
  static propTypes = {
    books: PropTypes.array.isRequired,
    onBookUpdate: PropTypes.func.isRequired,
    onBookClick: PropTypes.func,
    availableBookshelves: PropTypes.array.isRequired,
    loadingBooks: PropTypes.bool,
    noBooksMessage: PropTypes.string
  }

  render() {
    const {
      books,
      onBookUpdate,
      onBookClick,
      availableBookshelves,
      loadingBooks,
      noBooksMessage
    } = this.props;

    return (
      <ol className="books-grid">
        {loadingBooks ? (
          <li className='loading'>Loading</li>
        ) : (
          books.length ? (
            books.sort(sortBy('title')).map( (book, idx) => (
              <li key={book.id}>
                <Book
                  bookData={book}
                  onBookUpdate={onBookUpdate}
                  onBookClick={onBookClick}
                  availableBookshelves={availableBookshelves}
                />
              </li>
            ))
          ) : (noBooksMessage &&
            <li className='no-books'>{noBooksMessage}</li>
          )
        )}

      </ol>
    );
  }
}

export default ListBooks;
