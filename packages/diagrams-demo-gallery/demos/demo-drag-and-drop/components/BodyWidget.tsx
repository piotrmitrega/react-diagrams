import * as React from 'react';
import * as _ from 'lodash';
import { TrayWidget } from './TrayWidget';
import { Application, RightAnglePortModel } from '../Application';
import { TrayItemWidget } from './TrayItemWidget';
import { DefaultNodeModel, DefaultPortModel, LinkModel, RightAngleLinkModel } from '@piotrmitrega/react-diagrams';
import { AbstractModelFactory, CanvasWidget } from '@piotrmitrega/react-canvas-core';
import { DemoCanvasWidget } from '../../helpers/DemoCanvasWidget';
import styled from '@emotion/styled';
import { DemoButton, DemoWorkspaceWidget } from '../../helpers/DemoWorkspaceWidget';
import { action } from '@storybook/addon-actions';
import * as beautify from 'json-beautify';

export interface BodyWidgetProps {
	app: Application;
}

namespace S {
	export const Body = styled.div`
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		min-height: 100%;
	`;

	export const Header = styled.div`
		display: flex;
		background: rgb(30, 30, 30);
		flex-grow: 0;
		flex-shrink: 0;
		color: white;
		font-family: Helvetica, Arial, sans-serif;
		padding: 10px;
		align-items: center;
	`;

	export const Content = styled.div`
		display: flex;
		flex-grow: 1;
	`;

	export const Layer = styled.div`
		position: relative;
		flex-grow: 1;
	`;
}

export class BodyWidget extends React.Component<BodyWidgetProps> {
	render() {
		return (
			<S.Body>
				<S.Header>
					<div className="title">Storm React Diagrams - DnD demo</div>
				</S.Header>
				<S.Content>
					<TrayWidget>
						<TrayItemWidget model={{ type: 'in' }} name="In Node" color="rgb(192,255,0)" />
						<TrayItemWidget model={{ type: 'out' }} name="Out Node" color="rgb(0,192,255)" />
					</TrayWidget>
					<S.Layer
						onDrop={(event) => {
							var data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
							var nodesCount = _.keys(this.props.app.getDiagramEngine().getModel().getNodes()).length;

							var node: DefaultNodeModel = null;
							if (data.type === 'in') {
								node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'rgb(192,255,0)');
								node.addPort(new RightAnglePortModel(true,'In'));
							} else {
								node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'rgb(0,192,255)');
								node.addPort(new RightAnglePortModel(false, 'Out'));
							}
							var point = this.props.app.getDiagramEngine().getRelativeMousePoint(event);
							node.setPosition(point);
							this.props.app.getDiagramEngine().getModel().addNode(node);
							this.forceUpdate();
						}}
						onDragOver={(event) => {
							event.preventDefault();
						}}>
						<DemoWorkspaceWidget
							buttons={
								[
									<DemoButton
										onClick={() => {
											action('Serialized Graph')(beautify(this.props.app.getDiagramEngine().getModel().serialize(), null, 2, 80));
										}}>
										Serialize Graph
									</DemoButton>
								]
							}>
							<DemoCanvasWidget>
								<CanvasWidget engine={this.props.app.getDiagramEngine()} />
							</DemoCanvasWidget>
						</DemoWorkspaceWidget>
					</S.Layer>
				</S.Content>
			</S.Body>
		);
	}
}
