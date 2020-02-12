import ICanvasItem from 'react-super-canvas/dist/src/types/ICanvasItem';
import Rectangle from 'react-super-canvas/dist/src/types/shapes/Rectangle';
import Vector2D from 'react-super-canvas/dist/src/types/utility/Vector2D';
import IPainterAPI from 'react-super-canvas/dist/src/types/IPainterAPI';

export interface LocationPinCanvasItemConstructor {
	topLeftCorner: Vector2D;
}

export class LocationPinCanvasItem implements ICanvasItem {
	static canvasItemName = 'locationpincanvasitem';
	canvasItemName = LocationPinCanvasItem.canvasItemName;
	topLeftCorner: Vector2D;

	constructor({ topLeftCorner }: LocationPinCanvasItemConstructor) {
		this.topLeftCorner = topLeftCorner;
	}

	render = (painter: IPainterAPI) => {
		painter.drawImage(this.topLeftCorner, '/svg/location-pin.svg');
	};

	applyMove = (transform: Vector2D) => {
		this.topLeftCorner.x += transform.x;
		this.topLeftCorner.y += transform.y;
	};

	toJson = () => ({
		topLeftCorner: this.topLeftCorner,
	});

	getBoundingRect = (): Rectangle => ({
		topLeftCorner: this.topLeftCorner,
		width: 20,
		height: 20,
	});
}
