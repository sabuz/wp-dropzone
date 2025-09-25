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
	if ( window.Dropzone ) {
		// Ensure Dropzone does not try to auto-discover based on class names.
		window.Dropzone.autoDiscover = false;
	}

	const dropzones = document.querySelectorAll( '.dropzone[data-config]' );

	dropzones.forEach( function ( dropzone ) {
		(async function initDropzone() {
			try {
				const configData = JSON.parse( dropzone.getAttribute( 'data-config' ) );

				// Helper normalizers
				const toBool = ( value ) => ( typeof value === 'string' ? value === 'true' : Boolean( value ) );
				const toNum = ( value ) => {
					if ( value === null || value === undefined || value === '' ) return undefined;
					const n = Number( value );
					return Number.isFinite( n ) ? n : undefined;
				};

				// If nonce or ajax_url is missing, fetch them from a public endpoint
				if ( ! configData.nonce || ! configData.ajax_url ) {
					const ajaxUrl = configData.ajax_url || '/wp-admin/admin-ajax.php';
					try {
						const resp = await fetch( ajaxUrl + '?action=wp_dropzone_get_nonce', { credentials: 'same-origin' } );
						if ( resp.ok ) {
							const json = await resp.json();
							if ( json && json.success && json.data ) {
								configData.nonce = json.data.nonce;
								configData.ajax_url = json.data.ajax_url || ajaxUrl;
								configData.is_user_logged_in = json.data.is_user_logged_in;
							}
						}
					} catch ( e ) {
						// Non-fatal; proceed if server cannot provide values
					}
				}

				// Build Dropzone options with normalized values
				const options = {
					url: ( configData.ajax_url || '/wp-admin/admin-ajax.php' ) + '?action=wp_dropzone_upload_media',
					paramName: 'file',
					maxFilesize: toNum( configData.max_file_size ),
					addRemoveLinks: toBool( configData.remove_links ),
					clickable: toBool( configData.clickable ),
					acceptedFiles: configData.accepted_files || undefined,
					autoProcessQueue: toBool( configData.auto_process ),
					maxFiles: toNum( configData.max_files ),
					resizeWidth: toNum( configData.resize_width ),
					resizeHeight: toNum( configData.resize_height ),
					resizeQuality: toNum( configData.resize_quality ),
					resizeMethod: configData.resize_method || 'contain',
					thumbnailWidth: toNum( configData.thumbnail_width ),
					thumbnailHeight: toNum( configData.thumbnail_height ),
					thumbnailMethod: configData.thumbnail_method || 'crop',
					init() {
						const closure = this;

						// Handle manual processing when auto_process is false
						if ( toBool( configData.auto_process ) === false ) {
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
						if ( configData.callback && String( configData.callback ).trim() ) {
							const callbacks = String( configData.callback )
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
											console.warn( 'WP Dropzone: Invalid callback function:', parts[ 1 ] );
										}
									}
								}
							} );
						}
					},
					sending( file, xhr, data ) {
						data.append( 'nonce', configData.nonce || '' );
						data.append( 'origtype', file.type );
					},
					maxfilesexceeded( file ) {
						this.removeFile( file );
						if ( configData.max_files_alert ) {
							alert( configData.max_files_alert );
						}
					},
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
				};

				new Dropzone( '#' + dropzone.id, options );
			} catch ( error ) {
				console.error( 'WP Dropzone: Error initializing dropzone for #' + dropzone.id, error );
			}
		})();
	} );
} );
