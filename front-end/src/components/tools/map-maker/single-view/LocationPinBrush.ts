import IBrush from 'react-super-canvas/dist/src/types/IBrush';
import { CanvasItemKind } from 'react-super-canvas/dist/src/api/canvas-items/CanvasItemKind';
import { ImageCanvasItem } from 'react-super-canvas/defaults';
import IPainterAPI from 'react-super-canvas/dist/src/types/IPainterAPI';
import { BrushContext } from 'react-super-canvas/dist/src/types/context/BrushContext';
import ICanvasItem from 'react-super-canvas/dist/src/types/ICanvasItem';
import Vector2D from 'react-super-canvas/dist/src/types/utility/Vector2D';

export class LocationPinBrush implements IBrush {
	brushName = 'locationpinbrush'
	supportedCanvasItems = {
		[CanvasItemKind.ImageCanvasItem]: ImageCanvasItem,
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

	mouseDown = (addCanvasItem: (canvasItem: ICanvasItem) => void, context: BrushContext) => {
		addCanvasItem(new ImageCanvasItem({
			src: this.locationPinSource,
			topLeftCorner: this.topLeftCorner,
			imageCache: context.imageCache,
		}));
	};
}
