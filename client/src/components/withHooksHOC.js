import React from 'react';
import useWindowSize from "./useWindowSize";

export const withHooksHOC = (Component: any) => {
  return (props: any) => {
    const WindowSize = useWindowSize();
    const width = WindowSize.width

    return <Component width={width} {...props} />;
  };
};