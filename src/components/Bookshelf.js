import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ListBooks from './ListBooks';

export default class Bookshelf extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    books: PropTypes.array.isRequired,
    onShelfUpdate: PropTypes.func.isRequired,
    onBookClick: PropTypes.func,
    availableBookshelves: PropTypes.array.isRequired,
    loadingBooks: PropTypes.bool
  }

  render() {
    const {
      title,
      books,
      onShelfUpdate,
      onBookClick,
      availableBookshelves,
      loadingBooks
    } = this.props;

    return (
      <div className="bookshelf">

        <h2 className="bookshelf-title">{title}</h2>

        <div className="bookshelf-books">
          <ListBooks
            books={books}
            onShelfUpdate={onShelfUpdate}
            onBookClick={onBookClick}
            availableBookshelves={availableBookshelves}
            loadingBooks={loadingBooks}
            noBooksMessage={'This Bookshelf is Empty'}
          />
        </div>

      </div>
    );
  }
}
