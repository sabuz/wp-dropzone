<?php
/**
 * Plugin class
 *
 * @package NazSabuz/WPDropzone
 */

namespace NazSabuz\WPDropzone;

defined( 'ABSPATH' ) || exit;

/**
 * The main class for loading plugin features
 */
class Plugin {
	/**
	 * Plugin file path
	 *
	 * @var string
	 */
	protected $dir;

	/**
	 * Plugin dir path
	 *
	 * @var string
	 */
	protected $url;

	/**
	 * Register class hooks
	 *
	 * @since 1.0.0
	 * @param string $dir plugin dir path.
	 * @param string $url plugin dir url.
	 * @return void
	 */
	public function __construct( $dir, $url ) {
		// init class properties.
		$this->dir = $dir;
		$this->url = $url;

		// init class actions.
		add_action( 'wp_enqueue_scripts', array( $this, 'register_scripts' ) );
		// add_action( 'admin_menu', array( $this, 'register_menu_page' ) );
		// add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );

		// init class fliter.
		// add_filter( 'admin_body_class', array( $this, 'admin_body_class' ) );
	}

	/**
	 * Register the required asset files for this plugin.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function register_scripts() {
		wp_register_style( 'dropzone', $this->url . 'css/dropzone.min.css', array(), '1.0.8' );
		wp_register_script( 'dropzone', $this->url . 'js/dropzone.min.js', array(), '1.0.8', true );
	}

	/**
	 * Handle ajax file upload to media library.
	 *
	 * @since    1.0.0
	 */
	public function wp_dz_ajax_upload_handle() {
		if ( ! wp_verify_nonce( $_POST['wp_dz_nonce'], 'wp_dz_protect' ) ) {
			return;
		}

		$message = array(
			'error' => true,
			'data'  => __( 'no file to upload.', 'wp-dropzone' ),
		);

		if ( ! empty( $_FILES ) ) {
			$file = array(
				'name' => isset( $_FILES['file']['name'] ) ? $_FILES['file']['name'] : '',
				'type' => isset( $_FILES['file']['type'] ) ? $_FILES['file']['type'] : '',
				'size' => isset( $_FILES['file']['size'] ) ? $_FILES['file']['size'] : 0,
			);

			// include file library if not exist.
			if ( ! function_exists( 'wp_handle_upload' ) ) {
				require_once ABSPATH . 'wp-admin/includes/file.php';
			}

			// fire hook before upload.
			do_action( 'wp_dropzone_before_upload_file', $file );

			// upload file to server.
			$movefile = wp_handle_upload( $_FILES['file'], array( 'test_form' => false ) );

			// if upload success & no error.
			if ( $movefile && ! isset( $movefile['error'] ) ) {
				// fire hook after upload.
				do_action( 'wp_dropzone_after_upload_file', $file );

				$filename      = $movefile['file'];
				$filetype      = wp_check_filetype( basename( $filename ), null );
				$wp_upload_dir = wp_upload_dir();

				$attachment = array(
					'guid'           => $wp_upload_dir['url'] . '/' . basename( $filename ),
					'post_mime_type' => $filetype['type'],
					'post_title'     => preg_replace( '/\.[^.]+$/', '', basename( $filename ) ),
					'post_content'   => '',
					'post_status'    => 'inherit',
				);

				// add file to media.
				$attach_id = wp_insert_attachment( $attachment, $filename );

				// fire hook after insert media.
				do_action( 'wp_dropzone_after_insert_attachment', $attach_id );

				// if attachment success.
				if ( $attach_id ) {
					require_once ABSPATH . 'wp-admin/includes/image.php';

					// update attachment metadata.
					$attach_data = wp_generate_attachment_metadata( $attach_id, $filename );
					wp_update_attachment_metadata( $attach_id, $attach_data );
				}

				$message['error'] = false;
				$message['data']  = wp_get_attachment_url( $attach_id );
			} else {
				$message['data'] = $movefile['error'];
			}
		}

		wp_send_json( $message );
	}
}
