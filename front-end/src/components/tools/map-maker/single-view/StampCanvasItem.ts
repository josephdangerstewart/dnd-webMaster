import ICanvasItem from 'react-super-canvas/dist/src/types/ICanvasItem';
import Rectangle from 'react-super-canvas/dist/src/types/shapes/Rectangle';
import Vector2D from 'react-super-canvas/dist/src/types/utility/Vector2D';
import IPainterAPI from 'react-super-canvas/dist/src/types/IPainterAPI';
import { IImageCache } from 'react-super-canvas/dist/src/types/IImageCache';
import CanvasItemContext from 'react-super-canvas/dist/src/types/context/CanvasItemContext';
import { vector, boundingRectOfPolygon, normalizeRotationForRect, rotatePolygon } from 'react-super-canvas/dist/src/utility/shapes-util';
import { ScalingNode } from 'react-super-canvas/dist/src/types/transform/ScalingNode';
import { scalePolygon } from 'react-super-canvas/dist/src/utility/transform-utility';
import Polygon from 'react-super-canvas/dist/src/types/shapes/Polygon';

export interface StampCanvasItemConstructor {
	topLeftCorner: Vector2D;
	imageUrl: string;
	imageCache: IImageCache;
	imageHeight?: number;
	imageWidth?: number;
	scale?: Vector2D;
	rotation?: number;
}

export class StampCanvasItem implements ICanvasItem {
	static canvasItemName = 'stamp';
	canvasItemName = StampCanvasItem.canvasItemName;
	topLeftCorner: Vector2D;
	imageUrl: string;
	imageCache: IImageCache;
	imageWidth: number;
	imageHeight: number;
	scale: Vector2D;
	rotation: number;

	constructor({ imageUrl, topLeftCorner, imageCache, imageHeight, imageWidth, scale, rotation }: StampCanvasItemConstructor) {
		this.topLeftCorner = topLeftCorner;
		this.imageUrl = imageUrl;
		this.imageCache = imageCache;
		this.imageWidth = imageWidth;
		this.imageHeight = imageHeight;
		this.rotation = rotation ?? 0;
		this.scale = scale ?? { x: 1, y: 1 };

		if (this.imageCache) {
			this.calculateDimensions();
		}
	}

	render = (painter: IPainterAPI, context: CanvasItemContext) => {
		if (!this.imageCache) {
			this.imageCache = context.imageCache;
			this.calculateDimensions();
		}

		painter.drawImage(this.topLeftCorner, this.imageUrl, this.scale, 1, this.rotation);
	};

	applyScale = (scale: Vector2D, scalingNode: ScalingNode) => {
		// Get the outline of the image
		const boundingPolygon = this.getBoundingPolygon();

		// Scale it
		const scaledPolygon = scalePolygon(boundingPolygon, scale, scalingNode);

		// Rotate it back
		const rotatedPolygon = rotatePolygon(scaledPolygon, -this.rotation);

		// Get the top left coordinates of the new polygon
		const tlX = Math.min(...rotatedPolygon.points.map(({ x }) => x));
		const tlY = Math.min(...rotatedPolygon.points.map(({ y }) => y));

		// Get the new width of the polygon
		const { width, height } = boundingRectOfPolygon(rotatedPolygon);

		// Move the image accordingly
		this.topLeftCorner = vector(tlX, tlY);

		// Set the new scale
		this.scale = vector(width / this.imageWidth, height / this.imageHeight);
	}

	applyRotation = (rotation: number) => {
		this.rotation += rotation;
	}

	applyMove = (transform: Vector2D) => {
		this.topLeftCorner.x += transform.x;
		this.topLeftCorner.y += transform.y;
	};

	toJson = () => ({
		topLeftCorner: this.topLeftCorner,
		imageUrl: this.imageUrl,
		imageWidth: this.imageWidth,
		imageHeight: this.imageHeight,
		rotation: this.rotation,
		scale: this.scale,
	});

	calculateDimensions = async () => {
		const image = await this.imageCache.getImageAsync(this.imageUrl);
		const { width, height } = image;
		this.imageWidth = width;
		this.imageHeight = height;
	}

	getBoundingRect = (): Rectangle => {
		if (!this.imageWidth || !this.imageHeight) {
			return {
				topLeftCorner: vector(0, 0),
				width: 0,
				height: 0,
			};
		}

		return boundingRectOfPolygon(this.getBoundingPolygon());
	}

	getBoundingPolygon = (): Polygon => {
		if (!this.imageWidth || !this.imageHeight) {
			return {
				points: [],
			};
		}

		const boundingRect: Rectangle = {
			topLeftCorner: this.topLeftCorner,
			width: this.imageWidth * this.scale.x,
			height: this.imageHeight * this.scale.y,
			rotation: this.rotation,
		};

		return normalizeRotationForRect(boundingRect);
	}
}
