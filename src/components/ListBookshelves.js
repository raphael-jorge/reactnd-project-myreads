import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Bookshelf from './Bookshelf';

class ListBookshelves extends Component {
  static propTypes = {
    books: PropTypes.array.isRequired,
    bookshelves: PropTypes.array.isRequired,
    onAddBook: PropTypes.func.isRequired
  }

  render() {
    const {books, bookshelves, onAddBook} = this.props;

    return (
      <div className="list-books">

        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>

        <div className="list-books-content">
          {bookshelves.map( bookshelf => (
            <Bookshelf
              key={bookshelf.name}
              title={bookshelf.title}
              books={books.filter(book => book.shelf === bookshelf.name)}
              availableBookshelves={bookshelves}
            />
          ))}
        </div>

        <div className="open-search">
          <a onClick={onAddBook}>Add a book</a>
        </div>

      </div>
    );
  }
}

export default ListBookshelves;
