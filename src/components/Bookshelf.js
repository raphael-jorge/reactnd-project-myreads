import React, {Component} from 'react';
import Book from './Book';

class Bookshelf extends Component {
  render() {
    const {title, books, availableBookshelves} = this.props;
    
    return (
      <div className='bookshelf'>

        <h2 className='bookshelf-title'>{title}</h2>

        <div className='bookshelf-books'>
          <ol className='books-grid'>
            {books.map( (book, idx) => (
              <li key={idx}>
                <Book
                  bookData={book}
                  availableBookshelves={availableBookshelves}
                />
              </li>
            ))}
          </ol>
        </div>

      </div>
    )
  }
}

export default Bookshelf;
