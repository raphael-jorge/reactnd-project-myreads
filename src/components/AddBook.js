import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import * as BooksAPI from '../BooksAPI';
import ListBooks from './ListBooks';
import BookModal from './BookModal';

/**
 * @description A página de adição de livros da aplicação MyReads.
 * Requer os módulos React, React Router e PropTypes.
 * @extends React.Component
 * @exports AddBook
*/
export default class AddBook extends Component {
  static propTypes = {
    // Os livros presentes na aplicação MyReads.
    books: PropTypes.array.isRequired,
    // As pratileiras presentes na aplicação.
    bookshelves: PropTypes.array.isRequired,
    // A função a ser chamada quando o parâmetro shelf de um livro é modificado.
    // Deve retornar uma promise.
    onShelfUpdate: PropTypes.func.isRequired,
    // A função a ser chamada para abrir o modal.
    onModalOpen: PropTypes.func,
    // A função a ser chamada para fechar o modal.
    onModalClose: PropTypes.func,
    // Propriedade que indica se o modal deve ser exibido.
    isModalOpen: PropTypes.bool,
    // Propriedade que indica o livro a ser exibido no modal.
    bookModal: PropTypes.object,
    // O path da página MyReads.
    listBooksPath: PropTypes.string.isRequired,
  }

  /**
   * @constant
   * @type {number}
   * @description O tempo, em milisegundos, de atraso da operação de consulta
   * no servidor.
   */
  DEBOUNCE_TIME = 300
  timer = null
  noQueryingState = {
    queriedBooks: [],
    querying: false
  }

  /**
   * @type {object}
   * @description Os estados do componente.
   * @property {string} query O valor do campo de busca.
   * @property {boolean} querying Indica o estado da operação de busca dos
   * livros no servidor.
   * @property {array} queriedBooks Os livros encontrados para o valor de query.
   */
  state = {
    query: '',
    querying: false,
    queriedBooks: []
  }

  /**
   * @method
   * @description Pesquisa livros no servidor para um determinado termo de busca
   * e os armazena no estado queriedBooks.
   * @param {string} query O valor do termo de busca.
   */
  queryBookFromAPI = query => {
    BooksAPI.search(query)
    .then(queriedBooks => {
      // Se foram encontrados livros e há um valor no campo de pesquisa...
      if (queriedBooks && queriedBooks.length && this.state.query) {
        // Insere o parametro shelf nos livros pesquisados e atualiza o state
        queriedBooks = this.setShelfOnBooks(this.props.books, queriedBooks);
        this.setState({
          queriedBooks: queriedBooks,
          querying: false
        });
      } else {
        this.setState(this.noQueryingState);
      }
    })
    .catch(() => this.setState(this.noQueryingState));
  }

  /**
   * @method
   * @description Configura o parâmetro shelf nos livros passados em booksToUpdate
   * com base nos livros passados em referenceBooks. A comparação entre os livros
   * é realizado por meio do parâmetro id. Se nenhuma correspondência for encontrada
   * em referenceBooks o parâmetro shelf em booksToUpdate será configurado para o
   * valor 'none'.
   * @param {array} referenceBooks Os livros fontes de verdade do valor do parâmetro
   * shelf.
   * @param {array} booksToUpdate  Os livros que devem ter o parâmetro shelf
   * configurado.
   * @return {array} Os livros passados em booksToUpdate com o parâmetro shelf
   * configurado com base nos valores do parâmetro shelf dos livros passados em
   * referenceBooks.
   */
  setShelfOnBooks = (referenceBooks, booksToUpdate) => {
    const refBooksIds = referenceBooks.map(book => book.id);

    const updatedBooks = booksToUpdate.map(bookToUpdate => {
      // Procura o bookToUpdate no referenceBooks
      const idxOnRefBooks = refBooksIds.indexOf(bookToUpdate.id);
      const updatedBook = bookToUpdate;
      // Cria ou atualiza o parâmetro shelf
      if (idxOnRefBooks === -1) {
        updatedBook.shelf = 'none';
      } else {
        updatedBook.shelf = referenceBooks[idxOnRefBooks].shelf;
      }
      return updatedBook;
    });

    return updatedBooks;
  }

  /**
   * @method
   * @description Configura a função onShelfUpdate, fornecida para o componente, de
   * modo a manter o parâmetro shelf nos livros pesquisados, e armazenados no estado
   * queriedBooks, sincronizados com o parâmetro shelf dos livros presentes na
   * aplicação MyReads.
   * @param {function} onShelfUpdate A função onShelfUpdate fornecida para o
   * componente.
   * @return {function} A função onShelfUpdate configurada.
   */
  setShelfUpdate = onShelfUpdate => {
    const newOnShelfUpdate = (bookData, newShelf) => {
      return onShelfUpdate(bookData, newShelf).then(() => {
        // Atualiza o parâmetro shelf nos livros pesquisados
        const updatedQueriedBooks = this.setShelfOnBooks(this.props.books,
                                                         this.state.queriedBooks);
        this.setState({queriedBooks: updatedQueriedBooks});
      });
    };

    return newOnShelfUpdate;
  }

  /**
   * @method
   * @description Atualiza o estado query, configura a renderização do ícone de
   * carregamento e inicializa uma função de consulta no servidor. Essa operação
   * de consulta só é iniciada quando nenhuma nova alteração do valor do campo
   * de busca ocorre dentro de um período de tempo determinado pelo valor do
   * parâmetro DEBOUNCE_TIME.
   * @param {string} newQuery O novo valor do campo de busca.
   */
  onQueryChange = newQuery => {
    // Atualiza o state query
    this.setState({query: newQuery});

    // Cancela a última operação de query da api
    clearTimeout(this.timer);
    if (newQuery) {
      this.setState({querying: true});
      // Cria uma nova operação de query atrasada
      this.timer = setTimeout(() => this.queryBookFromAPI(newQuery),
                              this.DEBOUNCE_TIME);
    } else {
      this.setState(this.noQueryingState);
    }
  }

  render() {
    const {
      bookshelves,
      onShelfUpdate,
      onModalOpen,
      onModalClose,
      isModalOpen,
      bookModal,
      listBooksPath
    } = this.props;

    const isModalSet = (onModalOpen !== undefined &&
                        onModalClose !== undefined &&
                        isModalOpen !== undefined &&
                        bookModal !== undefined);

    return (
      <div className="search-books">

        <div className="modal-main-app">
          <div className="search-books-bar">
            <Link className="close-search" to={listBooksPath}></Link>
            <div className="search-books-input-wrapper">
              <input
                type="text"
                value={this.state.query}
                placeholder="Search by title or author"
                onChange={ e => this.onQueryChange(e.target.value) }
              />
            </div>
          </div>

          <div className="search-books-results">
            <ListBooks
              books={this.state.queriedBooks}
              onShelfUpdate={this.setShelfUpdate(onShelfUpdate)}
              onBookClick={isModalSet ? onModalOpen : undefined}
              availableBookshelves={bookshelves}
              loadingBooks={this.state.querying}
              noBooksMessage={this.state.query && 'No Book Matches Found'}
            />
          </div>
        </div>

        {isModalSet &&
          <BookModal
            isOpen={isModalOpen}
            mainAppSelector={'.modal-main-app'}
            onModalClose={onModalClose}
            bookData={bookModal}
            bookshelves={bookshelves}
            onShelfUpdate={this.setShelfUpdate(onShelfUpdate)}
          />
        }

      </div>
    );
  }
}
