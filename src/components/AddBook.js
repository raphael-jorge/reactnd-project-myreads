import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import * as BooksAPI from '../BooksAPI';
import ListBooks from './ListBooks';

class AddBook extends Component {
  static propTypes = {
    books: PropTypes.array.isRequired,
    bookshelves: PropTypes.array.isRequired,
    onShelfUpdate: PropTypes.func.isRequired,
    onBookClick: PropTypes.func,
    listBooksPath: PropTypes.string.isRequired,
  }

  state = {
    query: '',
    querying: false,
    queriedBooks: []
  }

  DEBOUNCE_TIME = 300
  timer = null
  noQueryingState = {
    queriedBooks: [],
    querying: false
  };

  queryBookFromAPI = (query) => {
    BooksAPI.search(query)
    .then( queriedBooks => {
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
    .catch( () => this.setState(this.noQueryingState) );
  }

  setShelfOnBooks = (referenceBooks, booksToUpdate) => {
    const refBooksIds = referenceBooks.map( book => book.id );

    const updatedBooks = booksToUpdate.map( bookToUpdate => {
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

  setShelfUpdate = (onShelfUpdate) => {
    const newOnShelfUpdate = (bookData, newShelf) => {
      return onShelfUpdate(bookData, newShelf).then( () => {
        // Atualiza o parâmetro shelf nos livros pesquisados
        const updatedQueriedBooks = this.setShelfOnBooks(this.props.books,
                                                         this.state.queriedBooks);
        this.setState({queriedBooks: updatedQueriedBooks});
      });
    };

    return newOnShelfUpdate;
  }

  onQueryChange = (newQuery) => {
    // Atualiza o state query
    this.setState({query: newQuery});

    // Cancela a última operação de query da api
    clearTimeout(this.timer);
    if (newQuery) {
      this.setState({querying: true});
      // Cria uma nova operação de query atrasada
      this.timer = setTimeout( () => this.queryBookFromAPI(newQuery),
                              this.DEBOUNCE_TIME);
    } else {
      this.setState(this.noQueryingState);
    }
  }

  render() {
    const {
      bookshelves,
      onShelfUpdate,
      onBookClick,
      listBooksPath
    } = this.props;

    return (
      <div className="search-books">

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
            onBookClick={onBookClick}
            availableBookshelves={bookshelves}
            loadingBooks={this.state.querying}
            noBooksMessage={this.state.query && 'No Book Matches Found'}
          />
        </div>

      </div>
    );
  }
}

export default AddBook;
