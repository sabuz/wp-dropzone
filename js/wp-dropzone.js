Dropzone.options['wpDz' + i18n.instance_id] = {
	url: i18n.ajax_url + '?action=wp_dropzone_upload_media',
	paramName: 'file',
	maxFilesize: i18n.max_file_size,
	addRemoveLinks: i18n.remove_links,
	clickable: Boolean(i18n.clickable),
	acceptedFiles: i18n.accepted_files,
	autoProcessQueue: Boolean(i18n.auto_process),
	maxFiles: i18n.max_files,
	maxfilesexceeded: function (file) {
		this.removeFile(file);

		if (i18n.max_files_alert) {
			alert(i18n.max_files_alert);
		}
	},
	resizeWidth: i18n.resize_width,
	resizeHeight: i18n.resize_height,
	resizeQuality: i18n.resize_quality,
	resizeMethod: i18n.resize_method,
	thumbnailWidth: i18n.thumbnail_width,
	thumbnailHeight: i18n.thumbnail_height,
	thumbnailMethod: i18n.thumbnail_method,
	chunking: Boolean(i18n.chunking),
	chunkSize: i18n.chunk_size,
	init: function () {
		var closure = this;

		// auto process false
		if (i18n.auto_process !== '1') {
			document.getElementById("process-' . $id . '").addEventListener('click', function () {
				closure.processQueue();
			});
		}

		// disable if user not logged in
		if (i18n.is_user_logged_in !== '1') {
			this.disable();
		}

		// send nonce token
		this.on('sending', function (file, xhr, data) {
			data.append('nonce', i18n.nonce);
		});

		// callback
		var callbacks = i18n.callback.split(/}\s?,/);

		if (callbacks.length > 0) {
			callbacks.forEach(function (callback) {
				callback = callback.trim().split(/\s?:\s?/);

				if (callback.length === 2) {
					closure.on(callback[0], callback[1]);
				}
			});
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
