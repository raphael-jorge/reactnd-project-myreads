import React, {Component} from 'react';
import PropTypes from 'prop-types';
import sortBy from 'sort-by';
import Book from './Book';

/**
 * @description Uma lista de livros em ordem alfabética de título.
 * Requer os módulos React e PropTypes e sortBy.
 * @extends React.Component
 * @exports ListBooks
 */
export default class ListBooks extends Component {
  static propTypes = {
    // Os livros a serem listados.
    books: PropTypes.array.isRequired,
    // A função a ser chamada quando o parâmetro shelf de um livro é modificado.
    onShelfUpdate: PropTypes.func.isRequired,
    // As prateleiras disponíveis.
    availableBookshelves: PropTypes.array.isRequired,
    // A função a ser chamada caso haja um clique nos livros.
    onBookClick: PropTypes.func,
    // Estado de carregamento dos livros a serem listados.
    loadingBooks: PropTypes.bool,
    // Uma mensagem a ser renderizada caso não haja livros a serem listados.
    noBooksMessage: PropTypes.string
  }

  render() {
    const {
      books,
      onShelfUpdate,
      onBookClick,
      availableBookshelves,
      loadingBooks,
      noBooksMessage
    } = this.props;

    return (
      <ol className="books-grid">
        {loadingBooks ? (
          <li className="loading">Loading</li>
        ) : (
          books.length ? (
            books.sort(sortBy('title')).map(book => (
              <li key={book.id}>
                <Book
                  bookData={book}
                  onShelfUpdate={onShelfUpdate}
                  onBookClick={onBookClick}
                  availableBookshelves={availableBookshelves}
                />
              </li>
            ))
          ) : (noBooksMessage &&
            <li className="no-books">{noBooksMessage}</li>
          )
        )}
      </ol>
    );
  }
}
