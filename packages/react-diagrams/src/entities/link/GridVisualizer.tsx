// position: absolute;
// width: 100%;
// display: flex;
// height: 100%;
// flex-wrap: wrap;
// pointer-events: none;

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from '@emotion/styled';

export default (element, grid: number[][]) => {
  ReactDOM.render(<GridVisualizer grid={grid} />, element);
};

namespace S {
  export const GridContainer = styled.div`
    position: absolute;
    width: calc(100% + 5px);
    display: flex;
    height: 100%;
    flex-wrap: wrap;
    pointer-events: none;
  `;

  export const Row = styled.div`
    flex: 0 0 100%;
    display: flex;
  `;

  export const Cell = styled.div<{ color: string }>`
    flex: 0 0 5px;
    background-color: ${(p) => p.color};
    opacity: 0.2;
  `;
}

type Props = {
  grid: number[][];
};

const GridVisualizer: React.FC<Props> = ({ grid }) => {
  const cells = grid.map((row, y) => (
    <S.Row id={String(y)} key={y}>
      {row.map((column, x) => (
        <S.Cell
          color={Boolean(grid[y][x]) ? 'red' : 'green'}
          id={String(x)}
          key={x}
        />
      ))}
    </S.Row>
  ));

  return <S.GridContainer>{cells}</S.GridContainer>;
};
