import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import Bookshelf from './Bookshelf';
import BookModal from './BookModal';

/**
 * @description A página MyReads. Requer os módulos React, React Router
 * e PropTypes.
 * @extends React.Component
 * @exports MyReads
*/
export default class MyReads extends Component {
  static propTypes = {
    // Os livros presentes na aplicação MyReads.
    books: PropTypes.array.isRequired,
    // As pratileiras presentes na aplicação.
    bookshelves: PropTypes.array.isRequired,
    // A função a ser chamada quando o parâmetro shelf de um livro é modificado.
    onShelfUpdate: PropTypes.func.isRequired,
    // A função a ser chamada para abrir o modal.
    onModalOpen: PropTypes.func,
    // A função a ser chamada para fechar o modal.
    onModalClose: PropTypes.func,
    // Propriedade que indica se o modal deve ser exibido.
    isModalOpen: PropTypes.bool,
    // Propriedade que indica o livro a ser exibido no modal.
    bookModal: PropTypes.object,
    // O path da página de adição de livros à aplicação MyReads.
    addBookPath: PropTypes.string.isRequired,
    // Estado de carregamento dos livros da aplicação MyReads.
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
