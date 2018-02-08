import React from 'react'
// import * as BooksAPI from './BooksAPI'
import {Route} from 'react-router-dom';
import books from './books';
import ListBookshelves from './components/ListBookshelves';
import AddBook from './components/AddBook'
import './App.css'

class BooksApp extends React.Component {
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

  render() {
    return (
      <div className="app">

        <Route exact path='/' render={ () => (
          <ListBookshelves
            books={books}
            bookshelves={this.bookshelves}
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
