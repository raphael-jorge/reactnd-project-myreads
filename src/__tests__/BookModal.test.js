import React from 'react';
import {shallow} from 'enzyme';
import BookModal from '../components/BookModal';

jest.mock('react-modal');

const setup = propOverrides => {
  const props = Object.assign({
    isOpen: true,
    mainAppSelector: '',
    onModalClose: () => {},
    bookData: {},
    bookshelves: [],
    onShelfUpdate: () => {}
  }, propOverrides);

  const modal = shallow(<BookModal {...props} />);

  return {
    props,
    modal
  };
};

describe('<BookModal />', () => {

  it('renders a ListBooks component', () => {
    const {modal} = setup();
    expect(modal.find('ListBooks').length).toBe(1);
  });


  it('calls prop onModalClose once it is closed', () => {
    const onModalClose = jest.fn();
    const {modal} = setup({onModalClose});

    modal.find('.modal-header-close').simulate('click');
    expect(onModalClose).toHaveBeenCalled();
    onModalClose.mockClear();

    modal.find('.modal-buttons button').last().simulate('click');
    expect(onModalClose).toHaveBeenCalled();
  });


  it('renders a book description if one is available', () => {
    // Nenhuma descrição fornecida
    const {modal} = setup();
    expect(modal.find('.modal-description').length).toBe(0);

    // Com descrição
    const description = 'book description for test';
    modal.setProps({bookData: {description}});
    expect(modal.find('.modal-description p').text()).toBe(description);
  });


  it('renders an external link to more information if the link is available', () => {
    // Nenhum link disponível
    const {modal} = setup();
    expect(modal.find('.modal-buttons a').length).toBe(0);

    // Link disponível
    const link = 'testLink';
    const bookData = {infoLink: link};
    modal.setProps({bookData});
    expect(modal.find('.modal-buttons a').length).toBe(1);
    expect(modal.find('.modal-buttons a').prop('href')).toBe(link);
  });


  describe('additional book information', () => {
    const additionalInfo = '.modal-info li';

    it('list additional valid book information if available', () => {
      // Nenhuma informação adicional
      const {modal} = setup();
      expect(modal.find(additionalInfo).length).toBe(0);

      // Com informações adicionais
      const bookData = {
        publisher: 'test',
        publishedDate: 'test',
        pageCount: 'test',
        language: 'test',
        categories: ['test']
      };
      const bookDataLength = Object.keys(bookData).length;

      modal.setProps({bookData});
      expect(modal.find(additionalInfo).length).toBe(bookDataLength);
    });

    it('list current shelf if it is not set to none', () => {
      // Shelf não configurado
      const {modal} = setup();
      expect(modal.find('.modal-info li').length).toBe(0);

      // Configura uma prateleira e o parâmetro shelf do livro para none
      const bookshelves = [{
        name: 'testShelf',
        title: 'testShelf'
      }];
      let bookData = {
        shelf: 'none'
      };
      modal.setProps({bookshelves, bookData});
      expect(modal.find('.modal-info li').length).toBe(0);

      // Configura o parâmetro shelf do livro para a prateleira criada
      bookData = {
        shelf: 'testShelf'
      };
      modal.setProps({bookData});
      expect(modal.find('.modal-info li').length).toBe(1);
    });
  });
});
