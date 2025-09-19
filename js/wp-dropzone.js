Dropzone.options['wpDz' + wpDzI18n.instance_id] = {
	url: wpDzI18n.ajax_url + '?action=wp_dropzone_upload_media',
	paramName: 'file',
	maxFilesize: wpDzI18n.max_file_size,
	addRemoveLinks: wpDzI18n.remove_links,
	clickable: wpDzI18n.clickable === 'true',
	acceptedFiles: wpDzI18n.accepted_files,
	autoProcessQueue: wpDzI18n.auto_process === 'true',
	maxFiles: wpDzI18n.max_files,
	resizeWidth: wpDzI18n.resize_width,
	resizeHeight: wpDzI18n.resize_height,
	resizeQuality: wpDzI18n.resize_quality,
	resizeMethod: wpDzI18n.resize_method,
	thumbnailWidth: wpDzI18n.thumbnail_width,
	thumbnailHeight: wpDzI18n.thumbnail_height,
	thumbnailMethod: wpDzI18n.thumbnail_method,
	init: function () {
		var closure = this;

		// auto process false
		if (wpDzI18n.auto_process === 'false') {
			document.getElementById('process-' + wpDzI18n.id).addEventListener('click', function () {
				closure.processQueue();
			});
		}

		// disable if user not logged in
		if (Boolean(wpDzI18n.is_user_logged_in) !== true) {
			this.disable();
		}

		// callback
		var callbacks = wpDzI18n.callback.replace(/(})\s?,/, '},##').split(',##');

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
		data.append('nonce', wpDzI18n.nonce);
		data.append('origtype', file.type);
	},
	maxfilesexceeded: function (file) {
		this.removeFile(file);

		if (wpDzI18n.max_files_alert) {
			alert(wpDzI18n.max_files_alert);
		}
	},
	success: function (file, response) {
		if (wpDzI18n.dom_id.length > 0) {
			if (response.error == 'false') {
				document.getElementById(wpDzI18n.dom_id).value = response.data;
			}
		}
	},
};
