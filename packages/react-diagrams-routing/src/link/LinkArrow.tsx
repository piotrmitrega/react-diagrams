import * as React from 'react';

import { Point } from '@piotrmitrega/geometry';

type Props = {
	point: Point;
	previousPoint: Point;
}

export const LinkArrow: React.FC<Props> = (props) => {
	const { point, previousPoint } = props;

	const angle =
		90 +
		(Math.atan2(
			previousPoint.y - point.y,
			previousPoint.x - point.x
			) *
			180) /
		Math.PI;

	console.log(props);
	//translate(50, -10),
	return (
		<g className="arrow" transform={'translate(' + previousPoint.x + ', ' + previousPoint.y + ')'}>
			<g style={{ transform: 'rotate(' + angle + 'deg)' }}>
				<g transform={'translate(0, -3)'}>
					<polygon points="0,10 8,30 -8,30" />
				</g>
			</g>
		</g>
	);
};