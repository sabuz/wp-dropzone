<?php
/**
 * Plugin Name:       WP Dropzone
 * Plugin URI:        https://wordpress.org/plugins/wp-dropzone/
 * Description:       Upload files into WordPress media library from front-end with drag-and-drop functionality and customizable options.
 * Version:           1.1.0
 * Author:            Nazmul Sabuz
 * Author URI:        https://profiles.wordpress.org/nazsabuz/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       wp-dropzone
 * Domain Path:       /languages
 *
 * @package           WP_Dropzone
 * @version           1.1.0
 * @link              https://wordpress.org/plugins/wp-dropzone/
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

function create_block_wp_dropzone_block_init() {
	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` and registers the block type(s)
	 * based on the registered block metadata.
	 * Added in WordPress 6.8 to simplify the block metadata registration process added in WordPress 6.7.
	 *
	 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
	 */
	if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
		wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
		return;
	}

	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` file.
	 * Added to WordPress 6.7 to improve the performance of block type registration.
	 *
	 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
	 */
	if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
		wp_register_block_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
	}
	/**
	 * Registers the block type(s) in the `blocks-manifest.php` file.
	 *
	 * @see https://developer.wordpress.org/reference/functions/register_block_type/
	 */
	$manifest_data = require __DIR__ . '/build/blocks-manifest.php';
	foreach ( array_keys( $manifest_data ) as $block_type ) {
		register_block_type( __DIR__ . "/build/{$block_type}" );
	}
}
add_action( 'init', 'create_block_wp_dropzone_block_init' );

// Define plugin constants.
define( 'WP_DROPZONE_VERSION', '1.1.0' );
define( 'WP_DROPZONE_BASENAME', plugin_basename( __FILE__ ) );
define( 'WP_DROPZONE_DIR', __DIR__ );
define( 'WP_DROPZONE_URL', plugin_dir_url( __FILE__ ) );

// require necessary class files.
require_once 'includes/class-plugin.php';

// kickstart.
new WP_Dropzone\Plugin();
