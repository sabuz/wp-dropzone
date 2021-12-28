=== WP Dropzone ===
Contributors: nazsabuz
Tags: dropzone, wpdropzone, wp dropzone, media, media upload, file, file upload, image, image upload
Requires at least: 4.0
Tested up to: 5.8.2
Stable tag: 1.0.7
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Upload files into WordPress media library from front-end.

== Description ==

Integrate Dropzone with your WordPress site. WP Dropzone will allow you to upload files into WordPress media library from any post/page. It comes with a large number of options and features.

### Features

* Customizable Interface
* File size limit
* Max file limit
* File extension validation
* Image resize with crop
* Image quality reduction
* Guest user restriction
* Supports native dropzone events

### Usage Guideline

use ```[wp-dropzone]``` shortcode in your post/page to show upload area. You may also use ``` echo do_shortcode('[wp-dropzone]'); ``` in your template file.

The plugin comes with the following attributes:

* id: Assign an id to the uploader form. If empty an id will be generated automatically. ID should contain only letters(a-z, A-Z) and numbers(0-9). example: ```[wp-dropzone id="myID123"]```
* callback: Use native dropzone events. See [Dropzone Events](http://www.dropzonejs.com/#events) for details. example: ```[wp-dropzone callback="success: function(file, response) { console.log(file) }"]```
* title: Title of the uploader. example: ```[wp-dropzone title="Drop Files Here"]```
* desc: Description of the uploader. example: ```[wp-dropzone desc="Your file will be uploaded to media"]```
* border-width: Border width of the uploader area. Default '2'. example: ```[wp-dropzone border-width="2"]```
* border-style: Border style of the uploader area. Can be none, hidden, dotted, dashed, double, groove, ridge, inset, outset, initial, inherit. etc. Default 'solid'. example: ```[wp-dropzone border-style="dashed"]```
* border-color: Border color of the uploader area. Use hex color code. Default value '#B0B0B1'. example: ```[wp-dropzone border-color="#dd102d"]```
* background: Background color of the uploader area. Use hex color code. Default '#fff'. example: ```[wp-dropzone background="#fbfbfb"]```
* margin-bottom: Add margin to bottom of the uploader. Default '0'. example: ```[wp-dropzone margin-bottom="10px"]```
* max-file-size: Limit maximum file size. Default value is based on your server settings(php.ini). example: ```[wp-dropzone max-file-size="2"] // set max file size to 2MB```
* remove-links: Add file remove/cancel button. Can be 'true' or 'false'. Default 'false'. ```[wp-dropzone remove-links="true"]```
* clickable: If set to true, the upload zone itself will be clickable, If false the upload zone will not be clickable, you have to drag file on the upload zone to upload file. Default value is 'true'. example: ```[wp-dropzone clickable="false"]```
* accepted-files: Specify the types of files that the uploader accepts. Some valid types are:  audio/*, video/*, image/*, or file extensions e.g.: .gif, .jpg, .png, .doc. example: ```[wp-dropzone accepted-files="image/*"] // only image files accepted```
* max-files: Define how many files are allowed to upload. example: ```[wp-dropzone max-files="1"] // only one file is allowed to uplaod```
* max-files-alert: Show an alert when max file limit is excedeed. example: ```[wp-dropzone max-files="1" max-files-alert="One file is enough!"] // show alert when more than one file```
* auto-process: When set to false, you have click on upload button in order to upload the selected files. Default value is 'true'. example: ```[wp-dropzone auto-process="false"]```
* upload-button-text: Set upload button text. The button will be visible only if 'auto-process' is set to false. example: ```[wp-dropzone auto-process="false" upload-button-text="Click to Upload"]```
* dom-id: HTML dom id where to copy the uploaded file URL. This feature is useful when you want to integrate the file with any form. example: ```[wp-dropzone dom-id="returnUrl"] // the uploaded file url will be copied to '#returnUrl'```
* resize-width: If set, images will be resized to these dimensions before being uploaded. If only one, resize-width or resize-height is provided, the original aspect ratio of the file will be preserved. example: ```[wp-dropzone resize-width="800"]```
* resize-height: If set, images will be resized to these dimensions before being uploaded. If only one, resize-width or resize-height is provided, the original aspect ratio of the file will be preserved. example: ```[wp-dropzone resize-height="600"]```
* resize-quality: Set the quality of the resized images. Can be in a range between 0 and 1. example: ```[wp-dropzone resize-width="800" resize-height="600" resize-quality="0.8"]```
* resize-method: How the images should be scaled down in case both, resize-width and resize-height are provided. Can be either "contain" or "crop". example: ```[wp-dropzone resize-width="800" resize-height="600" resize-method="crop"]```
* thumbnail-width: Resize the width of thumbnail. Default is 120. example: ```[wp-dropzone thumbnail-width="140" thumbnail-method="crop"]```
* thumbnail-height: Resize the height of thumbnail. Default is 120. example: ```[wp-dropzone thumbnail-width="140" thumbnail-height="140" thumbnail-method="crop"]```
* thumbnail-method: How the image thumnail should be scaled down. Can be either "contain" or "crop". example: ```[wp-dropzone thumbnail-width="140" thumbnail-height="140" thumbnail-method="contain"]```


== Installation ==

After downloading and extracting the latest version of WP Stickit:

1. Upload `wp-dropzone` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress

If you encounter any bugs, or have comments or suggestions, please submit a ticket using support forum.


== Upgrade Notice ==
This plugin has been removed from codecanyon and now it is available on wordpress plugin directory for free! Please upgrade to latest version and stay up to date.


== Changelog ==

= 1.0.7 =
* Added: Hooks to perform action before/after upload.

= 1.0.6 =
* Warning: Base filename changed, please reactive the plugin manually after upgrade.
* Security Fix: Removes guest upload feature.
* Updated: Dropzone library.

= 1.0.5 =
* Added: WP 4.9.x support.
* Improved: Coding structure.

= 1.0.4 =
* Improved: Coding structure.

= 1.0.3 =
* Added: Preview thumbnail resize feature.

= 1.0.2 =
* Improved: Asset enqueue and performance.
* Added: User defined id.
* Added: Native dropzone events support.

= 1.0.1 =
* Added: image resize option.
* Added: image crop option.
* Added: image quality option.

= 1.0.0 =
* Initial release.