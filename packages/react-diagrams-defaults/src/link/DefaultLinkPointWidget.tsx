import * as React from 'react';
import { PointModel } from '@piotrmitrega/react-diagrams-core';
import styled from '@emotion/styled';

export interface DefaultLinkPointWidgetProps {
	point: PointModel;
	color?: string;
	colorSelected: string;
}

export interface DefaultLinkPointWidgetState {
	selected: boolean;
}

namespace S {
	export const PointTop = styled.circle`
		pointer-events: all;
	`;
}

export class DefaultLinkPointWidget extends React.Component<DefaultLinkPointWidgetProps, DefaultLinkPointWidgetState> {
	constructor(props) {
		super(props);
		this.state = {
			selected: false
		};
	}

	getPointIndex = () => {
		return this.props.point.getLink().getPoints().findIndex(
			(p) => p.getID() === this.props.point.getID()
		);
	};

	render() {
		const { point } = this.props;
		return (
			<g id={this.props.point.getID()} title={this.props.point.getPosition().toSVG()}>
				<circle
					cx={point.getPosition().x}
					cy={point.getPosition().y}
					r={5}
					fill={this.state.selected || this.props.point.isSelected() ? this.props.colorSelected : this.props.color}
				/>
				<text
					x={point.getPosition().x}
					y={point.getPosition().y}
				>
					{this.getPointIndex()}
				</text>
				<S.PointTop
					className="point"
					onMouseLeave={() => {
						this.setState({ selected: false });
					}}
					onMouseEnter={() => {
						this.setState({ selected: true });
					}}
					cx={point.getPosition().x}
					cy={point.getPosition().y}
					r={15}
					opacity={0.0}
				/>
			</g>
		);
	}
}
