import { describe, it, expect } from 'vitest';
import { DOMWrapper, mount, type VueWrapper } from '@vue/test-utils';
import Input, { type InputProps } from './Input.vue';

interface VModelProps {
  modelValue: string;
}

/**
 * Creates wrapper for component to test
 * @param props Props for component
 * @returns wrapper
 */
function createWrapper(props: InputProps & VModelProps): VueWrapper<InputProps & VModelProps> {
  const wrapper = mount(Input, {
    props: {
      'onUpdate:modelValue': (newValue: string) => wrapper.setProps({ modelValue: newValue }),
      ...props,
    },
  });
  return wrapper;
}

describe('Input.vue', () => {
  it('displays correctly', () => {
    const wrapper = createWrapper({ id: 'test-input', label: 'Test input', modelValue: '' });
    const label = wrapper.find('label.field__label');
    const input: DOMWrapper<HTMLInputElement> = wrapper.find('input.field__input');

    expect(label.text()).toBe('Test input');
    expect(input.attributes('id')).toBe('test-input');
    expect(input.element.value).toBe('');
  });

  it('displays default value correct', () => {
    const wrapper = createWrapper({
      id: 'test-input',
      label: 'Test input',
      modelValue: 'default value',
    });
    const input: DOMWrapper<HTMLInputElement> = wrapper.find('input.field__input');

    expect(input.element.value).toBe('default value');
  });

  it('displays placeholder', () => {
    const wrapper = createWrapper({
      id: 'test-input',
      label: 'Test input',
      modelValue: '',
      placeholder: 'Test placeholder',
    });
    const input: DOMWrapper<HTMLInputElement> = wrapper.find('input.field__input');

    expect(input.element.placeholder).toBe('Test placeholder');
  });

  it('displays sub-label', () => {
    const wrapper = createWrapper({
      id: 'test-input',
      label: 'Test input',
      modelValue: '',
      subLabel: 'Test sub-label',
    });
    const subLabel = wrapper.find('span.field__sub-label');

    expect(subLabel.text()).toBe('Test sub-label');
  });

  it('displays sub-label', () => {
    const wrapper = createWrapper({
      id: 'test-input',
      label: 'Test input',
      modelValue: '',
      errorMessage: 'Test error message',
    });
    const errorElem = wrapper.find('span.field__sub-label--error');

    expect(errorElem.text()).toBe('Test error message');
  });

  it('assigns type', async () => {
    const wrapper = createWrapper({
      id: 'test-input',
      label: 'Test input',
      modelValue: '',
      type: 'text',
    });

    let input: DOMWrapper<HTMLInputElement> = wrapper.find('input.field__input');
    expect(input.attributes('type')).toBe('text');

    await wrapper.setProps({ type: 'email' });
    input = wrapper.find('input.field__input');
    expect(input.attributes('type')).toBe('email');

    await wrapper.setProps({ type: 'password' });
    input = wrapper.find('input.field__input');
    expect(input.attributes('type')).toBe('password');
  });

  it('disables input by prop.disable', async () => {
    const wrapper = createWrapper({
      id: 'test-input',
      label: 'Test input',
      modelValue: '',
      disabled: false,
    });

    let input: DOMWrapper<HTMLInputElement> = wrapper.find('input.field__input');
    expect(input.attributes()).not.toContain('disabled');

    input = wrapper.find('input.field__input');
    await wrapper.setProps({ disabled: true });
    expect(Object.keys(input.attributes())).toContain('disabled');
  });

  it('assigns classes from props', () => {
    const classes = {
      field: 'test-field-class',
      input: 'test-input-class',
      label: 'test-label-class',
      subLabel: 'test-sub-label-class',
      errorMessage: 'test-error-message-class',
    };

    const wrapper = createWrapper({
      id: 'test-input',
      label: 'Test input',
      modelValue: '',
      subLabel: 'Test sub-label',
      errorMessage: 'Test error message',
      classes,
    });

    const field = wrapper.find('div.field');
    const label = wrapper.find('label.field__label');
    const input = wrapper.find('input.field__input');
    const errorMessage = wrapper.find('span.field__sub-label--error');
    const subLabel = wrapper.find('span.field__sub-label:not(span.field__sub-label--error)');

    expect(field.classes()).toContain(classes.field);
    expect(label.classes()).toContain(classes.label);
    expect(input.classes()).toContain(classes.input);
    expect(errorMessage.classes()).toContain(classes.errorMessage);
    expect(subLabel.classes()).toContain(classes.subLabel);
  });

  it('emits focus event', async () => {
    const wrapper = createWrapper({
      id: 'test-input',
      label: 'Test input',
      modelValue: '',
    });
    const input: DOMWrapper<HTMLInputElement> = wrapper.find('input.field__input');

    await input.trigger('focus');
    expect(wrapper.emitted('focus')![0][0]).toBeDefined();
    expect(wrapper.emitted('focus')![0][0]).toBeInstanceOf(FocusEvent);
  });

  it('emits focus event', async () => {
    const wrapper = createWrapper({
      id: 'test-input',
      label: 'Test input',
      modelValue: '',
    });
    const input: DOMWrapper<HTMLInputElement> = wrapper.find('input.field__input');

    await input.trigger('blur');
    expect(wrapper.emitted('blur')![0][0]).toBeDefined();
    expect(wrapper.emitted('blur')![0][0]).toBeInstanceOf(FocusEvent);
  });

  it('updates model when value is entered', async () => {
    const wrapper = createWrapper({
      id: 'test-input',
      label: 'Test input',
      modelValue: '',
    });
    const input: DOMWrapper<HTMLInputElement> = wrapper.find('input.field__input');

    await input.setValue('test value');
    let modelValueProp = (wrapper.props() as VModelProps).modelValue;
    expect(modelValueProp).toBe('test value');

    await input.setValue('');
    modelValueProp = (wrapper.props() as VModelProps).modelValue;
    expect(modelValueProp).toBe('');
  });
});
