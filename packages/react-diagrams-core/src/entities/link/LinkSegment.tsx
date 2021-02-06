import * as React from 'react';
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/core';
import { LinkModel } from './LinkModel';

namespace S {
  export const Keyframes = keyframes`
		from {
			stroke-dashoffset: 24;
		}
		to {
			stroke-dashoffset: 0;
		}
	`;

  const selected = css`
    stroke-dasharray: 10, 2;
    animation: ${Keyframes} 1s linear infinite;
  `;

  export const Path = styled.path<{ selected: boolean }>`
    ${(p) => p.selected && selected};
    fill: none;
    pointer-events: all;
  `;
}

type Props = {
  model: LinkModel;
  selected: boolean;
  path: string;
};
export const LinkSegment: React.FC<Props> = ({ model, selected, path }) => (
  <S.Path
    d={path}
    selected={selected}
    stroke={
      selected ? model.getOptions().selectedColor : model.getOptions().color
    }
    strokeWidth={model.getOptions().width}
  />
);
