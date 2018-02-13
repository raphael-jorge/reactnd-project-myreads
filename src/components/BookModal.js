import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import ListBooks from './ListBooks';

/**
 * @description Modal para exibir as informações de um livro. Requer os
 * módulos React, PropTypes e React Modal.
 * @extends React.Component
 * @exports BookModal
 */
export default class BookModal extends Component {
  static propTypes = {
    // Indica se o modal deve ser exibido.
    isOpen: PropTypes.bool.isRequired,
    // Seletor css do conteúdo principal da página onde o modal é renderizado.
    mainAppSelector: PropTypes.string.isRequired,
    // A função a ser chamada para fechar o modal.
    onModalClose: PropTypes.func.isRequired,
    // Os dados do livro a ser exibido no modal.
    bookData: PropTypes.object.isRequired,
    // As prateleiras disponíveis.
    bookshelves: PropTypes.array.isRequired,
    // A função a ser chamada quando o parâmetro shelf de um livro é modificado.
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
        e para fechar o Modal*/}
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
