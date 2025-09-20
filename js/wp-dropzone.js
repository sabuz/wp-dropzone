// Initialize dropzone instances after DOM is ready
document.addEventListener('DOMContentLoaded', function () {
	var dropzoneForms = document.querySelectorAll('.dropzone[data-config]');

	dropzoneForms.forEach(function (form) {
		var configData = JSON.parse(form.getAttribute('data-config'));

		// Initialize Dropzone manually on the form element
		var dropzone = new Dropzone('#'+form.id, {
			url: configData.ajax_url + '?action=wp_dropzone_upload_media',
			paramName: 'file',
			maxFilesize: configData.max_file_size,
			addRemoveLinks: configData.remove_links,
			clickable: configData.clickable === 'true',
			acceptedFiles: configData.accepted_files,
			autoProcessQueue: configData.auto_process === 'true',
			maxFiles: configData.max_files,
			resizeWidth: configData.resize_width,
			resizeHeight: configData.resize_height,
			resizeQuality: configData.resize_quality,
			resizeMethod: configData.resize_method,
			thumbnailWidth: configData.thumbnail_width,
			thumbnailHeight: configData.thumbnail_height,
			thumbnailMethod: configData.thumbnail_method,
			init: function () {
				var closure = this;

				// auto process false
				if (configData.auto_process === 'false') {
					document
						.getElementById('process-' + configData.id)
						.addEventListener('click', function () {
							closure.processQueue();
						});
				}

				// disable if user not logged in
				if (Boolean(configData.is_user_logged_in) !== true) {
					this.disable();
				}

				// callback
				var callbacks = configData.callback.replace(/(})\s?,/, '},##').split(',##');

				if (callbacks.length > 0) {
					callbacks.forEach(function (callback) {
						callback = callback.trim().split(/\s?:\s?/);

						if (callback.length === 2) {
							eval('var func = ' + callback[1]);
							closure.on(callback[0], func);
						}
					});
				}
			},
			sending: function (file, xhr, data) {
				data.append('nonce', configData.nonce);
				data.append('origtype', file.type);
			},
			maxfilesexceeded: function (file) {
				this.removeFile(file);

				if (configData.max_files_alert) {
					alert(configData.max_files_alert);
				}
			},
			success: function (file, response) {
				if (configData.dom_id.length > 0) {
					if (response.error == 'false') {
						document.getElementById(configData.dom_id).value = response.data;
					}
				}
			},
		});
	});
});
