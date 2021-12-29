<?php
/**
 * Plugin Name: WP Dropzone
 * Description: Upload files into WordPress media library from front-end.
 * Version: 1.0.7
 * Author: Nazmul Sabuz
 * Author URI: https://profiles.wordpress.org/nazsabuz/
 * Text Domain: wp-dropzone
 *
 * @package NazSabuz/WPDropzone
 */

// If this file is called directly, abort.
defined( 'ABSPATH' ) || exit;

// require necessary class files.
require_once 'includes/class-plugin.php';

// kickstart.
new NazSabuz\WPDropzone\Plugin( __DIR__, plugin_dir_url( __FILE__ ) );
