import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import type { ButtonProps } from './Button.vue';

describe('Button.vue', () => {
  /**
   * Mounts Button component
   * @param props Partial props of the button
   * @returns wrapper to button
   */
  async function createWrapper(props?: ButtonProps) {
    const component = await import('./Button.vue');
    return mount(component.default, {
      props,
      slots: {
        default: 'Test button',
      },
    });
  }

  it('displays default correctly', async () => {
    const wrapper = await createWrapper();
    const button = wrapper.find('button.button');

    expect(button.exists()).toBe(true);
    expect(button.text()).toEqual('Test button');
  });

  it('shows loader when prop isLoading is set', async () => {
    const wrapper = await createWrapper({ isLoading: false });
    const button = wrapper.find('button.button');
    let loader = button.find('.button__loader');

    expect(loader.exists()).toBe(false);

    await wrapper.setProps({ isLoading: true });

    loader = button.find('.button__loader');
    expect(loader.exists()).toBe(true);
  });

  it('is disabled when prop disabled is set', async () => {
    const wrapper = await createWrapper();
    const button = wrapper.find('button.button');

    await wrapper.setProps({ disabled: true });

    expect(button.attributes()).not.toContain('disabled');
  });

  it('is set to size small', async () => {
    const wrapper = await createWrapper();
    const button = wrapper.find('button.button');

    expect(button.classes()).not.toContain('button--small');
    await wrapper.setProps({ size: 'small' });
  });

  it('emits click event', async () => {
    const wrapper = await createWrapper();
    let button = wrapper.find('button.button');

    await button.trigger('click');
    let emitted = wrapper.emitted('click');

    expect(emitted).toBeDefined();
    if (emitted) expect(emitted[0][0]).toBeInstanceOf(MouseEvent);

    await wrapper.setProps({ type: 'icon', icon: 'icon-string' });
    button = wrapper.find('button.button');

    await button.trigger('click');
    emitted = wrapper.emitted('click');

    expect(emitted).toBeDefined();
    if (emitted) expect(emitted[1][0]).toBeInstanceOf(MouseEvent);
  });

  it('throws error if type is icon but no icon is given', async () => {
    try {
      await createWrapper();
    } catch (err) {
      expect((err as Error).message).toBe('Button type is icon but icon is not set');
    }
  });
});
