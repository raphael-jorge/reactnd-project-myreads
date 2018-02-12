import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Book extends Component {
  static propTypes = {
    bookData: PropTypes.object.isRequired,
    onShelfUpdate: PropTypes.func.isRequired,
    onBookClick: PropTypes.func,
    availableBookshelves: PropTypes.array.isRequired
  }

  static blockShelfChange = e => e.preventDefault()

  onShelfChange = (event, bookData, onShelfUpdate) => {

    const setLoading = () => {
      // Mostra o ícone de loading
      event.target.parentNode.classList.add('loading')
      // Bloqueia o acesso ao dropdown
      event.target.addEventListener('mousedown', Book.blockShelfChange);
    }

    const clearLoading = () => {
      // Remove o ícone de loading
      event.target.parentNode.classList.remove('loading');
      // Libera o acesso ao dropdown
      event.target.removeEventListener('mousedown', Book.blockShelfChange);
    }

    const newShelf = event.target.value;

    setLoading();
    onShelfUpdate(bookData, newShelf)
    .then(clearLoading)
    .catch(clearLoading);
  }

  render () {
    const {
      bookData,
      onShelfUpdate,
      onBookClick,
      availableBookshelves
    } = this.props;

    const hasImageLink = bookData.imageLinks && bookData.imageLinks.thumbnail;

    // Configura o estilo do cover
    const bookCoverStyle = {};
    if (hasImageLink) {
      bookCoverStyle.backgroundImage = `url(${bookData.imageLinks.thumbnail})`;
    }
    if (onBookClick) {
      bookCoverStyle.cursor = 'pointer';
    }

    return (
      <div className='book'>

        <div className='book-top'>
          <div
            className={`book-cover ${ !hasImageLink && 'book-cover-no-image'}`}
            onClick={onBookClick && (() => onBookClick(bookData))}
            style={bookCoverStyle}
          />
          <div className='book-shelf-changer'>
            <select
              value={bookData.shelf || 'none'}
              onChange={ event => {
                event.persist();
                this.onShelfChange(event, bookData, onShelfUpdate);
              }}
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
