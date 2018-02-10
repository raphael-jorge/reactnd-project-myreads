import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import * as BooksAPI from '../BooksAPI';
import ListBooks from './ListBooks';

class AddBook extends Component {
  static propTypes = {
    books: PropTypes.array.isRequired,
    bookshelves: PropTypes.array.isRequired,
    onBookUpdate: PropTypes.func.isRequired,
    listBooksPath: PropTypes.string.isRequired,
  }

  DEBOUNCE_TIME = 300
  timer = null
  state = {
    query: '',
    queriedBooks: []
  }

  setShelfOnQueriedBooks(queriedBooks, books) {
    const booksIds = books.map( book => book.id );

    const queriedBooksSet = queriedBooks.map( queriedBook => {
      // Procura o queriedBook nos books
      const queriedBookIdx = booksIds.indexOf(queriedBook.id);
      if (queriedBookIdx !== -1) {
        // Se achar, cria e atualiza a shelf no queriedBook
        queriedBook.shelf = books[queriedBookIdx].shelf;
      } else {
        // Se não achar, cria a shelf no queriedBook com valor 'none'
        queriedBook.shelf = 'none';
      }
      return queriedBook;
    });

    return queriedBooksSet;
  }

  handleQueryChange = (event, books) => {
    // Atualiza o state query
    const newQuery = event.target.value;
    this.setState({query: newQuery});

    // Cancela a última operação de query da api e cria uma nova, atrasada.
    clearTimeout(this.timer);
    if (newQuery) {
      this.timer = setTimeout( () => {
        BooksAPI.search(newQuery).then( queriedBooks => {
          if (queriedBooks && queriedBooks.length && this.state.query) {
            // Insere o parametro shelf nos livros pesquisados
            queriedBooks = this.setShelfOnQueriedBooks(queriedBooks, books);
            // Atualiza o queriedBooks state
            this.setState({queriedBooks: queriedBooks});
          } else {
            this.setState({queriedBooks: []});
          }
        });
      }, this.DEBOUNCE_TIME);

    } else {
      this.setState({queriedBooks: []});
    }
  }

  render() {
    const {books, bookshelves, onBookUpdate, listBooksPath} = this.props;
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to={listBooksPath}></Link>
          <div className="search-books-input-wrapper">
            {/*
              NOTES: The search from BooksAPI is limited to a particular set of search terms.
              You can find these search terms here:
              https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

              However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
              you don't find a specific author or title. Every search is limited by search terms.
            */}
            <input
              type="text"
              value={this.state.query}
              placeholder="Search by title or author"
              onChange={ e => this.handleQueryChange(e, books) }
            />
          </div>
        </div>
        <div className="search-books-results">
          <ListBooks
            books={this.state.queriedBooks}
            onBookUpdate={onBookUpdate}
            availableBookshelves={bookshelves}
          />
        </div>
      </div>
    );
  }
}

export default AddBook;
