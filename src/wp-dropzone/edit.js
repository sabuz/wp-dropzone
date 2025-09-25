/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps();

	const {
		id,
		title,
		desc,
		acceptedFiles,
		maxFiles,
		autoProcess,
		clickable,
		removeLinks,
		uploadButtonText,
		resizeWidth,
		resizeHeight,
		resizeQuality,
		resizeMethod,
		thumbnailWidth,
		thumbnailHeight,
		thumbnailMethod,
	} = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'wp-dropzone')} initialOpen={true}>
					<TextControl
						label={__('Id', 'wp-dropzone')}
						value={id || ''}
						onChange={(value) => setAttributes({ id: value })}
					/>

					<TextControl
						label={__('Title', 'wp-dropzone')}
						value={title || ''}
						onChange={(value) => setAttributes({ title: value })}
					/>

					<TextControl
						label={__('Description', 'wp-dropzone')}
						value={desc || ''}
						onChange={(value) => setAttributes({ desc: value })}
					/>

					<TextControl
						label={__('Accepted Files', 'wp-dropzone')}
						help={__('Example: image/*, .pdf', 'wp-dropzone')}
						value={acceptedFiles || ''}
						onChange={(value) => setAttributes({ acceptedFiles: value })}
					/>

					<TextControl
						label={__('Max Files', 'wp-dropzone')}
						type="number"
						value={maxFiles || ''}
						onChange={(value) => setAttributes({ maxFiles: value })}
					/>

					<ToggleControl
						label={__('Auto Process', 'wp-dropzone')}
						checked={!!autoProcess}
						onChange={(value) => setAttributes({ autoProcess: value })}
					/>

					<ToggleControl
						label={__('Clickable', 'wp-dropzone')}
						checked={!!clickable}
						onChange={(value) => setAttributes({ clickable: value })}
					/>

					<ToggleControl
						label={__('Remove Links', 'wp-dropzone')}
						checked={!!removeLinks}
						onChange={(value) => setAttributes({ removeLinks: value })}
					/>

					<TextControl
						label={__('Upload Button Text', 'wp-dropzone')}
						value={uploadButtonText || ''}
						onChange={(value) => setAttributes({ uploadButtonText: value })}
					/>

					<TextControl
						label={__('Resize Width', 'wp-dropzone')}
						type="number"
						value={resizeWidth || ''}
						onChange={(value) => setAttributes({ resizeWidth: value })}
					/>

					<TextControl
						label={__('Resize Height', 'wp-dropzone')}
						type="number"
						value={resizeHeight || ''}
						onChange={(value) => setAttributes({ resizeHeight: value })}
					/>

					<TextControl
						label={__('Resize Quality', 'wp-dropzone')}
						type="number"
						help={__('Value between 0.1 and 1.0', 'wp-dropzone')}
						min={0.1}
						max={1.0}
						step={0.1}
						value={resizeQuality || ''}
						onChange={(value) => setAttributes({ resizeQuality: value })}
					/>

					<TextControl
						label={__('Resize Method', 'wp-dropzone')}
						value={resizeMethod || ''}
						onChange={(value) => setAttributes({ resizeMethod: value })}
					/>

					<TextControl
						label={__('Thumbnail Width', 'wp-dropzone')}
						type="number"
						value={thumbnailWidth || ''}
						onChange={(value) => setAttributes({ thumbnailWidth: value })}
					/>

					<TextControl
						label={__('Thumbnail Height', 'wp-dropzone')}
						type="number"
						value={thumbnailHeight || ''}
						onChange={(value) => setAttributes({ thumbnailHeight: value })}
					/>

					<TextControl
						label={__('Thumbnail Method', 'wp-dropzone')}
						value={thumbnailMethod || ''}
						onChange={(value) => setAttributes({ thumbnailMethod: value })}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>{'Wp Dropzone – hello from the editor!'}</div>
		</>
	);
}
