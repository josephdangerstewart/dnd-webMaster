import IBrush from 'react-super-canvas/dist/src/types/IBrush';
import IPainterAPI from 'react-super-canvas/dist/src/types/IPainterAPI';
import { BrushContext } from 'react-super-canvas/dist/src/types/context/BrushContext';
import ICanvasItem from 'react-super-canvas/dist/src/types/ICanvasItem';
import Vector2D from 'react-super-canvas/dist/src/types/utility/Vector2D';
import { LocationPinCanvasItem } from './LocationPinCanvasItem';

export class LocationPinBrush implements IBrush {
	static brushName = 'locationpinbrush';
	brushName = LocationPinBrush.brushName;
	supportedCanvasItems = {
		[LocationPinCanvasItem.canvasItemName]: LocationPinCanvasItem,
	}

	offset = { x: 10, y: 10 };
	locationPinSource = '/svg/location-pin.svg';
	topLeftCorner: Vector2D;

	constructor() {
		this.topLeftCorner = { x: 0, y: 0 };
	}

	renderPreview = (painter: IPainterAPI, context: BrushContext) => {
		const { snappedMousePosition: { x, y } } = context;
		this.topLeftCorner = {
			x: x - this.offset.x,
			y: y - this.offset.y,
		};

		painter.drawImage(this.topLeftCorner, this.locationPinSource);
	};

	mouseDown = (addCanvasItem: (canvasItem: ICanvasItem) => void) => {
		addCanvasItem(new LocationPinCanvasItem({
			topLeftCorner: this.topLeftCorner,
		}));
	};
}
