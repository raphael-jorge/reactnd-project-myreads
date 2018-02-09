import React from 'react'
import {Route} from 'react-router-dom';
import * as BooksAPI from './BooksAPI';
import ListBookshelves from './components/ListBookshelves';
import AddBook from './components/AddBook'
import './App.css'

class BooksApp extends React.Component {
  state = {
    books: []
  }

  bookshelves = [
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
  ];

  componentDidMount() {
    BooksAPI.getAll().then(books => this.setState({books}));
  }

  updateBook = (book, shelf) => {
    // Atualiza o book na api
    BooksAPI.update(book, shelf).then( () => {
      // depois atualiza o state books
      this.setState( (prevState) => {
        let updatedBooksState = prevState.books;

        // Procura o livro no state books
        const booksIds = prevState.books.map( book => book.id );
        const bookIdx = booksIds.indexOf(book.id);

        if (bookIdx !== -1) {
          // Se achar, atualiza a shelf do livro no state
          updatedBooksState[bookIdx].shelf = shelf;
        } else {
          // Se não achar, atualiza a shelf do livro e o insere no state
          book.shelf = shelf;
          updatedBooksState.push(book);
        }
        return {books: updatedBooksState};
      });
    });
  }

  render() {
    return (
      <div className="app">

        <Route exact path='/' render={ () => (
          <ListBookshelves
            books={this.state.books}
            bookshelves={this.bookshelves}
            onBookUpdate={this.updateBook}
            addBookPath={'/search'}
          />
        )}/>

        <Route exact path='/search' render={ () => (
          <AddBook
            books={this.state.books}
            bookshelves={this.bookshelves}
            onBookUpdate={this.updateBook}
            listBooksPath={'/'}
          />
        )}/>

      </div>
    )
  }
}

export default BooksApp
