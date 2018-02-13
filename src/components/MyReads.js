import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import Bookshelf from './Bookshelf';
import BookModal from './BookModal';

export default class MyReads extends Component {
  static propTypes = {
    books: PropTypes.array.isRequired,
    bookshelves: PropTypes.array.isRequired,
    onShelfUpdate: PropTypes.func.isRequired,
    onModalOpen: PropTypes.func,
    onModalClose: PropTypes.func,
    isModalOpen: PropTypes.bool,
    bookModal: PropTypes.object,
    addBookPath: PropTypes.string.isRequired,
    loadingBooks: PropTypes.bool
  }

  render() {
    const {
      books,
      bookshelves,
      onShelfUpdate,
      onModalOpen,
      onModalClose,
      isModalOpen,
      bookModal,
      addBookPath,
      loadingBooks
    } = this.props;

    const isModalSet = (onModalOpen !== undefined &&
                        onModalClose !== undefined &&
                        isModalOpen !== undefined &&
                        bookModal !== undefined);

    return (
      <div className="list-books">

        <div className="modal-main-app">

          <div className="list-books-title">
            <h1>MyReads</h1>
          </div>

          <div className="list-books-content">
            {bookshelves.map(bookshelf => (
              <Bookshelf
                key={bookshelf.name}
                title={bookshelf.title}
                books={books.filter(book => book.shelf === bookshelf.name)}
                onShelfUpdate={onShelfUpdate}
                onBookClick={isModalSet ? onModalOpen : undefined}
                availableBookshelves={bookshelves}
                loadingBooks={loadingBooks}
              />
            ))}
          </div>

          <div className="open-search">
            <Link to={addBookPath}>Add a book</Link>
          </div>

        </div>

        {isModalSet &&
          <BookModal
            isOpen={isModalOpen}
            mainAppSelector={'.modal-main-app'}
            onModalClose={onModalClose}
            bookData={bookModal}
            bookshelves={bookshelves}
            onShelfUpdate={onShelfUpdate}
          />
        }

      </div>
    );
  }
}
