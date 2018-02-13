import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ListBooks from './ListBooks';

/**
 * @description Representa uma prateleira. Requer os módulos React e PropTypes.
 * @extends React.Component
 * @exports Bookshelf
 */
export default class Bookshelf extends Component {
  static propTypes = {
    // O título da prateleira.
    title: PropTypes.string.isRequired,
    // Os livros presentes nessa prateleira.
    books: PropTypes.array.isRequired,
    // A função a ser chamada quando o parâmetro shelf de um livro é modificado.
    onShelfUpdate: PropTypes.func.isRequired,
    // A função a ser chamada caso haja um clique nos livros.
    onBookClick: PropTypes.func,
    // As outras prateleiras disponíveis.
    availableBookshelves: PropTypes.array.isRequired,
    // Estado de carregamento dos livros dessa bookshelf.
    loadingBooks: PropTypes.bool
  }

  render() {
    const {
      title,
      books,
      onShelfUpdate,
      onBookClick,
      availableBookshelves,
      loadingBooks
    } = this.props;

    return (
      <div className="bookshelf">

        <h2 className="bookshelf-title">{title}</h2>

        <div className="bookshelf-books">
          <ListBooks
            books={books}
            onShelfUpdate={onShelfUpdate}
            onBookClick={onBookClick}
            availableBookshelves={availableBookshelves}
            loadingBooks={loadingBooks}
            noBooksMessage={'This Bookshelf is Empty'}
          />
        </div>

      </div>
    );
  }
}
