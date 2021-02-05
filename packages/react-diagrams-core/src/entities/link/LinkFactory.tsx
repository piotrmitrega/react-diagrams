import * as React from 'react';
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/core';
import { AbstractReactFactory } from '@piotrmitrega/react-canvas-core';
import { DiagramEngine } from '../../DiagramEngine';
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

export abstract class LinkFactory<
  Link extends LinkModel = LinkModel
> extends AbstractReactFactory<Link, DiagramEngine> {
  protected constructor(type: string) {
    super(type);
  }

  abstract generateReactWidget(event): JSX.Element;

  abstract generateModel(event): Link;

  generateLinkSegment(model: Link, selected: boolean, path: string) {
    return (
      <S.Path
        d={path}
        selected={selected}
        stroke={
          selected ? model.getOptions().selectedColor : model.getOptions().color
        }
        strokeWidth={model.getOptions().width}
      />
    );
  }
}
