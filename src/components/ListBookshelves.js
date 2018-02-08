import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import Bookshelf from './Bookshelf';

class ListBookshelves extends Component {
  static propTypes = {
    books: PropTypes.array.isRequired,
    bookshelves: PropTypes.array.isRequired,
    addBookPath: PropTypes.string.isRequired
  }

  render() {
    const {books, bookshelves, addBookPath} = this.props;

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
          <Link to={addBookPath}>Add a book</Link>
        </div>

      </div>
    );
  }
}

export default ListBookshelves;
