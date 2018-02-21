import React from 'react';
import { mount } from 'enzyme';

import Experiment from '../../src/CoreExperiment.jsx';
import Variant from '../../src/Variant.jsx';
import emitter from '../../src/emitter.jsx';

describe('Variant', () => {
  it('should render text nodes', () => {
    const variantTextA = 'variantTextA';
    const variantTextB = 'variantTextB';

    const wrapper = mount(
      <Experiment name="text-nodes" value="A">
        <Variant name="A">{variantTextA}</Variant>
        <Variant name="B">{variantTextB}</Variant>
      </Experiment>
    );

    expect(
      wrapper
        .find(Variant)
        .at(0)
        .text()
    ).toBe(variantTextA);
  });

  it('should render components', () => {
    const wrapper = mount(
      <Experiment name="components" value="A">
        <Variant name="A">
          <div id="variant-a" />
        </Variant>
        <Variant name="B">
          <div id="variant-b" />
        </Variant>
      </Experiment>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render arrays of components', () => {
    const wrapper = mount(
      <Experiment name="array-of-elements" value="A">
        <Variant name="A">
          <div id="variant-a" />
          <div />
        </Variant>
        <Variant name="B">
          <div id="variant-b" />
          <div />
        </Variant>
      </Experiment>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
