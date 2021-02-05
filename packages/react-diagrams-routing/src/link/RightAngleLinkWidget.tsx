import * as React from 'react';
import { MouseEvent } from 'react';
import { debounce } from 'lodash';
import {
  DiagramEngine,
  LinkWidget,
  PointModel,
	LinkSegmentWidget,
	PointWidget
} from '@piotrmitrega/react-diagrams-core';
import { RightAngleLinkFactory } from './RightAngleLinkFactory';
import { RightAngleLinkModel } from './RightAngleLinkModel';
import { LinkArrow } from './LinkArrow';

export interface RightAngleLinkProps {
  color?: string;
  width?: number;
  smooth?: boolean;
  link: RightAngleLinkModel;
  diagramEngine: DiagramEngine;
  factory: RightAngleLinkFactory;
}

export interface RightAngleLinkState {
  selected: boolean;
  canDrag: boolean;
}

export class RightAngleLinkWidget extends React.Component<
  RightAngleLinkProps,
  RightAngleLinkState
> {
  public static defaultProps: RightAngleLinkProps = {
    color: 'red',
    width: 3,
    link: null,
    smooth: false,
    diagramEngine: null,
    factory: null,
  };

  refPaths: React.RefObject<SVGPathElement>[];

  // DOM references to the label and paths (if label is given), used to calculate dynamic positioning
  refLabels: { [id: string]: HTMLElement };
  dragging_index: number;

  constructor(props: RightAngleLinkProps) {
    super(props);

    this.refPaths = [];
    this.state = {
      selected: false,
      canDrag: false,
    };

    this.dragging_index = 0;
  }

  componentDidUpdate(): void {
    this.props.link.setRenderedPaths(this.refPaths.map((ref) => ref.current));
  }

  componentDidMount(): void {
    this.props.link.setRenderedPaths(this.refPaths.map((ref) => ref.current));
  }

  componentWillUnmount(): void {
    this.props.link.setRenderedPaths([]);
  }

  generateLink(
    path: string,
    extraProps: any,
    id: string | number,
  ): JSX.Element {
    if (this.refPaths.length < Number(id) + 1) {
      this.refPaths.push(React.createRef<SVGPathElement>());
    }

    const ref = React.createRef<SVGPathElement>();

    return (
      <LinkSegmentWidget
        diagramEngine={this.props.diagramEngine}
        extras={extraProps}
        factory={this.props.diagramEngine.getFactoryForLink(this.props.link)}
        forwardRef={ref}
        key={`link-${id}`}
        link={this.props.link}
        path={path}
        selected={this.state.selected}
        onSelection={(selected) => {
          this.setState({ selected: selected });
        }}
      />
    );
  }

  calculatePositions(
    points: PointModel[],
    event: MouseEvent,
    index: number,
    coordinate: string,
  ) {
    // If path is first or last add another point to keep node port on its position
    if (index === 0) {
      const point = this.props.link.generatePoint(
        points[index].getX(),
        points[index].getY(),
      );
      this.props.link.addPoint(point, index);
      this.dragging_index++;
      return;
    } else if (index === points.length - 2) {
      const point = this.props.link.generatePoint(
        points[index + 1].getX(),
        points[index + 1].getY(),
      );
      this.props.link.addPoint(point, index + 1);
      return;
    }

    // Merge two points if it is not close to node port and close to each other
    if (index - 2 > 0) {
      const _points = {
        [index - 2]: points[index - 2].getPosition(),
        [index + 1]: points[index + 1].getPosition(),
        [index - 1]: points[index - 1].getPosition(),
      };
      if (
        Math.abs(
          _points[index - 1][coordinate] - _points[index + 1][coordinate],
        ) < 6
      ) {
        _points[index - 2][
          coordinate
        ] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
        _points[index + 1][
          coordinate
        ] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
        points[index - 2].setPosition(_points[index - 2]);
        points[index + 1].setPosition(_points[index + 1]);
        points[index - 1].remove();
        points[index - 1].remove();
        this.dragging_index--;
        this.dragging_index--;
        return;
      }
    }

    // Merge two points if it is not close to node port
    if (index + 2 < points.length - 2) {
      const _points = {
        [index + 3]: points[index + 3].getPosition(),
        [index + 2]: points[index + 2].getPosition(),
        [index + 1]: points[index + 1].getPosition(),
        [index]: points[index].getPosition(),
      };
      if (
        Math.abs(
          _points[index + 1][coordinate] - _points[index + 2][coordinate],
        ) < 6
      ) {
        _points[index][
          coordinate
        ] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
        _points[index + 3][
          coordinate
        ] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
        points[index].setPosition(_points[index]);
        points[index + 3].setPosition(_points[index + 3]);
        points[index + 1].remove();
        points[index + 1].remove();
        return;
      }
    }

    // If no condition above handled then just update path points position
    const _points = {
      [index]: points[index].getPosition(),
      [index + 1]: points[index + 1].getPosition(),
    };
    _points[index][coordinate] = this.props.diagramEngine.getRelativeMousePoint(
      event,
    )[coordinate];
    _points[index + 1][
      coordinate
    ] = this.props.diagramEngine.getRelativeMousePoint(event)[coordinate];
    points[index].setPosition(_points[index]);
    points[index + 1].setPosition(_points[index + 1]);
  }

  draggingEvent(event: MouseEvent, index: number) {
    const points = this.props.link.getPoints();
    // get moving difference. Index + 1 will work because links indexes has
    // length = points.lenght - 1
    const dx = Math.abs(points[index].getX() - points[index + 1].getX());
    const dy = Math.abs(points[index].getY() - points[index + 1].getY());

    // moving with y direction
    if (dx === 0) {
      this.calculatePositions(points, event, index, 'x');
    } else if (dy === 0) {
      this.calculatePositions(points, event, index, 'y');
    }
    this.props.link.calculateDirections();
    this.handleOnDraggedEvent();
  }

  handleOnDraggedEvent = debounce(() => this.props.link.onDragged(), 20);

  handleMove = function (event: MouseEvent) {
    this.draggingEvent(event, this.dragging_index);
  }.bind(this);

  handleUp = function (event: MouseEvent) {
    // Unregister handlers to avoid multiple event handlers for other links
    this.setState({
      canDrag: false,
      selected: false,
    });
    window.removeEventListener('mousemove', this.handleMove);
    window.removeEventListener('mouseup', this.handleUp);
  }.bind(this);

  generatePoint(point: PointModel, index: number): JSX.Element {
    const colors = [
      '#ff0000',
      '#00ff00',
      '#0000ff',
      '#330000',
      '#003300',
      '#000033',
    ];

    return (
      <PointWidget
        color={colors[index]}
        colorSelected={this.props.link.getOptions().selectedColor}
        key={point.getID()}
        point={point as any}
      />
    );
  }

  render() {
    //ensure id is present for all points on the path
    const points = this.props.link.getPoints();
    const paths = [];

    // Render was called but link is not moved but user.
    // Node is moved and in this case fix coordinates to get 90° angle.
    // For loop just for first and last path
    if (
      this.props.link.getTargetPort() !== null &&
      !this.state.canDrag &&
      points.length > 2
    ) {
      // Those points and its position only will be moved
      for (let i = 1; i < points.length; i += points.length - 2) {
        if (i - 1 === 0) {
          if (this.props.link.getFirstPathXdirection()) {
            points[i].setPosition(points[i].getX(), points[i - 1].getY());
          } else {
            points[i].setPosition(points[i - 1].getX(), points[i].getY());
          }
        } else {
          if (this.props.link.getLastPathXdirection()) {
            points[i - 1].setPosition(points[i - 1].getX(), points[i].getY());
          } else {
            points[i - 1].setPosition(points[i].getX(), points[i - 1].getY());
          }
        }
      }
    }

    for (let j = 0; j < points.length - 1; j++) {
      paths.push(
        this.generateLink(
          LinkWidget.generateLinePath(points[j], points[j + 1]),
          {
            'data-linkid': this.props.link.getID(),
            'data-point': j,
            onMouseDown: (event: MouseEvent) => {
              if (event.button === 0) {
                this.setState({ canDrag: true });
                this.dragging_index = j;
                // Register mouse move event to track mouse position
                // On mouse up these events are unregistered check "this.handleUp"
                if (this.props.link.getTargetPort()) {
                  window.addEventListener('mousemove', this.handleMove);
                  window.addEventListener('mouseup', this.handleUp);
                }
              }
            },
            onMouseEnter: (event: MouseEvent) => {
              this.setState({ selected: true });
              this.props.link.lastHoverIndexOfPath = j;
            },
          },
          j,
        ),
      );
    }

    if (this.props.link.getTargetPort()) {
      paths.push(
        <LinkArrow
          point={this.props.link.getLastPoint().getPosition()}
          previousPoint={this.props.link.getTargetPort().getCenter()}
        />,
      );
    }

    //render the circles
    // for (let i = 0; i < points.length; i++) {
    // 	paths.push(this.generatePoint(points[i], i));
    // }

    this.refPaths = [];
    return (
      <g>
        {paths}
      </g>
    );
  }
}
