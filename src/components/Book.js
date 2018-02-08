import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Book extends Component {
  static propTypes = {
    bookData: PropTypes.object.isRequired,
    onBookUpdate: PropTypes.func.isRequired,
    availableBookshelves: PropTypes.array.isRequired
  }

  render () {
    const {bookData, onBookUpdate, availableBookshelves} = this.props;

    return (
      <div className='book'>

        <div className='book-top'>
          <div
            className='book-cover'
            style={{
              width: 128,
              height: 193,
              backgroundImage: `url(${bookData.imageLinks.thumbnail})`
            }}
          />
          <div className='book-shelf-changer'>
            <select
              value={bookData.shelf}
              onChange={ event => onBookUpdate(bookData, event.target.value) }
            >
              <option value="none" disabled>Move to...</option>
              {availableBookshelves.map( bookshelf => (
                <option key={bookshelf.name} value={bookshelf.name}>
                  {bookshelf.title}
                </option>
              ))}
              <option value="none">None</option>
            </select>
          </div>
        </div>

        <div className='book-title'>{bookData.title}</div>

        {bookData.authors.map( author => (
          <div key={author} className='book-authors'>{author}</div>
        ))}

      </div>
    );
  }
}

export default Book;
