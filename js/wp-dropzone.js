console.log(i18n);

Dropzone.options['wpDz' + i18n.instance_id] = {
	url: i18n.ajax_url + '?action=wp_dz',
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
		if (i18n.auto_process !== '1') {
			var closure = this;
			document.getElementById("process-' . $id . '").addEventListener('click', function () {
				closure.processQueue();
			});
		}

		if (i18n.is_user_logged_in !== '1') {
			this.disable();
		}

		this.on('sending', function (file, xhr, data) {
			data.append('nonce', i18n.nonce);
		});
	},
	success: function (file, response) {
		if (i18n.dom_id.length > 0) {
			if (response.error == 'false') {
				document.getElementById(i18n.dom_id).value = response.data;
			}
		}
	},
	// ' . ($atts.callback ? $atts.callback : '') . '
};
