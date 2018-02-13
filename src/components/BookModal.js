import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import ListBooks from './ListBooks';

export default class BookModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    mainAppSelector: PropTypes.string.isRequired,
    onModalClose: PropTypes.func.isRequired,
    bookData: PropTypes.object.isRequired,
    bookshelves: PropTypes.array.isRequired,
    onShelfUpdate: PropTypes.func.isRequired
  }

  componentDidMount() {
    ReactModal.setAppElement(this.props.mainAppSelector);
  }

  render() {
    const {
      isOpen,
      onModalClose,
      bookData,
      bookshelves,
      onShelfUpdate
    } = this.props;

    return (
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onModalClose}
        className={{
          base: 'modal-content',
          afterOpen: 'modal-content',
          beforeClose: 'modal-content'
        }}
        overlayClassName={{
          base: 'modal-overlay',
          afterOpen: 'modal-overlay',
          beforeClose: 'modal-overlay'
        }}
      >
        {/* Fechar Modal */}
        <button className="modal-header-close" onClick={onModalClose}>
          Close
        </button>

        {/* Exibe o componente book */}
        <ListBooks
          books={[bookData]}
          onShelfUpdate={onShelfUpdate}
          availableBookshelves={bookshelves}
          loadingBooks={false}
        />

        <hr/>

        {/* Descrição do livro, se disponível */}
        {bookData.description &&
          <div className="modal-description">
            <p>{bookData.description}</p>
            <hr/>
          </div>
        }

        {/* Informações adicionais, se disponíveis */}
        <ul className="modal-info">
          {bookData.publisher &&
            <li><strong>Publisher: </strong>{bookData.publisher}</li>
          }
          {bookData.publishedDate &&
            <li><strong>Published on: </strong>{bookData.publishedDate}</li>
          }
          {bookData.pageCount &&
            <li><strong>Pages: </strong>{bookData.pageCount}</li>
          }
          {bookData.language &&
            <li><strong>Language: </strong>{bookData.language.toUpperCase()}</li>
          }
          {bookData.categories &&
            <li><strong>Categories: </strong>{bookData.categories.join(', ')}</li>
          }
          {bookData.shelf && bookData.shelf !== 'none' &&
            <li>
              <strong>On Shelf: </strong>
              {bookshelves.filter(shelf => (shelf.name === bookData.shelf))[0].title}
            </li>
          }
        </ul>

        <hr/>

        {/* Links para ver mais informações sobre o livro, se o site estiver disponível,
        e para dechar o Modal*/}
        <div className="modal-buttons">
          {bookData.infoLink &&
            <a href={bookData.infoLink} target="_blank">
              <button>More</button>
            </a>
          }
          <button onClick={onModalClose}>Close</button>
        </div>

      </ReactModal>
    );
  }
}
