Dropzone.options['wpDz' + i18n.instance_id] = {
	url: i18n.ajax_url + '?action=wp_dz',
	paramName: 'file',
	maxFilesize: i18n['max-file-size'],
	addRemoveLinks: i18n['remove-links'],
	clickable: i18n.clickable,
	acceptedFiles: i18n['accepted-files'],
	autoProcessQueue: i18n['auto-process'],
	maxFiles: i18n['max-files'],
	maxfilesexceeded: function (file) {
		this.removeFile(file);

		if (i18n['max-files-alert']) {
			alert(i18n['max-files-alert']);
		}
	},
	resizeWidth: i18n['resize-width'],
	resizeHeight: i18n['resize-height'],
	resizeQuality: i18n['resize-quality'],
	resizeMethod: i18n['resize-method'],
	thumbnailWidth: i18n['thumbnail-width'],
	thumbnailHeight: i18n['thumbnail-height'],
	thumbnailMethod: i18n['thumbnail-method'],
	chunking: i18n.chunking,
	chunkSize: i18n['chunk-size'],
	init: function () {
		if (i18n['auto-process'] == 'false') {
			var closure = this;
			document.getElementById("process-' . $id . '").addEventListener('click', function () {
				closure.processQueue();
			});
		}

		if (!i18n.logged_in) {
			this.disable();
		}
	},
	success: function (file, response) {
		if (i18n['dom-id']) {
			if (response.error == 'false') {
				document.getElementById(i18n['dom-id']).value = response.data;
			}
		}
	},
	// ' . ($atts['callback'] ? $atts['callback'] : '') . '
};
