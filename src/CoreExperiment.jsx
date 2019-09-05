import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import useExperiment from "./hooks";
import emitter from "./emitter";

const filterVariants = (name, children) => {
  let variants = {};
  React.Children.forEach(children, (element) => {
    if (
      !React.isValidElement(element) ||
      element.type.displayName !== "Pushtell.Variant"
    ) {
      let error = new Error(
        "Pushtell Experiment children must be Pushtell Variant components."
      );
      error.type = "PUSHTELL_INVALID_CHILD";
      throw error;
    }
    variants[element.props.name] = element;
    emitter.addExperimentVariant(name, element.props.name);
  });
  emitter.emit("variants-loaded", name);
  return variants;
};

const CoreExperiment = (props) => {
  const variants = useMemo(() => {
    return filterVariants(props.name, props.children);
  }, [props.name, props.children]);

  const { selectVariant } = useExperiment(
    props.name,
    props.userIdentifier,
    props.defaultVariantName
  );

  return selectVariant(variants, []);
};

export default CoreExperiment;
