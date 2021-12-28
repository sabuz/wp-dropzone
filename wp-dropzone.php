<?php

/**
 * @package           Wp_Dropzone
 * @version           1.0.7
 * @link              https://profiles.wordpress.org/nazsabuz/
 *
 * Plugin Name:       WP Dropzone
 * Description:       Upload files into WordPress media library from front-end.
 * Version:           1.0.7
 * Author:            Nazmul Sabuz
 * Author URI:        https://profiles.wordpress.org/nazsabuz/
 * Text Domain:       wp-dropzone
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
	die;
}

/**
 * Including the core plugin functions.
 *
 * @since    1.0.0
 */
require_once dirname(__file__) . '/includes/core-functions.php';