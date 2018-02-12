import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import Bookshelf from './Bookshelf';

class MyReads extends Component {
  static propTypes = {
    books: PropTypes.array.isRequired,
    bookshelves: PropTypes.array.isRequired,
    onShelfUpdate: PropTypes.func.isRequired,
    onBookClick: PropTypes.func,
    addBookPath: PropTypes.string.isRequired,
    loadingBooks: PropTypes.bool
  }

  render() {
    const {
      books,
      bookshelves,
      onShelfUpdate,
      onBookClick,
      addBookPath,
      loadingBooks
    } = this.props;

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
              onShelfUpdate={onShelfUpdate}
              onBookClick={onBookClick}
              availableBookshelves={bookshelves}
              loadingBooks={loadingBooks}
            />
          ))}
        </div>

        <div className="open-search">
          <Link to={addBookPath}>Add a book</Link>
        </div>

      </div>
    );
  }
}

export default MyReads;
