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
	 * Register the required assets files for this plugin.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function register_scripts() {
		wp_register_style( 'dropzone', $this->url . 'css/dropzone.min.css', array(), '1.0.8' );
		wp_register_script( 'dropzone', $this->url . 'js/dropzone.min.js', array(), '1.0.8', true );
	}
}
