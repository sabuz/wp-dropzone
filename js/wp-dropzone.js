/**
 * WP Dropzone JavaScript Integration
 *
 * Initializes Dropzone instances for WordPress file uploads with drag-and-drop functionality.
 * Reads configuration from data-config attribute instead of global wpDzI18n object.
 *
 * @package
 * @since 1.1.0
 */

/**
 * Initialize dropzone instances after DOM is ready
 *
 * Waits for DOM to be fully loaded before initializing Dropzone instances
 * to ensure data-config attributes are available.
 */
document.addEventListener( 'DOMContentLoaded', function () {
	const dropzones = document.querySelectorAll( '.dropzone[data-config]' );

	dropzones.forEach( function ( dropzone ) {
		try {
			const configData = JSON.parse( dropzone.getAttribute( 'data-config' ) );

			/**
			 * Initialize Dropzone manually on the dropzone element
			 *
			 * Creates a new Dropzone instance with configuration from data-config attribute.
			 * This replaces the previous wpDzI18n global object approach.
			 */
			new Dropzone( '#' + dropzone.id, {
				url: configData.ajax_url + '?action=wp_dropzone_upload_media',
				paramName: 'file',
				maxFilesize: configData.max_file_size,
				addRemoveLinks: configData.remove_links,
				clickable: configData.clickable === 'true',
				acceptedFiles: configData.accepted_files,
				autoProcessQueue: configData.auto_process === 'true',
				maxFiles: configData.max_files,
				resizeWidth: configData.resize_width,
				resizeHeight: configData.resize_height,
				resizeQuality: configData.resize_quality,
				resizeMethod: configData.resize_method,
				thumbnailWidth: configData.thumbnail_width,
				thumbnailHeight: configData.thumbnail_height,
				thumbnailMethod: configData.thumbnail_method,
				/**
				 * Dropzone initialization callback
				 *
				 * Sets up event handlers and configuration after Dropzone is initialized.
				 * Handles manual processing, user authentication, and custom callbacks.
				 */
				init() {
					const closure = this;

					// Handle manual processing when auto_process is false
					if ( configData.auto_process === 'false' ) {
						const processButton = document.getElementById( 'process-' + configData.id );
						if ( processButton ) {
							processButton.addEventListener( 'click', function () {
								closure.processQueue();
							} );
						}
					}

					// Disable dropzone if user is not logged in
					if ( Boolean( configData.is_user_logged_in ) !== true ) {
						this.disable();
					}

					// Parse and register custom callbacks
					if ( configData.callback && configData.callback.trim() ) {
						const callbacks = configData.callback
							.replace( /(})\s?,/, '},##' )
							.split( ',##' );

						callbacks.forEach( function ( callback ) {
							callback = callback.trim();
							if ( callback ) {
								const parts = callback.split( /\s?:\s?/ );
								if ( parts.length === 2 ) {
									try {
										const func = new Function( 'return ' + parts[ 1 ] )();
										closure.on( parts[ 0 ], func );
									} catch ( e ) {
										console.warn(
											'WP Dropzone: Invalid callback function:',
											parts[ 1 ],
										);
									}
								}
							}
						} );
					}
				},
				/**
				 * File sending callback
				 *
				 * Adds security nonce and original file type to upload data.
				 * @param {File}           file - The file being uploaded
				 * @param {XMLHttpRequest} xhr  - The XMLHttpRequest object
				 * @param {FormData}       data - The upload data being sent
				 */
				sending( file, xhr, data ) {
					data.append( 'nonce', configData.nonce );
					data.append( 'origtype', file.type );
				},
				/**
				 * Maximum files exceeded callback
				 *
				 * Handles when user tries to upload more files than allowed.
				 * Removes the excess file and shows alert if configured.
				 * @param {File} file - The file that exceeded the limit
				 */
				maxfilesexceeded( file ) {
					this.removeFile( file );

					if ( configData.max_files_alert ) {
						alert( configData.max_files_alert );
					}
				},
				/**
				 * Upload success callback
				 *
				 * Handles successful file uploads by updating the target DOM element
				 * with the uploaded file URL if dom_id is configured.
				 * @param {File}   file     - The successfully uploaded file
				 * @param {Object} response - Server response with upload result
				 */
				success( file, response ) {
					if ( configData.dom_id && configData.dom_id.length > 0 ) {
						if ( response.error == 'false' ) {
							const targetElement = document.getElementById( configData.dom_id );
							if ( targetElement ) {
								targetElement.value = response.data;
							}
						}
					}
				},
			} );
		} catch ( error ) {
			/**
			 * Error handling for dropzone initialization
			 *
			 * Logs errors to console if dropzone fails to initialize,
			 * typically due to invalid configuration or missing elements.
			 */
			console.error( 'WP Dropzone: Error initializing dropzone for #' + dropzone.id, error );
		}
	} );
} );
