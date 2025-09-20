<?php
/**
 * Main Plugin Class
 *
 * Handles file uploads, shortcode rendering, and WordPress integration
 * for the WP Dropzone plugin.
 *
 * @package WP_Dropzone
 * @since   1.0.0
 */

namespace WP_Dropzone;

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

use WP_Filesystem_Direct;

/**
 * Main Plugin Class
 *
 * Coordinates plugin functionality including file uploads, asset loading,
 * and shortcode rendering.
 *
 * @since 1.0.0
 */
class Plugin {
	/**
	 * Initialize plugin hooks and actions
	 *
	 * Sets up WordPress hooks for script enqueuing, AJAX handling,
	 * and shortcode registration.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function __construct() {
		// Load dependencies.
		$this->load_dependencies();

		// Load text domain for translations.
		add_action( 'plugins_loaded', [ $this, 'load_textdomain' ] );

		// Initialize plugin actions.
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
		add_action( 'wp_ajax_wp_dropzone_upload_media', [ $this, 'ajax_upload_handle' ] );
		add_shortcode( 'wp-dropzone', [ $this, 'add_shortcode' ] );
	}

	/**
	 * Load required WordPress filesystem classes
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function load_dependencies() {
		if ( ! class_exists( 'WP_Filesystem_Direct' ) ) {
			require_once ABSPATH . 'wp-admin/includes/class-wp-filesystem-base.php';
			require_once ABSPATH . 'wp-admin/includes/class-wp-filesystem-direct.php';
		}
	}

	/**
	 * Load plugin text domain for translations
	 *
	 * Loads the plugin's translation files for internationalization.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function load_textdomain() {
		load_plugin_textdomain( 'wp-dropzone', false, dirname( WP_DROPZONE_BASENAME ) . '/languages/' );
	}

	/**
	 * Enqueue scripts and styles for pages with shortcode
	 *
	 * Conditionally loads Dropzone CSS and JavaScript files only on pages
	 * that contain the wp-dropzone shortcode for optimal performance.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function enqueue_scripts() {
		global $post;

		if ( is_a( $post, 'WP_Post' ) && has_shortcode( $post->post_content, 'wp-dropzone' ) ) {
			wp_enqueue_style( 'dropzone', WP_DROPZONE_URL . 'css/dropzone.min.css', [], WP_DROPZONE_VERSION );
			wp_enqueue_script( 'dropzone', WP_DROPZONE_URL . 'js/dropzone.min.js', [], WP_DROPZONE_VERSION, true );
			wp_enqueue_script( 'wp-dropzone', WP_DROPZONE_URL . 'js/wp-dropzone.js', [ 'dropzone' ], WP_DROPZONE_VERSION, true );
		}
	}

	/**
	 * Handle AJAX file upload to WordPress media library
	 *
	 * Processes file uploads including chunked uploads for large files.
	 * Includes security verification, nonce validation, and media library integration.
	 * Supports both regular and chunked uploads for better performance.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function ajax_upload_handle() {
		// Verify nonce for security.
		if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nonce'] ) ), 'wp_dropzone_nonce' ) ) {
			wp_send_json_error( __( 'Security check failed.', 'wp-dropzone' ) );
			return;
		}

		$message = [
			'error' => true,
			'data'  => __( 'no file to upload.', 'wp-dropzone' ),
		];

		if ( ! isset( $_FILES['file'] ) || empty( $_FILES['file'] ) ) {
			wp_send_json( $message );
		}

		// phpcs:ignore
		$file = $_FILES['file'];

		// Handle chunked uploads.
		if ( isset( $_POST['dzuuid'] ) && isset( $_POST['dzchunkindex'] ) && isset( $_POST['dztotalchunkcount'] ) ) {
			$uid           = trim( sanitize_text_field( wp_unslash( $_POST['dzuuid'] ) ) );
			$total_chunks  = intval( $_POST['dztotalchunkcount'] );
			$chunk_index   = intval( $_POST['dzchunkindex'] ) + 1;
			$uploads       = wp_upload_dir();
			$wp_filesystem = new WP_Filesystem_Direct( null );

			// Combine file chunks.
			$tmp_file = $uploads['path'] . DIRECTORY_SEPARATOR . $file['name'];
			$contents = $wp_filesystem->get_contents( $tmp_file ) . $wp_filesystem->get_contents( $file['tmp_name'] );

			$wp_filesystem->put_contents( $tmp_file, $contents, false );

			if ( $total_chunks !== $chunk_index ) {
				return;
			}

			$file['tmp_name'] = tempnam( $tmp_file );
			$file['type']     = isset( $_POST['origtype'] ) ? sanitize_text_field( wp_unslash( $_POST['origtype'] ) ) : '';
			$file['size']     = $wp_filesystem->size( $tmp_file );
		}

		// Include WordPress file handling library.
		if ( ! function_exists( 'wp_handle_upload' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}

		// Fire hook before upload.
		do_action( 'wp_dropzone_before_upload_file', $file );

		// Upload file to server.
		$movefile = wp_handle_upload( $file, [ 'test_form' => false ] );

		// Handle successful upload.
		if ( $movefile && ! isset( $movefile['error'] ) ) {
			// Fire hook after upload.
			do_action( 'wp_dropzone_after_upload_file', $file );

			$filename      = $movefile['file'];
			$filetype      = wp_check_filetype( basename( $filename ), null );
			$wp_upload_dir = wp_upload_dir();

			$attachment = [
				'guid'           => $wp_upload_dir['url'] . '/' . basename( $filename ),
				'post_mime_type' => $filetype['type'],
				'post_title'     => preg_replace( '/\.[^.]+$/', '', basename( $filename ) ),
				'post_content'   => '',
				'post_status'    => 'inherit',
			];

			// Add file to media library.
			$attachment_id = wp_insert_attachment( $attachment, $filename );

			// Fire hook after media insertion.
			do_action( 'wp_dropzone_after_insert_attachment', $attachment_id );

			// Generate attachment metadata.
			if ( $attachment_id ) {
				require_once ABSPATH . 'wp-admin/includes/image.php';

				$attachment_data = wp_generate_attachment_metadata( $attachment_id, $filename );
				wp_update_attachment_metadata( $attachment_id, $attachment_data );
			}

			$message['error'] = false;
			$message['data']  = wp_get_attachment_url( $attachment_id );
		} else {
			$message['data'] = $movefile['error'];
		}

		wp_send_json( $message );
	}

	/**
	 * Render wp-dropzone shortcode with customizable options
	 *
	 * Generates HTML for dropzone upload areas with configurable styling,
	 * file restrictions, and upload behavior. Configuration is passed via
	 * data-config attribute for JavaScript initialization.
	 *
	 * @since 1.0.0
	 * @param array $atts Shortcode attributes with default values.
	 * @return string HTML output for dropzone with inline styles
	 */
	public function add_shortcode( $atts ) {
		$atts = shortcode_atts(
			[
				'id'                 => bin2hex( random_bytes( 2 ) ),
				'callback'           => '',
				'title'              => '',
				'desc'               => '',
				'border-width'       => '',
				'border-style'       => '',
				'border-color'       => '',
				'background'         => '',
				'margin-bottom'      => '',
				'max-file-size'      => (int) ini_get( 'upload_max_filesize' ) * 1000000,
				'remove-links'       => 'false',
				'clickable'          => 'true',
				'accepted-files'     => null,
				'max-files'          => null,
				'max-files-alert'    => __( 'Max file limit exceeded.', 'wp-dropzone' ),
				'auto-process'       => 'true',
				'upload-button-text' => __( 'Upload', 'wp-dropzone' ),
				'dom-id'             => '',
				'resize-width'       => null,
				'resize-height'      => null,
				'resize-quality'     => 0.8,
				'resize-method'      => 'contain',
				'thumbnail-width'    => 120,
				'thumbnail-height'   => 120,
				'thumbnail-method'   => 'crop',
			],
			$atts
		);

		if ( ! is_user_logged_in() ) {
			$atts['desc'] = __( 'Please login to upload files.', 'wp-dropzone' );
		}

		$configs = [
			'ajax_url'          => esc_url( admin_url( 'admin-ajax.php' ) ),
			'nonce'             => wp_create_nonce( 'wp_dropzone_nonce' ),
			'is_user_logged_in' => is_user_logged_in(),
			'id'                => $atts['id'],
			'callback'          => $atts['callback'],
			'title'             => $atts['title'],
			'desc'              => $atts['desc'],
			'max_file_size'     => $atts['max-file-size'],
			'remove_links'      => $atts['remove-links'],
			'clickable'         => $atts['clickable'],
			'accepted_files'    => $atts['accepted-files'],
			'max_files'         => $atts['max-files'],
			'max_files_alert'   => $atts['max-files-alert'],
			'auto_process'      => $atts['auto-process'],
			'dom_id'            => $atts['dom-id'],
			'resize_width'      => $atts['resize-width'],
			'resize_height'     => $atts['resize-height'],
			'resize_quality'    => $atts['resize-quality'],
			'resize_method'     => $atts['resize-method'],
			'thumbnail_width'   => $atts['thumbnail-width'],
			'thumbnail_height'  => $atts['thumbnail-height'],
			'thumbnail_method'  => $atts['thumbnail-method'],
		];

		$html = '<div class="dropzone dropzone-' . esc_attr( $atts['id'] ) . '" id="wp-dz-' . esc_attr( $atts['id'] ) . '" data-config="' . esc_attr( wp_json_encode( $configs ) ) . '">';
		if ( $atts['title'] || $atts['desc'] ) {
			$html .= '<div class="dz-message">
				<h3 class="dropzone-title">' . esc_html( $atts['title'] ) . '</h3>
				<p class="dropzone-note">' . esc_html( $atts['desc'] ) . '</p>
				<div class="dropzone-mobile-trigger needsclick"></div>
			</div>';
		}
		$html .= '</div>';

		// Generate inline CSS for styling.
		$css = '.dropzone-' . $atts['id'] . ' {';
		if ( ! empty( $atts['border-width'] ) ) {
			$css .= 'border-width: ' . $atts['border-width'] . ';';
		}
		if ( ! empty( $atts['border-style'] ) ) {
			$css .= 'border-style: ' . $atts['border-style'] . ';';
		}
		if ( ! empty( $atts['border-color'] ) ) {
			$css .= 'border-color: ' . $atts['border-color'] . ';';
		}
		if ( ! empty( $atts['background'] ) ) {
			$css .= 'background: ' . $atts['background'] . ';';
		}
		if ( ! empty( $atts['margin-bottom'] ) ) {
			$css .= 'margin-bottom: ' . $atts['margin-bottom'] . ';';
		}
		$css .= '}';

		if ( $atts['thumbnail-width'] && $atts['thumbnail-height'] ) {
			$css .= '.dropzone-' . $atts['id'] . ' .dz-preview .dz-image {
				width:100%;
				max-width: ' . $atts['thumbnail-width'] . 'px;
				height:auto;
				max-height: ' . $atts['thumbnail-width'] . 'px;
			}';
		}

		$html .= '<style>' . $this->minify_css( $css ) . '</style>';

		if ( 'false' === $atts['auto-process'] ) {
			$html .= '<button type="button" class="process-upload" id="process-' . esc_attr( $atts['id'] ) . '">' . esc_html( $atts['upload-button-text'] ) . '</button>';
		}

		return $html;
	}

	/**
	 * Minify CSS for inline styles
	 *
	 * Removes comments, unnecessary whitespace, and optimizes CSS
	 * for better performance when outputting inline styles.
	 *
	 * @since 1.1.0
	 * @param string $css Raw CSS to minify.
	 * @return string Minified CSS.
	 */
	protected function minify_css( $css ) {
		// Remove whitespace around symbols.
		$css = preg_replace( '/\s*([{}|:;,])\s*/', '$1', $css );

		// Remove trailing semicolons inside blocks.
		$css = preg_replace( '/;}/', '}', $css );

		// Remove extra whitespace, newlines, tabs.
		$css = preg_replace( '/\s\s+/', ' ', $css );

		return trim( $css );
	}
}
