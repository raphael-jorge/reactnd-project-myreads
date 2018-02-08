import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Book from './Book';

class Bookshelf extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    books: PropTypes.array.isRequired,
    onBookUpdate: PropTypes.func.isRequired,
    availableBookshelves: PropTypes.array.isRequired
  }

  render() {
    const {title, books, onBookUpdate, availableBookshelves} = this.props;

    return (
      <div className='bookshelf'>

        <h2 className='bookshelf-title'>{title}</h2>

        <div className='bookshelf-books'>
          <ol className='books-grid'>
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
        </div>

      </div>
    )
  }
}

export default Bookshelf;
