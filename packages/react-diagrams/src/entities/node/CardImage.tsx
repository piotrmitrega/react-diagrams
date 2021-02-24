import React from 'react';

import { CardType } from './CardType';

import OneImage from '../../../assets/one.svg';
import TwoImage from '../../../assets/two.svg';
import ThreeImage from '../../../assets/three.svg';

type Props = {
  className?: string;
  type: CardType;
};

export const CardImage: React.FC<Props> = React.memo(({ className, type }) => {
  switch (type) {
    case CardType.ONE:
      return <OneImage className={className} />;

    case CardType.TWO:
      return <TwoImage className={className} />;

    case CardType.THREE:
      return <ThreeImage className={className} />;

    default:
      return null;
  }
});
