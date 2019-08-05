import generateID from './generateId';

/**
 * @description ImageUploader acts as a interface between campaign buddy and the users file system
 * allowing them to upload images to campaign buddy without having hidden file elements maintained
 * by React
 */
export default class ImageUploader {
	constructor(accept) {
		this.id = generateID('file-uploader');
		this.callbacks = [];

		const uploader = document.createElement('input');
		uploader.setAttribute('type', 'file');
		uploader.setAttribute('accept', accept || 'image/*');
		uploader.onchange = this.onInputChange;
		this.uploader = uploader;
	}

	getFileSizeString = () => {
		if (!this.uploader.files[0]) return '0 Bytes';
		const bytes = this.uploader.files[0].size;
		// Taken from https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
		const sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB' ];
		if (bytes == 0) return '0 Bytes';
		const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		return `${Math.round(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`;
	}

	registerCallback = cb => {
		if (typeof cb === 'function') {
			this.callbacks.push(cb);
		}
	}

	unRegisterCallback = cb => {
		for (let i = 0; i < this.callbacks.length; i++) {
			if (this.callbacks[i] === cb) {
				this.callbacks.splice(i, 1);
			}
		}
	}

	onInputChange = () => {
		this.callbacks.forEach(cb => {
			cb(this.uploader.files[0]);
		});
	}

	openFilePicker = () => {
		this.uploader.click();
	}

	clearInput = () => {
		this.uploader.value = '';
	}

	getFile = () => this.uploader.files[0]
	getFileName = () => this.uploader.value
}
