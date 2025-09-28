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
import { useEffect, useState } from '@wordpress/element';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	BaseControl,
	ColorPicker,
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

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

	function randomHexId(bytes = 2) {
		const array = new Uint8Array(bytes);
		crypto.getRandomValues(array);
		return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
	}

	const {
		id: rawId,
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
		borderWidth,
		borderStyle,
		borderColor,
		background,
		marginBottom,
	} = attributes;

	const [id, setId] = useState(rawId);

	let css = '';

	if (borderWidth || borderColor || borderStyle || background || marginBottom) {
		css += `
	.dropzone-${id || 'block'} {
		${borderWidth ? `border-width: ${borderWidth}px;` : ''}
		${borderStyle ? `border-style: ${borderStyle};` : ''}
		${borderColor ? `border-color: ${borderColor};` : ''}
		${background ? `background: ${background};` : ''}
		${marginBottom ? `margin-bottom: ${marginBottom}px;` : ''}
	}
`;
	}

	useEffect(() => {
		if (!id) {
			const randomId = randomHexId();
			setId(randomId);
			setAttributes({ id: randomId });
		}
	}, []);

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
				<PanelBody title={__('Styles', 'wp-dropzone')} initialOpen={false}>
					{/* Border Width */}
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Border Width', 'wp-dropzone')}
						type="number"
						value={borderWidth}
						onChange={(value) => setAttributes({ borderWidth: value })}
					/>

					{/* Border Style */}
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Border Style', 'wp-dropzone')}
						value={borderStyle}
						options={[
							{ label: 'None', value: 'none' },
							{ label: 'Solid', value: 'solid' },
							{ label: 'Dashed', value: 'dashed' },
							{ label: 'Dotted', value: 'dotted' },
						]}
						onChange={(value) => setAttributes({ borderStyle: value })}
					/>

					{/* Border Color */}
					<BaseControl __nextHasNoMarginBottom label={__('Border Color', 'wp-dropzone')}>
						<ColorPicker
							color={borderColor}
							onChange={(value) => setAttributes({ borderColor: value })}
							enableAlpha
						/>
					</BaseControl>

					{/* Background */}
					<BaseControl __nextHasNoMarginBottom label={__('Background', 'wp-dropzone')}>
						<ColorPicker
							color={background}
							onChange={(value) => setAttributes({ background: value })}
							enableAlpha
						/>
					</BaseControl>

					{/* Margin Bottom */}
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__('Margin Bottom', 'wp-dropzone')}
						type="number"
						value={marginBottom}
						onChange={(value) => setAttributes({ marginBottom: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className={`dropzone dropzone-${id || 'block'}`} id={`wp-dz-${id || 'block'}`}>
					{title || desc ? (
						<div className="dz-message">
							<h3 className="dropzone-title">{title}</h3>
							<p className="dropzone-note">{desc}</p>
							<div className="dropzone-mobile-trigger needsclick"></div>
						</div>
					) : (
						<div className="dz-default dz-message">Drop files here to upload</div>
					)}
				</div>
				{css && <style>{css}</style>}
				{autoProcess === false && (
					<button
						type="button"
						className="process-upload"
						id={`process-${id || 'block'}`}
					>
						{uploadButtonText || 'Upload'}
					</button>
				)}
			</div>
		</>
	);
}
