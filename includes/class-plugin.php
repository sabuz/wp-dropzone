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
		add_action( 'wp_ajax_wp_dz', array( $this, 'ajax_upload_handle' ) );
		add_shortcode( 'wp-dropzone', array( $this, 'add_shortcode' ) );

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
		wp_register_script( 'wp-dropzone', $this->url . 'js/wp-dropzone.js', array( 'dropzone' ), '1.0.8', true );
	}

	/**
	 * Handle ajax file upload to media library.
	 *
	 * @since    1.0.0
	 */
	public function ajax_upload_handle() {
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
				'id'                 => '',
				'callback'           => '',
				'title'              => '',
				'desc'               => '',
				'border-width'       => '',
				'border-style'       => '',
				'border-color'       => '',
				'background'         => '',
				'margin-bottom'      => '',
				'max-file-size'      => '',
				'remove-links'       => '',
				'clickable'          => '',
				'accepted-files'     => '',
				'max-files'          => '',
				'max-files-alert'    => '',
				'auto-process'       => '',
				'upload-button-text' => __( 'Uplaod', 'wp-dropzone' ),
				'dom-id'             => '',
				'resize-width'       => '',
				'resize-height'      => '',
				'resize-quality'     => '',
				'resize-method'      => '',
				'thumbnail-width'    => '',
				'thumbnail-height'   => '',
				'thumbnail-method'   => '',
				'chunking'           => false,
				'chunk-size'         => 2000000,
			),
			$atts
		);

		if ( $atts['id'] ) {
			$id = $atts['id'];
		} else {
			$id = wp_rand( 0, 999 );
		}

		if ( ! is_user_logged_in() ) {
			$atts['desc'] = __( 'Please login to upload files.', 'wp-dropzone' );
		}

		$ajax_url = admin_url( 'admin-ajax.php' );

		$html = '<form action="" class="dropzone dropzone-' . $id . '" id="wp-dz-' . $id . '">';
		if ($atts['title'] || $atts['desc']) {
			$html .= '<div class="dz-message">
				<h3 class="dropzone-title">' . $atts['title'] . '</h3>
				<p class="dropzone-note">' . $atts['desc'] . '</p>
				<div class="dropzone-mobile-trigger needsclick"></div>
			</div>';
		}

		$html .= wp_nonce_field('wp_dz_protect', 'wp_dz_nonce') . '
		</form>';

		if ($atts['auto-process'] == 'false') {
			$html .= '<button class="process-upload" id="process-' . $id . '">' . $atts['upload-button-text'] . '</button>';
		}

		$js = 'Dropzone.options.wpDz' . ucfirst($id) . ' = {
			url: "' . $ajax_url . '?action=wp_dz",
			paramName: "file",
			' . ($atts['max-file-size'] ? 'maxFilesize: ' . $atts['max-file-size'] . ',' : '') . '
			' . ($atts['remove-links'] ? 'addRemoveLinks: ' . $atts['remove-links'] . ',' : '') . '
			' . ($atts['clickable'] ? 'clickable: ' . $atts['clickable'] . ',' : '') . '
			' . ($atts['accepted-files'] ? 'acceptedFiles: "' . $atts['accepted-files'] . '",' : '') . '
			' . ($atts['auto-process'] ? 'autoProcessQueue: ' . $atts['auto-process'] . ',' : '') . '
			' . ($atts['max-files'] ? 'maxFiles: ' . $atts['max-files'] . ', maxfilesexceeded: function(file) { this.removeFile(file); ' . ($atts['max-files-alert'] ? 'alert("' . $atts['max-files-alert'] . '");' : '') . ' },' : '') . '
			' . ($atts['resize-width'] ? 'resizeWidth: ' . $atts['resize-width'] . ',' : '') . '
			' . ($atts['resize-height'] ? 'resizeHeight: ' . $atts['resize-height'] . ',' : '') . '
			' . ($atts['resize-quality'] ? 'resizeQuality: ' . $atts['resize-quality'] . ',' : '') . '
			' . ($atts['resize-method'] ? 'resizeMethod: "' . $atts['resize-method'] . '",' : '') . '
			' . ($atts['thumbnail-width'] ? 'thumbnailWidth: ' . $atts['thumbnail-width'] . ',' : '') . '
			' . ($atts['thumbnail-height'] ? 'thumbnailHeight: ' . $atts['thumbnail-height'] . ',' : '') . '
			' . ($atts['thumbnail-method'] ? 'thumbnailMethod: "' . $atts['thumbnail-method'] . '",' : '') . '
			' . ($atts['chunking'] ? 'chunking: "' . $atts['chunking'] . '",' : '') . '
			' . ($atts['chunk-size'] ? 'chunkSize: "' . $atts['chunk-size'] . '",' : '') . '

			init: function() {
				' . ($atts['auto-process'] == 'false' ? 'var closure = this; document.getElementById("process-' . $id . '").addEventListener("click", function() { closure.processQueue(); })' : '') . '
				' . (!is_user_logged_in() ? 'this.disable();' : '') . '
			},
			success: function(file, response) {
				' . ($atts['dom-id'] ? 'if(response.error=="false"){document.getElementById("' . $atts['dom-id'] . '").value = response.data}' : '') . '
			},
			' . ($atts['callback'] ? $atts['callback'] : '') . '
		};';

		$css = '.dropzone-' . $id . ' {
			' . ($atts['border-width'] ? 'border-width: ' . $atts['border-width'] . ';' : '') . '
			' . ($atts['border-style'] ? 'border-style: ' . $atts['border-style'] . ';' : '') . '
			' . ($atts['border-color'] ? 'border-color: ' . $atts['border-color'] . ';' : '') . '
			' . ($atts['background'] ? 'background: ' . $atts['background'] . ';' : '') . '
			' . ($atts['margin-bottom'] ? 'margin-bottom: ' . $atts['margin-bottom'] . ';' : '') . '
		}';

		if ($atts['thumbnail-width'] || $atts['thumbnail-height']) {
			$css .= '.dropzone-' . $id . ' .dz-preview .dz-image {
				' . ($atts['thumbnail-width'] ? 'width:100%;max-width: ' . $atts['thumbnail-width'] . 'px;' : '') . '
				' . ($atts['thumbnail-height'] ? 'height:auto;max-height: ' . $atts['thumbnail-width'] . 'px;' : '') . '
			}';
		}

		// enqueue scripts.
		wp_enqueue_style( 'dropzone' );
		wp_add_inline_style( 'dropzone', $css );

		wp_enqueue_script( 'wp-dropzone' );
		wp_localize_script(
			'wp-dropzone',
			'i18n',
			array_merge(
				array(
					'ajax_url'    => admin_url( 'admin-ajax.php' ),
					'nonce'       => wp_create_nonce( 'wp_dropzone_nonce' ),
					'size_limit'  => ini_get( 'upload_max_filesize' ),
					'logged_in'   => is_user_logged_in(),
					'instance_id' => ucfirst( $id ),
				),
				$atts
			)
		);

		// wp_add_inline_script( 'dropzone', $js );

		return $html;
	}
}
