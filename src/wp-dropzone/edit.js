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

import { PanelBody, SelectControl, TextControl, ToggleControl } from '@wordpress/components';

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
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Id', 'wp-dropzone')}
						value={id || ''}
						onChange={(value) => setAttributes({ id: value })}
					/>

					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Title', 'wp-dropzone')}
						value={title || ''}
						onChange={(value) => setAttributes({ title: value })}
					/>

					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Description', 'wp-dropzone')}
						value={desc || ''}
						onChange={(value) => setAttributes({ desc: value })}
					/>

					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Accepted Files', 'wp-dropzone')}
						help={__('Example: image/*, .pdf', 'wp-dropzone')}
						value={acceptedFiles || ''}
						onChange={(value) => setAttributes({ acceptedFiles: value })}
					/>

					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Max Files', 'wp-dropzone')}
						type="number"
						value={maxFiles || ''}
						onChange={(value) => setAttributes({ maxFiles: value })}
					/>

					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Auto Process', 'wp-dropzone')}
						checked={!!autoProcess}
						onChange={(value) => setAttributes({ autoProcess: value })}
					/>

					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Clickable', 'wp-dropzone')}
						checked={!!clickable}
						onChange={(value) => setAttributes({ clickable: value })}
					/>

					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Remove Links', 'wp-dropzone')}
						checked={!!removeLinks}
						onChange={(value) => setAttributes({ removeLinks: value })}
					/>

					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Upload Button Text', 'wp-dropzone')}
						value={uploadButtonText || ''}
						onChange={(value) => setAttributes({ uploadButtonText: value })}
					/>

					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Resize Width', 'wp-dropzone')}
						type="number"
						value={resizeWidth || ''}
						onChange={(value) => setAttributes({ resizeWidth: value })}
					/>

					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Resize Height', 'wp-dropzone')}
						type="number"
						value={resizeHeight || ''}
						onChange={(value) => setAttributes({ resizeHeight: value })}
					/>

					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Resize Quality', 'wp-dropzone')}
						type="number"
						help={__('Value between 0.1 and 1.0', 'wp-dropzone')}
						min={0.1}
						max={1.0}
						step={0.1}
						value={resizeQuality || ''}
						onChange={(value) => setAttributes({ resizeQuality: value })}
					/>

					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Resize Method', 'wp-dropzone')}
						options={[
							{ label: 'Contain', value: 'contain' },
							{ label: 'Crop', value: 'crop' },
						]}
						value={resizeMethod || ''}
						onChange={(value) => setAttributes({ resizeMethod: value })}
					/>

					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Thumbnail Width', 'wp-dropzone')}
						type="number"
						value={thumbnailWidth || ''}
						onChange={(value) => setAttributes({ thumbnailWidth: value })}
					/>

					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Thumbnail Height', 'wp-dropzone')}
						type="number"
						value={thumbnailHeight || ''}
						onChange={(value) => setAttributes({ thumbnailHeight: value })}
					/>

					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Thumbnail Method', 'wp-dropzone')}
						value={thumbnailMethod || ''}
						options={[
							{ label: 'Contain', value: 'contain' },
							{ label: 'Crop', value: 'crop' },
						]}
						onChange={(value) => setAttributes({ thumbnailMethod: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div
					className={`dropzone dropzone-${ id || 'block' }`}
					id={`wp-dz-${ id || 'block' }`}
				>
					{ ( title || desc ) ? (
						<div className="dz-message">
							<h3 className="dropzone-title">{ title }</h3>
							<p className="dropzone-note">{ desc }</p>
							<div className="dropzone-mobile-trigger needsclick"></div>
						</div>
					) : (
						<div className="dz-default dz-message">Drop files here to upload</div>
					) }
				</div>
				{ autoProcess === false && (
					<button type="button" className="process-upload" id={`process-${ id || 'block' }`}>
						{ uploadButtonText || 'Upload' }
					</button>
				) }
			</div>
		</>
	);
}
