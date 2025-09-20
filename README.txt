=== WP Dropzone ===
Contributors: nazsabuz
Tags: dropzone, wpdropzone, wp dropzone, media, media upload, file, file upload, image, image upload, drag drop
Requires at least: 6.0
Tested up to: 6.8
Requires PHP: 7.0
Stable tag: 1.1.0
License: GPLv2 or later
License URI: <https://www.gnu.org/licenses/gpl-2.0.html>

Upload files into WordPress media library from front-end with drag-and-drop functionality and customizable options.

== Description ==

WP Dropzone integrates the powerful Dropzone.js library with WordPress, allowing you to upload files directly into the WordPress media library from any post, page, or front-end location. The plugin provides a modern, user-friendly drag-and-drop interface with extensive customization options and advanced features for file management.

### Key Features

* **Drag & Drop Interface** - Modern, intuitive file upload experience
* **Customizable Styling** - Full control over appearance with CSS customization
* **File Validation** - Built-in file type and size validation
* **Image Processing** - Automatic image resizing, cropping, and quality optimization
* **Thumbnail Generation** - Customizable thumbnail previews
* **Security Features** - Nonce verification and user permission checks
* **Action Hooks** - WordPress hooks for customization and integration
* **Translation Ready** - Full internationalization support
* **Performance Optimized** - Assets loaded only when needed

### Shortcode Usage

Use the `[wp-dropzone]` shortcode in your posts, pages, or templates:

```
[wp-dropzone]
```

Or in PHP templates:

```
<?php echo do_shortcode('[wp-dropzone]'); ?>
```

### Shortcode Attributes

| Attribute | Description | Default | Example |
|-----------|-------------|---------|---------|
| `id` | Unique identifier for the dropzone instance | Auto-generated | `[wp-dropzone id="myUploader"]` |
| `title` | Title displayed above the dropzone | Empty | `[wp-dropzone title="Drop Files Here"]` |
| `desc` | Description text for the dropzone | Empty | `[wp-dropzone desc="Upload your files here"]` |
| `max-file-size` | Maximum file size in MB | Server limit | `[wp-dropzone max-file-size="5"]` |
| `accepted-files` | Allowed file types | All files | `[wp-dropzone accepted-files="image/*"]` |
| `max-files` | Maximum number of files | Unlimited | `[wp-dropzone max-files="3"]` |
| `auto-process` | Auto-upload files when dropped | true | `[wp-dropzone auto-process="false"]` |
| `clickable` | Make dropzone clickable | true | `[wp-dropzone clickable="false"]` |
| `remove-links` | Show remove file buttons | false | `[wp-dropzone remove-links="true"]` |
| `upload-button-text` | Text for manual upload button | "Upload Files" | `[wp-dropzone upload-button-text="Upload Selected Files"]` |
| `resize-width` | Resize images to specified width | Original | `[wp-dropzone resize-width="800"]` |
| `resize-height` | Resize images to specified height | Original | `[wp-dropzone resize-height="600"]` |
| `resize-quality` | Image quality (0.1-1.0) | 0.8 | `[wp-dropzone resize-quality="0.9"]` |
| `resize-method` | Resize method: contain/crop | contain | `[wp-dropzone resize-method="crop"]` |
| `thumbnail-width` | Thumbnail width in pixels | 120 | `[wp-dropzone thumbnail-width="150"]` |
| `thumbnail-height` | Thumbnail height in pixels | 120 | `[wp-dropzone thumbnail-height="150"]` |
| `thumbnail-method` | Thumbnail method: contain/crop | crop | `[wp-dropzone thumbnail-method="contain"]` |

### Styling Options

| Attribute | Description | Example |
|-----------|-------------|---------|
| `border-width` | Border width | `[wp-dropzone border-width="3px"]` |
| `border-style` | Border style (solid, dashed, etc.) | `[wp-dropzone border-style="dashed"]` |
| `border-color` | Border color (hex code) | `[wp-dropzone border-color="#007cba"]` |
| `background` | Background color (hex code) | `[wp-dropzone background="#f0f0f1"]` |
| `margin-bottom` | Bottom margin | `[wp-dropzone margin-bottom="20px"]` |

### Advanced Features

#### Action Hooks

The plugin provides several action hooks for customization:

```php
// Before file upload
do_action( 'wp_dropzone_before_upload_file', $file );

// After file upload
do_action( 'wp_dropzone_after_upload_file', $file );

// After media library insertion
do_action( 'wp_dropzone_after_insert_attachment', $attachment_id );
```

#### JavaScript Integration

Access dropzone instance and events:

```javascript
// Get dropzone instance
var dropzone = Dropzone.forElement("#wp-dz-yourID");

// Add event listeners
dropzone.on("success", function(file, response) {
    console.log("File uploaded:", response);
});
```

### Examples

#### Basic Image Upload

```
[wp-dropzone accepted-files="image/*" max-files="5" title="Upload Images"]
```

#### Document Upload with Restrictions

```
[wp-dropzone 
    accepted-files=".pdf,.doc,.docx" 
    max-file-size="10" 
    title="Upload Documents" 
    desc="PDF, DOC, DOCX files only"
]
```

#### Styled Upload Area

```
[wp-dropzone 
    title="Drop Files Here" 
    desc="Drag and drop files or click to browse"
    border-style="dashed" 
    border-color="#007cba" 
    background="#f8f9fa"
]
```

#### Manual Upload Button

```
[wp-dropzone 
    auto-process="false" 
    upload-button-text="Upload Selected Files"
    title="Select Files"
]
```

== Installation ==

1. Upload the `wp-dropzone` folder to your `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Use the `[wp-dropzone]` shortcode in your posts, pages, or templates

### Requirements

* WordPress 6.0 or higher
* PHP 7.0 or higher
* Modern web browser with JavaScript enabled

== Frequently Asked Questions ==

= Do I need to be logged in to upload files? =

Yes, only logged-in users can upload files for security reasons. Guest users will see a login prompt.

= Can I customize the appearance? =

Yes, you can customize colors, borders, and spacing using the shortcode attributes. For advanced styling, you can add custom CSS.

= What file types are supported? =

All file types are supported by default. You can restrict file types using the `accepted-files` attribute.

= Can I integrate with custom forms? =

Yes, you can use the `dom-id` attribute to copy uploaded file URLs to form fields.

== Screenshots ==

1. Default dropzone interface
2. Custom styled upload area
3. File preview with thumbnails
4. Upload progress indication
5. Admin settings and options

== Changelog ==

= 1.1.0 =

* Added: FSE theme support
* Added: Improved error handling and user feedback
* Added: Enhanced security with nonce verification
* Added: Translation support and POT file
* Improved: Code structure and documentation
* Improved: Performance optimizations
* Updated: WordPress compatibility to 6.8
* Fixed: Minor bugs and typos

= 1.0.7 =

* Added: Action hooks for before/after upload events

= 1.0.6 =

* Security Fix: Removed guest upload feature
* Updated: Dropzone library to latest version
* Warning: Plugin reactivation required after upgrade

= 1.0.5 =

* Added: WordPress 4.9.x compatibility
* Improved: Code structure and organization

= 1.0.4 =

* Improved: Overall code structure

= 1.0.3 =

* Added: Thumbnail resize functionality

= 1.0.2 =

* Added: Custom ID support
* Added: Native Dropzone events support
* Improved: Asset loading and performance

= 1.0.1 =

* Added: Image resize and crop options
* Added: Image quality control

= 1.0.0 =

* Initial release with basic functionality

== Upgrade Notice ==

= 1.1.0 =
Major update with FSE theme support, improved security, and translation support.

= 1.0.6 =
Security update: Guest uploads removed. Please reactivate the plugin after upgrading.

== Support ==

For support, feature requests, or bug reports, please visit the [WordPress.org support forum](https://wordpress.org/support/plugin/wp-dropzone/).

== Contributing ==

Contributions are welcome! Please submit pull requests or report issues on the plugin's GitHub repository.

== Credits ==

* Built with [Dropzone.js](https://www.dropzonejs.com/)
* WordPress integration and customization by Nazmul Sabuz
