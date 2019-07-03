const colorMap = {
	spell: '#AB3428',
	feat: '#2D728F',
	equipment: '#360568',
	character: '#995D81',
	note: '#595f72',
	folder: '#595f72',
};

export default Quill => {
	const InlineBlot = Quill.import('blots/embed');

	class MentionBlot extends InlineBlot {
		static blotName = 'mention';
		static tagName = 'A';
		static className = 'ql-mention-blot';
	
		static create(value) {
			const node = super.create(value);
			/* eslint-disable-next-line */
			node.innerText = `@${value.name}`;
			node.setAttribute('data-resource-id', value.id);
			node.setAttribute('data-resource-type', value.type || 'spells');

			node.style.color = colorMap[value.type];

			return node;
		}

		static value(node) {
			let name = node.innerText.split('@')[1];
			if (!name) {
				name = 'Name not found';
			}
			const id = node.getAttribute('data-resource-id');
			const type = node.getAttribute('data-resource-type');
			return {
				id,
				name,
				type,
			};
		}
	}
	
	return MentionBlot;
};
