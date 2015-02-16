var download=function($http,$window) {
	var saveBlob=function(filename,data,contentType,octetStreamMime){
		var success=false;
		try{
			// Try using msSaveBlob if supported
			console.log("Trying saveBlob method ...");
			var blob = new Blob([data], { type: contentType });
			if(navigator.msSaveBlob)
				navigator.msSaveBlob(blob, filename);
			else {
				// Try using other saveBlob implementations, if available
				var saveBlob = navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
				if(saveBlob === undefined) throw "Not supported";
				saveBlob(blob, filename);
			}
			console.log("saveBlob succeeded");
			success = true;
		} catch(ex){
			console.log("saveBlob method failed with the following exception:");
			console.log(ex);
		}

		if(!success){
			// Get the blob url creator
			var urlCreator = $window.URL || $window.webkitURL || $window.mozURL || $window.msURL;
			if(urlCreator){
				// Try to use a download link
				var link = document.createElement('a');
				if('download' in link){
					// Try to simulate a click
					try{
						// Prepare a blob URL
						console.log("Trying download link method with simulated click ...");
						var blob = new Blob([data], { type: contentType });
						var url = urlCreator.createObjectURL(blob);
						link.setAttribute('href', url);

						// Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
						link.setAttribute("download", filename);

						// Simulate clicking the download link
						var event = document.createEvent('MouseEvents');
						event.initMouseEvent('click', true, true, $window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
						link.dispatchEvent(event);
						console.log("Download link method with simulated click succeeded");
						success = true;

					} catch(ex) {
						console.log("Download link method with simulated click failed with the following exception:");
						console.log(ex);
					}
				}

				if(!success){
					// Fallback to window.location method
					try{
						// Prepare a blob URL
						// Use application/octet-stream when using window.location to force download
						console.log("Trying download link method with window.location ...");
						var blob = new Blob([data], { type: octetStreamMime });
						var url = urlCreator.createObjectURL(blob);
						$window.location = url;
						console.log("Download link method with window.location succeeded");
						success = true;
					} catch(ex) {
						console.log("Download link method with window.location failed with the following exception:");
						console.log(ex);
					}
				}
			}
		}

		if(!success){
			// Fallback to window.open method
			console.log("No methods worked for saving the arraybuffer, using last resort window.open");
			$window.open(httpPath, '_blank', '');
		}
	};
	this.downloadFile = function(httpPath,data) {
		var octetStreamMime = 'application/octet-stream';
		var filename =httpPath;
		var contentType=octetStreamMime;
		
		if(angular.isUndefined(data)){
			// Use an arraybuffer
			$http.get(httpPath, { responseType: 'arraybuffer' })
			.success( function(data, status, headers) {
				// Get the headers
				headers = headers();
				// Get the filename from the x-filename header or default to "download.bin"
				filename = headers['x-filename'] || httpPath.split('/').pop() || 'download.bin';
				// Determine the content type from the header or default to "application/octet-stream"
				contentType = headers['content-type'] || octetStreamMime;
				saveBlob(filename, data, contentType, octetStreamMime);
			})
			.error(function(data, status) {
				console.log("Request failed with status: " + status);
			});
		}else{
			saveBlob(filename, data, contentType, octetStreamMime);
		}
	};
};
module.exports=download;