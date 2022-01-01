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
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'wp_ajax_wp_dropzone_upload_media', array( $this, 'ajax_upload_handle' ) );
		add_shortcode( 'wp-dropzone', array( $this, 'add_shortcode' ) );
	}

	/**
	 * Register the required asset files for this plugin.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function enqueue_scripts() {
		global $post;

		if ( is_a( $post, 'WP_Post' ) && has_shortcode( $post->post_content, 'wp-dropzone' ) ) {
			wp_enqueue_style( 'dropzone', $this->url . 'css/dropzone.min.css', array(), '1.0.8' );
			wp_enqueue_script( 'dropzone', $this->url . 'js/dropzone.min.js', array(), '1.0.8', true );
			wp_enqueue_script( 'wp-dropzone', $this->url . 'js/wp-dropzone.js', array( 'dropzone' ), '1.0.8', true );
		}
	}

	/**
	 * Handle ajax file upload to media library.
	 *
	 * @since    1.0.0
	 */
	public function ajax_upload_handle() {
		// phpcs:ignore
		if ( ! wp_verify_nonce( $_POST['nonce'], 'wp_dropzone_nonce' ) ) {
			return;
		}

		$message = array(
			'error' => true,
			'data'  => __( 'no file to upload.', 'wp-dropzone' ),
		);

		if ( ! isset( $_FILES['file'] ) || empty( $_FILES['file'] ) ) {
			wp_send_json( $message );
		}

		// phpcs:ignore
		$file = $_FILES['file'];

		// include file library if not exist.
		if ( ! function_exists( 'wp_handle_upload' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}

		// fire hook before upload.
		do_action( 'wp_dropzone_before_upload_file', $file );

		// upload file to server.
		$movefile = wp_handle_upload( $file, array( 'test_form' => false ) );

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
			$attachment_id = wp_insert_attachment( $attachment, $filename );

			// fire hook after insert media.
			do_action( 'wp_dropzone_after_insert_attachment', $attachment_id );

			// if attachment success.
			if ( $attachment_id ) {
				require_once ABSPATH . 'wp-admin/includes/image.php';

				// update attachment metadata.
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
	 * Add wp-dropzone shortcode.
	 *
	 * @since 1.0.0
	 * @param array $atts attributes passed to shortcode.
	 * @return string
	 */
	public function add_shortcode( $atts ) {
		$atts = shortcode_atts(
			array(
				'id'                 => wp_rand( 0, 999 ),
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
				'max-files-alert'    => __( 'Max file limit excedeed.', 'wp-dropzone' ),
				'auto-process'       => 'true',
				'upload-button-text' => __( 'Uplaod', 'wp-dropzone' ),
				'dom-id'             => '',
				'resize-width'       => null,
				'resize-height'      => null,
				'resize-quality'     => 0.8,
				'resize-method'      => 'contain',
				'thumbnail-width'    => 120,
				'thumbnail-height'   => 120,
				'thumbnail-method'   => 'crop',
				'chunking'           => 'false',
				'chunk-size'         => 2000000,
			),
			$atts
		);

		if ( ! is_user_logged_in() ) {
			$atts['desc'] = __( 'Please login to upload files.', 'wp-dropzone' );
		}

		$html = '<form action="" class="dropzone dropzone-' . $atts['id'] . '" id="wp-dz-' . $atts['id'] . '">';
		if ( $atts['title'] || $atts['desc'] ) {
			$html .= '<div class="dz-message">
				<h3 class="dropzone-title">' . $atts['title'] . '</h3>
				<p class="dropzone-note">' . $atts['desc'] . '</p>
				<div class="dropzone-mobile-trigger needsclick"></div>
			</div>';
		}
		$html .= '</form>';

		if ( 'false' === $atts['auto-process'] ) {
			$html .= '<button class="process-upload" id="process-' . $atts['id'] . '">' . $atts['upload-button-text'] . '</button>';
		}

		// inline css.
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

		// enqueue scripts.
		wp_add_inline_style( 'dropzone', $css );

		// localize.
		wp_localize_script(
			'wp-dropzone',
			'i18n',
			array(
				'ajax_url'          => admin_url( 'admin-ajax.php' ),
				'nonce'             => wp_create_nonce( 'wp_dropzone_nonce' ),
				'is_user_logged_in' => is_user_logged_in(),
				'id'                => $atts['id'],
				'instance_id'       => ucfirst( $atts['id'] ),
				'callback'          => $atts['callback'],
				'title'             => $atts['title'],
				'desc'              => $atts['desc'],
				'max_file_size'     => $atts['max-file-size'],
				'remove_links'      => $atts['remove-links'],
				'clickable'         => (bool) $atts['clickable'],
				'accepted_files'    => $atts['accepted-files'],
				'max_files'         => $atts['max-files'],
				'max_files_alert'   => $atts['max-files-alert'],
				'auto_process'      => (bool) $atts['auto-process'],
				'dom_id'            => $atts['dom-id'],
				'resize_width'      => $atts['resize-width'],
				'resize_height'     => $atts['resize-height'],
				'resize_quality'    => $atts['resize-quality'],
				'resize_method'     => $atts['resize-method'],
				'thumbnail_width'   => $atts['thumbnail-width'],
				'thumbnail_height'  => $atts['thumbnail-height'],
				'thumbnail_method'  => $atts['thumbnail-method'],
				'chunking'          => (bool) $atts['chunking'],
				'chunk_size'        => $atts['chunk-size'],
			)
		);

		return $html;
	}
}
