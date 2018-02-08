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
    BooksAPI.update(book, shelf).then( () => {
      this.setState( (prevState) => {
        // Update shelf on books state
        const updatedBooksState = prevState.books.map( b => {
          if (b.id === book.id) {
            b.shelf = shelf;
          }
          return b;
        });

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
            listBooksPath={'/'}
          />
        )}/>

      </div>
    )
  }
}

export default BooksApp
