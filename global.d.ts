/// <reference types="react" />

declare global {
  // We need to declare the JSX namespace since we use a custom JSX factory
  namespace JSX {
    type ElementType = React.JSX.ElementType;
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
    interface Element extends React.JSX.Element {}
    interface ElementClass extends React.JSX.ElementClass {}
    interface ElementAttributesProperty
      extends React.JSX.ElementAttributesProperty {}
    interface ElementChildrenAttribute
      extends React.JSX.ElementChildrenAttribute {}
    // No LibraryManagedAttributes, copying it as well breaks typing
  }
}

export {};
