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
	
	imageUrl: string;
	offset = { x: 10, y: 10 };
	topLeftCorner: Vector2D;

	constructor(imageUrl?: string) {
		this.topLeftCorner = { x: 0, y: 0 };
		this.imageUrl = imageUrl;
	}

	setImageUrl = (imageUrl: string) => {
		this.imageUrl = imageUrl;
	}

	renderPreview = (painter: IPainterAPI, context: BrushContext) => {
		const { snappedMousePosition: { x, y } } = context;
		this.topLeftCorner = {
			x: x - this.offset.x,
			y: y - this.offset.y,
		};

		painter.drawImage(this.topLeftCorner, this.imageUrl);
	};

	mouseDown = (addCanvasItem: (canvasItem: ICanvasItem) => void) => {
		if (!this.imageUrl) {
			return;
		}

		addCanvasItem(new StampCanvasItem({
			topLeftCorner: this.topLeftCorner,
			imageUrl: this.imageUrl,
		}));
	};
}
