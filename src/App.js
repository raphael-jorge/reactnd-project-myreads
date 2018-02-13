import React from 'react';
import {Route} from 'react-router-dom';
import * as BooksAPI from './BooksAPI';
import MyReads from './components/MyReads';
import AddBook from './components/AddBook';
import './App.css';

/**
 * @description A aplicação MyReads. Requer os módulos React e React Router.
 * @extends React.Component
 * @exports BooksApp
 */
export default class BooksApp extends React.Component {
  /**
   * @constant
   * @type {array}
   * @description As prateleiras disponíveis para agrupar os livros.
   */
  static BOOKSHELVES = [
    {
      name: 'currentlyReading',
      title: 'Currently Reading'
    },
    {
      name: 'wantToRead',
      title: 'Want To Read'
    },
    {
      name: 'read',
      title: 'Read'
    }
  ]

  /**
   * @type {object}
   * @description Os estados do componente.
   * @property {array} books Os livros presentes na aplicação MyReads.
   * @property {boolean} loadingBooks Indica o estado da operação de
   * carregamento dos livros do servidor.
   * @property {boolean} showModal Indica se o modal deve ser exibido.
   * @property {object} bookModal O objeto com as informações do livro
   * a ser exibido no modal.
   */
  state = {
    books: [],
    loadingBooks: false,
    showModal: false,
    bookModal: {}
  }

  componentDidMount() {
    // Carrega os livros do servidor
    this.setState({loadingBooks: true});
    BooksAPI.getAll()
    .then(books => this.setState({
      books: books,
      loadingBooks: false
    }))
    .catch(() => this.setState({loadingBooks: false}));
  }

  /**
   * @method
   * @description Atualiza o parâmetro shelf de um livro tanto no servidor
   * como no estado da aplicação.
   * @param {object} bookData O objeto book
   * @param {string} newShelf O novo valor do parâmetro shelf
   * @return {promise} Uma promise que será resolvida ao fim da operação
   * de atualização do livro no servidor.
   */
  updateShelfOnBook = (bookData, newShelf) => {
    // Atualiza o livro no servidor
    return BooksAPI.update(bookData, newShelf).then(() => {
      // depois atualiza o estado books
      this.setState(prevState => {
        let updatedBooksState = prevState.books;

        // Verifica se o livro ja se encontra no estado books
        const booksIds = prevState.books.map(book => book.id);
        const bookIdx = booksIds.indexOf(bookData.id);

        if (bookIdx !== -1) {
          // Se estiver, atualiza a shelf do livro no estado books
          updatedBooksState[bookIdx].shelf = newShelf;
        } else {
          // Se não estiver, atualiza a shelf do livro e o insere no estado books
          bookData.shelf = newShelf;
          updatedBooksState.push(bookData);
        }
        updatedBooksState = updatedBooksState.filter(book => book.shelf !== 'none');
        return {books: updatedBooksState};
      });
    });
  }


  /**
   * @method
   * @description Fecha o elemento modal.
   */
  closeModal = () => {
    this.setState({
      showModal: false,
      bookModal: {}
    });
  }

  /**
   * @method
   * @description Exibe o elemento modal com os dados do livro fornecido.
   * @param {object} bookData O objeto book a ser exibido no modal.
   */
  openModal = bookData => {
    this.setState({
      showModal: true,
      bookModal: bookData
    });
  }

  render() {
    return (
      <div className="app">

        <Route exact path="/" render={ () => (
          <MyReads
            books={this.state.books}
            bookshelves={BooksApp.BOOKSHELVES}
            onShelfUpdate={this.updateShelfOnBook}

            onModalOpen={this.openModal}
            onModalClose={this.closeModal}
            isModalOpen={this.state.showModal}
            bookModal={this.state.bookModal}

            addBookPath={'/search'}
            loadingBooks={this.state.loadingBooks}
          />
        )} />

        <Route exact path="/search" render={ () => (
          <AddBook
            books={this.state.books}
            bookshelves={BooksApp.BOOKSHELVES}
            onShelfUpdate={this.updateShelfOnBook}

            onModalOpen={this.openModal}
            onModalClose={this.closeModal}
            isModalOpen={this.state.showModal}
            bookModal={this.state.bookModal}

            listBooksPath={'/'}
          />
        )} />

      </div>
    );
  }
}
