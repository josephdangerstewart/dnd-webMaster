import IBrush from 'react-super-canvas/dist/src/types/IBrush';
import IPainterAPI from 'react-super-canvas/dist/src/types/IPainterAPI';
import { BrushContext } from 'react-super-canvas/dist/src/types/context/BrushContext';
import ICanvasItem from 'react-super-canvas/dist/src/types/ICanvasItem';
import Vector2D from 'react-super-canvas/dist/src/types/utility/Vector2D';
import { StampCanvasItem } from './StampCanvasItem';

export class StampBrush implements IBrush {
	static brushName = 'stampbrush';
	brushName = StampBrush.brushName;
	supportedCanvasItems = {
		[StampCanvasItem.canvasItemName]: StampCanvasItem,
	};
	
	getImageUrl: () => string;
	offset = { x: 10, y: 10 };
	topLeftCorner: Vector2D;

	constructor(getImageUrl: () => string) {
		this.topLeftCorner = { x: 0, y: 0 };
		this.getImageUrl = getImageUrl;
	}

	renderPreview = (painter: IPainterAPI, context: BrushContext) => {
		const { snappedMousePosition: { x, y } } = context;
		this.topLeftCorner = {
			x: x - this.offset.x,
			y: y - this.offset.y,
		};

		painter.drawImage(this.topLeftCorner, this.getImageUrl());
	};

	mouseDown = (addCanvasItem: (canvasItem: ICanvasItem) => void, context: BrushContext) => {
		if (!this.getImageUrl()) {
			return;
		}

		addCanvasItem(new StampCanvasItem({
			topLeftCorner: this.topLeftCorner,
			imageUrl: this.getImageUrl(),
			imageCache: context.imageCache,
		}));
	};
}
