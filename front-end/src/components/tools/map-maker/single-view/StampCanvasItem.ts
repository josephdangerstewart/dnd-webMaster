import ICanvasItem from 'react-super-canvas/dist/src/types/ICanvasItem';
import Rectangle from 'react-super-canvas/dist/src/types/shapes/Rectangle';
import Vector2D from 'react-super-canvas/dist/src/types/utility/Vector2D';
import IPainterAPI from 'react-super-canvas/dist/src/types/IPainterAPI';

export interface StampCanvasItemConstructor {
	topLeftCorner: Vector2D;
	imageUrl: string;
}

export class StampCanvasItem implements ICanvasItem {
	static canvasItemName = 'stamp';
	canvasItemName = StampCanvasItem.canvasItemName;
	topLeftCorner: Vector2D;
	imageUrl: string;

	constructor({ imageUrl, topLeftCorner }: StampCanvasItemConstructor) {
		this.topLeftCorner = topLeftCorner;
		this.imageUrl = imageUrl;
	}

	render = (painter: IPainterAPI) => {
		painter.drawImage(this.topLeftCorner, this.imageUrl);
	};

	applyMove = (transform: Vector2D) => {
		this.topLeftCorner.x += transform.x;
		this.topLeftCorner.y += transform.y;
	};

	toJson = () => ({
		topLeftCorner: this.topLeftCorner,
		imageUrl: this.imageUrl,
	});

	getBoundingRect = (): Rectangle => ({
		topLeftCorner: this.topLeftCorner,
		width: 20,
		height: 20,
	});
}
