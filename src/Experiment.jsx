import React, {Component} from "react";
import PropTypes from 'prop-types';
import CoreExperiment from "./CoreExperiment";
import emitter from "./emitter";
import store from './store';
import calculateActiveVariant from './calculateActiveVariant';

emitter.addActiveVariantListener(function (experimentName, variantName, skipSave) {
  if (skipSave) {
    return;
  }
  store.setItem('PUSHTELL-' + experimentName, variantName);
});

export default class Experiment extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    defaultVariantName: PropTypes.string,
    userIdentifier: PropTypes.string
  };

  static displayName = "Pushtell.Experiment";

  win = () => {
    emitter.emitWin(this.props.name);
  };


  getActiveVariant = () => {
    return calculateActiveVariant(this.props.name, this.props.userIdentifier, this.props.defaultVariantName);
  }

  render() {
    return <CoreExperiment {...this.props} value={this.getActiveVariant}/>;
  }
}
