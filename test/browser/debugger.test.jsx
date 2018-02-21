import React from 'react';
import ReactDOM from 'react-dom';
import UUID from 'uuid/v4';
import { mount } from 'enzyme';

import Experiment from '../../src/CoreExperiment.jsx';
import Variant from '../../src/Variant.jsx';
import experimentDebugger from '../../src/debugger.jsx';
import emitter from '../../src/emitter.jsx';

describe('Debugger', () => {
  it('should enable and disable.', () => {
    const wrapper = mount(
      <Experiment name={UUID()} value="A">
        <Variant name="A">
          <div id="variant-a" />
        </Variant>
      </Experiment>
    );
    const getDebugger = () => document.getElementById('pushtell-debugger');

    expect(getDebugger()).toBeNull();

    experimentDebugger.enable();
    expect(getDebugger()).toBeDefined();

    experimentDebugger.disable();
    expect(getDebugger()).toBeNull();
  });

  it('should add and remove style rules', () => {
    experimentDebugger.enable();
    expect(hasCSSSelector('#pushtell-debugger')).toBe(true);
    experimentDebugger.disable();
    expect(hasCSSSelector('#pushtell-debugger')).toBe(false);
  });

  it("should change an experiment's value.", () => {
    const wrapper = mount(
      <Experiment name={UUID()} value="A">
        <Variant name="A">
          <div id="variant-a" />
        </Variant>
        <Variant name="B">
          <div id="variant-a" />
        </Variant>
      </Experiment>
    );

    experimentDebugger.enable();

    expect(wrapper.find('#variant-a').exists());
    expect(!wrapper.find('#variant-b').exists());

    document.querySelector('#pushtell-debugger div.pushtell-handle').click();

    const radioButtonA = document.querySelector(
      "#pushtell-debugger input[value='A']"
    );
    const radioButtonB = document.querySelector(
      "#pushtell-debugger input[value='B']"
    );
    expect(radioButtonA.checked).toBe(true);
    radioButtonB.click();

    expect(!wrapper.find('#variant-a').exists());
    expect(wrapper.find('#variant-b').exists());

    experimentDebugger.disable();
  });
});

// See http://stackoverflow.com/a/985070
function hasCSSSelector(s) {
  if (!document.styleSheets) {
    return '';
  }
  s = s.toLowerCase();
  var A,
    temp,
    n = document.styleSheets.length,
    SA = [];
  for (let i = 0; i < document.styleSheets.length; i++) {
    let sheet = document.styleSheets[i];
    let rules = sheet.rules ? sheet.rules : sheet.cssRules;
    for (let j = 0; j < rules.length; j++) {
      let selector = rules[j].selectorText
        ? rules[j].selectorText
        : rules[j].toString();
      if (selector.toLowerCase() === s) {
        return true;
      }
    }
  }
  return false;
}
