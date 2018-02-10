import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Book extends Component {
  static propTypes = {
    bookData: PropTypes.object.isRequired,
    onBookUpdate: PropTypes.func.isRequired,
    availableBookshelves: PropTypes.array.isRequired
  }

  static coverWidth = 128
  static coverHeight = 193
  static noImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'

  render () {
    const {bookData, onBookUpdate, availableBookshelves} = this.props;

    return (
      <div className='book'>

        <div className='book-top'>
          <div
            className='book-cover'
            style={ ( () => {
              const style = {
                width: Book.coverWidth,
                height: Book.coverHeight
              };
              if (bookData.imageLinks && bookData.imageLinks.thumbnail) {
                style.backgroundImage = `url(${bookData.imageLinks.thumbnail})`;
              } else {
                style.backgroundImage = `url(${Book.noImageUrl})`;
                style.backgroundSize = Book.coverWidth;
                style.backgroundRepeat = 'no-repeat';
                style.backgroundPosition = 'center';
              }
              return style;
            })() }
          />
          <div className='book-shelf-changer'>
            <select
              value={bookData.shelf || 'none'}
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

        {bookData.title &&
          <div className='book-title'>{bookData.title}</div>
        }

        {bookData.authors && bookData.authors.map( author => (
          <div key={author} className='book-authors'>{author}</div>
        ))}

      </div>
    );
  }
}

export default Book;
