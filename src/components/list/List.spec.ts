import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import List from './List.vue';
import type { ListHeader, ListItem, ListProps } from './List.vue';

describe('List.vue', () => {
  const headers: ListHeader[] = [
    {
      id: 'test-header-1',
      display: 'Test header 1',
      class: 'test-header-1',
    },
    {
      id: 'test-header-2',
      display: 'Test header 2',
      class: 'test-header-2',
    },
    {
      id: 'test-header-3',
      display: 'Test header 3',
      class: 'test-header-3',
    },
  ];

  const listItems: ListItem[][] = [
    [
      {
        id: 'test-list-item-1-1',
        display: 'Test list item 1-1',
        class: 'test-list-item-1-1',
      },
      {
        id: 'test-list-item-1-2',
        display: 'Test list item 1-2',
        class: 'test-list-item-1-2',
      },
      {
        id: 'test-list-item-1-3',
        display: 'Test list item 1-3',
        class: 'test-list-item-1-3',
      },
    ],
    [
      {
        id: 'test-list-item-2-1',
        display: 'Test list item 2-1',
        class: 'test-list-item-2-1',
      },
      {
        id: 'test-list-item-2-2',
        display: 'Test list item 2-2',
        class: 'test-list-item-2-2',
      },
      {
        id: 'test-list-item-2-3',
        display: 'Test list item 2-3',
        class: 'test-list-item-2-3',
      },
    ],
  ];

  /**
   * Create wrapper for testing
   * @param props to return
   * @returns wrapper
   */
  function createWrapper(props: ListProps): VueWrapper<ListProps> {
    const wrapper = mount(List, {
      props,
    });

    return wrapper;
  }

  it('displays simple list', () => {
    const wrapper = createWrapper({
      headers: headers,
      items: listItems,
    });

    const headerElems = wrapper.findAll('.list__headers-cell');
    headerElems.forEach((h, index) => {
      expect(h.attributes('id')).toBe(headers[index].id);
      expect(h.text()).toBe(headers[index].display);
    });
  });

  it('does not display list body when loading', async () => {
    const wrapper = createWrapper({
      headers: headers,
      items: listItems,
      isLoading: false,
    });

    let listBody = wrapper.find('.list__body');
    expect(listBody.exists()).toBe(true);

    await wrapper.setProps({ isLoading: true });
    listBody = wrapper.find('.list__body');
    expect(listBody.exists()).toBe(false);
  });

  it('applies all classes', () => {
    const wrapper = createWrapper({
      headers: headers,
      items: listItems,
      class: 'list-1',
    });

    const list = wrapper.find('.list');
    expect(list.classes()).toContain('list-1');

    const headerElems = list.findAll('.list__headers-cell');
    headerElems.forEach((header, index) => {
      expect(header.classes()).toContain(headers[index].class);
    });

    const listRows = list.findAll('.list__row');
    listRows.forEach((row, rowIndex) => {
      const cells = row.findAll('.list__row-cel');
      cells.forEach((cell, cellIndex) => {
        expect(cell.classes()).toContain(listItems[rowIndex][cellIndex]);
      });
    });
  });
});
