import { renderComponent , expect } from '../test_helper';
import Search_bar from '../../src/components/search_bar';

describe('Search_bar' , () => {
  let component;

  beforeEach(() => {
    component = renderComponent(Search_bar);
  });

  it('renders something', () => {
    expect(component).to.exist;
  });
});
