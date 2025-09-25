/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const {
		id = '',
		title = '',
		desc = '',
		acceptedFiles = '',
		maxFiles = '',
		autoProcess = true,
		clickable = true,
		removeLinks = false,
		uploadButtonText = 'Upload',
		resizeWidth = '',
		resizeHeight = '',
		resizeQuality = 0.8,
		resizeMethod = 'contain',
		thumbnailWidth = 120,
		thumbnailHeight = 120,
		thumbnailMethod = 'crop',
		// Optional attributes that may exist in editor/UI
		callback = '',
		domId = '',
		maxFilesAlert = 'Max file limit exceeded.',
	} = attributes || {};

	const elementId = `wp-dz-${ id || 'block' }`;

	// Build config similar to class-plugin.php output. Some dynamic server values
	// like ajax_url, nonce, and is_user_logged_in cannot be produced here, so we
	// provide sensible placeholders that frontend JS can work with or override.
	const config = {
		ajax_url: '/wp-admin/admin-ajax.php',
		nonce: '',
		is_user_logged_in: false,
		id: id || 'block',
		callback,
		title,
		desc,
		max_file_size: '',
		remove_links: String( !! removeLinks ),
		clickable: String( !! clickable ),
		accepted_files: acceptedFiles || null,
		max_files: maxFiles || null,
		max_files_alert: maxFilesAlert,
		auto_process: String( !! autoProcess ),
		dom_id: domId || '',
		resize_width: resizeWidth || null,
		resize_height: resizeHeight || null,
		resize_quality: typeof resizeQuality === 'number' ? resizeQuality : 0.8,
		resize_method: resizeMethod || 'contain',
		thumbnail_width: thumbnailWidth || 120,
		thumbnail_height: thumbnailHeight || 120,
		thumbnail_method: thumbnailMethod || 'crop',
	};

	// Inline CSS for thumbnail sizing similar to shortcode output
	let css = '';
	if ( thumbnailWidth && thumbnailHeight ) {
		css += `.dropzone-${ id || 'block' } .dz-preview .dz-image {width:100%;max-width:${ thumbnailWidth }px;height:auto;max-height:${ thumbnailWidth }px;}`;
	}

	const blockProps = useBlockProps.save( { className: '' } );

	return (
		<div { ...blockProps }>
			<div
				className={`dropzone dropzone-${ id || 'block' }`}
				id={ elementId }
				data-config={ JSON.stringify( config ) }
			>
				{ ( title || desc ) && (
					<div className="dz-message">
						<h3 className="dropzone-title">{ title }</h3>
						<p className="dropzone-note">{ desc }</p>
						<div className="dropzone-mobile-trigger needsclick"></div>
					</div>
				) }
			</div>
			{ css && <style>{ css }</style> }
			{ autoProcess === false && (
				<button type="button" className="process-upload" id={`process-${ id || 'block' }`}>
					{ uploadButtonText || 'Upload' }
				</button>
			) }
		</div>
	);
}
