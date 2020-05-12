import React from 'react';
import ReactDOM from 'react-dom';
import UUID from 'uuid/v4';
import { mount } from 'enzyme';

import Experiment from '../../src/Experiment.jsx';
import Variant from '../../src/Variant.jsx';
import emitter from '../../src/emitter.jsx';

describe('Experiment', function() {
  afterEach(function() {
    emitter._reset();
  });

  it('should choose a version', () => {
    const experimentName = UUID();
    const variantNames = [];
    for (let i = 0; i < 100; i++) {
      variantNames.push(UUID());
    }

    const wrapper = mount(
      <Experiment name={experimentName}>
        {variantNames.map(name => {
          return (
            <Variant key={name} name={name}>
              <div id={'variant-' + name} />
            </Variant>
          );
        })}
      </Experiment>
    );

    expect(wrapper.find(Variant).length).toBe(1);
  });

  it('should render the correct variant', () => {
    const experimentName = UUID();
    const variantNames = [];
    for (let i = 0; i < 100; i++) {
      variantNames.push(UUID());
    }
    const defaultVariantName =
      variantNames[Math.floor(Math.random() * variantNames.length)];

    const AppWithDefaultVariantName = () => (
      <Experiment name={experimentName} defaultVariantName={defaultVariantName}>
        {variantNames.map(name => {
          return (
            <Variant key={name} name={name}>
              <div id={'variant-' + name} />
            </Variant>
          );
        })}
      </Experiment>
    );

    const AppWithoutDefaultVariantName = () => (
      <Experiment name={experimentName}>
        {variantNames.map(name => {
          return (
            <Variant key={name} name={name}>
              <div id={'variant-' + name} />
            </Variant>
          );
        })}
      </Experiment>
    );

    let wrapper = mount(<AppWithDefaultVariantName />);
    expect(wrapper.find(`#variant-${defaultVariantName}`).exists()).toBe(true);

    wrapper = mount(<AppWithoutDefaultVariantName />);
    expect(wrapper.find(`#variant-${defaultVariantName}`).exists()).toBe(true);
  });

  it('should error if variants are added to a experiment after a variant was selected', () => {
    const experimentName = UUID();
    mount(
      <Experiment name={experimentName} value="A">
        <Variant name="A">
          <div id="variant-a" />
        </Variant>
        <Variant name="B">
          <div id="variant-b" />
        </Variant>
      </Experiment>
    );

    // Suppress React's error boundary logs
    spyOn(console, 'error');
    expect(() =>
      mount(
        <Experiment name={experimentName} value="A">
          <Variant name="C">
            <div id="variant-c" />
          </Variant>
          <Variant name="D">
            <div id="variant-d" />
          </Variant>
        </Experiment>
      )
    ).toThrowError('', 'PUSHTELL_INVALID_VARIANT');
  });

  it('should not error if variants are added to a experiment after a variant was selected if variants were defined', () => {
    const experimentName = UUID();
    emitter.defineVariants(experimentName, ['A', 'B', 'C', 'D']);

    let experimentRef = React.createRef();
    mount(
      <Experiment ref={experimentRef} name={experimentName}>
        <Variant name="A">
          <a id="variant-a" href="#A">
            A
          </a>
        </Variant>
        <Variant name="B">
          <a id="variant-b" href="#B">
            B
          </a>
        </Variant>
      </Experiment>
    );

    mount(
      <Experiment ref={experimentRef} name={experimentName}>
        <Variant name="C">
          <a id="variant-c" href="#C">
            C
          </a>
        </Variant>
        <Variant name="D">
          <a id="variant-d" href="#D">
            D
          </a>
        </Variant>
      </Experiment>
    );
  });

  it('should error if a variant is added to an experiment after variants were defined', () => {
    const experimentName = UUID();
    emitter.defineVariants(experimentName, ['A', 'B', 'C']);

    mount(
      <Experiment name={experimentName}>
        <Variant name="A">
          <a id="variant-a" href="#A">
            A
          </a>
        </Variant>
        <Variant name="B">
          <a id="variant-b" href="#B">
            B
          </a>
        </Variant>
      </Experiment>
    );

    // Suppress React's error boundary logs

    spyOn(console, 'error');
    expect(() =>
      mount(
        <Experiment name={experimentName}>
          <Variant name="C">
            <a id="variant-c" href="#C">
              C
            </a>
          </Variant>
          <Variant name="D">
            <a id="variant-d" href="#D">
              D
            </a>
          </Variant>
        </Experiment>
      )
    ).toThrowError('', 'PUSHTELL_INVALID_VARIANT');
  });

  it('should not error if an older test variant is set', () => {
    const experimentName = UUID();
    localStorage.setItem('orexp-' + experimentName, 'C');

    mount(
      <Experiment name={experimentName}>
        <Variant name="A">
          <a id="variant-a" href="#A" onClick={this.onClickVariant}>
            A
          </a>
        </Variant>
        <Variant name="B">
          <a id="variant-b" href="#B" onClick={this.onClickVariant}>
            B
          </a>
        </Variant>
      </Experiment>
    );
  });

  it('should choose the same variant when a user identifier is defined', () => {
    const userIdentifier = UUID();
    const experimentName = UUID();
    const variantNames = [];
    for (let i = 0; i < 100; i++) {
      variantNames.push(UUID());
    }

    const App = () => (
      <Experiment name={experimentName} userIdentifier={userIdentifier}>
        {variantNames.map(name => {
          return (
            <Variant key={name} name={name}>
              <div id={'variant-' + name} />
            </Variant>
          );
        })}
      </Experiment>
    );

    // TODO: use spies
    let chosenVariant;
    emitter.once('play', function(experimentName, variantName) {
      chosenVariant = variantName;
    });

    mount(<App />);
    expect(chosenVariant).toBeDefined();

    for (let i = 0; i < 100; i++) {
      emitter._reset();
      localStorage.clear();
      const wrapper = mount(<App />);
      expect(wrapper.find(`#variant-${chosenVariant}`).exists()).toBe(true);
    }
  });
});
