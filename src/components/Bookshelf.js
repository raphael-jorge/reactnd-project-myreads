import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ListBooks from './ListBooks';

class Bookshelf extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    books: PropTypes.array.isRequired,
    onBookUpdate: PropTypes.func.isRequired,
    availableBookshelves: PropTypes.array.isRequired
  }

  render() {
    const {title, books, onBookUpdate, availableBookshelves} = this.props;

    return (
      <div className='bookshelf'>

        <h2 className='bookshelf-title'>{title}</h2>

        <div className='bookshelf-books'>
          <ListBooks
            books={books}
            onBookUpdate={onBookUpdate}
            availableBookshelves={availableBookshelves}
          />
        </div>

      </div>
    )
  }
}

export default Bookshelf;
