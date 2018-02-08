import React from 'react'
// import * as BooksAPI from './BooksAPI'
import books from './books';
import ListBookshelves from './components/ListBookshelves';
import AddBook from './components/AddBook'
import './App.css'

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false
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

  showSearchPage = () => this.setState({ showSearchPage: true });

  showIndexPage = () => this.setState({ showSearchPage: false });

  render() {
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <AddBook
            onListBooks={this.showIndexPage}
          />
        ) : (
          <ListBookshelves
            books={books}
            bookshelves={this.bookshelves}
            onAddBook={this.showSearchPage}
          />
        )}
      </div>
    )
  }
}

export default BooksApp
