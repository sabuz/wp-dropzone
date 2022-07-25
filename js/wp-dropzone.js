Dropzone.options['wpDz' + i18n.instance_id] = {
	url: i18n.ajax_url + '?action=wp_dropzone_upload_media',
	paramName: 'file',
	maxFilesize: i18n.max_file_size,
	addRemoveLinks: i18n.remove_links,
	clickable: i18n.clickable === 'true',
	acceptedFiles: i18n.accepted_files,
	autoProcessQueue: i18n.auto_process === 'true',
	maxFiles: i18n.max_files,
	resizeWidth: i18n.resize_width,
	resizeHeight: i18n.resize_height,
	resizeQuality: i18n.resize_quality,
	resizeMethod: i18n.resize_method,
	thumbnailWidth: i18n.thumbnail_width,
	thumbnailHeight: i18n.thumbnail_height,
	thumbnailMethod: i18n.thumbnail_method,
	init: function () {
		var closure = this;

		// auto process false
		if (i18n.auto_process === 'false') {
			document.getElementById('process-' + i18n.id).addEventListener('click', function () {
				closure.processQueue();
			});
		}

		// disable if user not logged in
		if (Boolean(i18n.is_user_logged_in) !== true) {
			this.disable();
		}

		// callback
		var callbacks = i18n.callback.replace(/(})\s?,/, '},##').split(',##');

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
		data.append('nonce', i18n.nonce);
		data.append('origtype', file.type);
	},
	maxfilesexceeded: function (file) {
		this.removeFile(file);

		if (i18n.max_files_alert) {
			alert(i18n.max_files_alert);
		}
	},
	success: function (file, response) {
		if (i18n.dom_id.length > 0) {
			if (response.error == 'false') {
				document.getElementById(i18n.dom_id).value = response.data;
			}
		}
	},
};
