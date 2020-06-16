/*jslint browser: true*/
/*global window: false */
/*global poloAF: false */
if (!window.poloAF) {
	window.poloAF = {};
}
window.poloAF.SimpleXhrFactory = (function() {
	// The three branches.
	var standard = {
			createXhrObject: function() {
				return new XMLHttpRequest();
			}
		},
		activeXNew = {
			createXhrObject: function() {
				return new ActiveXObject('Msxml2.XMLHTTP');
			}
		},
		activeXOld = {
			createXhrObject: function() {
				return new ActiveXObject('Microsoft.XMLHTTP');
			}
		},
		// To assign the branch, try each method; return whatever doesn't fail.
		testObject;
	try {
		testObject = standard.createXhrObject();
		return standard; // Return this if no error was thrown.
	} catch (e) {
		try {
			testObject = activeXNew.createXhrObject();
			return activeXNew; // Return this if no error was thrown.
		} catch (e) {
			try {
				testObject = activeXOld.createXhrObject();
				return activeXOld; // Return this if no error was thrown.
			} catch (e) {
				throw new Error('No XHR object found in this environment.');
			}
		}
	}
})();

  function closeKeepAlive() {
        if ( /AppleWebKit|MSIE/.test(navigator.userAgent)) {
          var xhr = new XMLHttpRequest();
          xhr.open( "GET", "/ping/close", false );
          xhr.send();
        }
      }

function dummy() {}

function always(val) {
	return function() {
		return val;
	};
}
window.poloAF.Hijax = function() {
	function fromPost(form) {
		var i,
			query = '';
		for (i = 0; i < form.elements.length; i++) {
			query += form.elements[i].name;
			query += "=";
			query += encodeURI(form.elements[i].value);
			query += "&";
		}
		return query;
	}
	function captureData() {
		if (!container) {
			return true;
		}
		var query = '';
        
        if(container.nodeName.toLowerCase() === 'section'){
            container.onclick = function(e) {
			if (e.target.getAttribute("href") && ret.validate(e.target)) {
				query = e.target.getAttribute("href").split("?")[1];
				url += "?" + query;
                console.log(url);
				return !start();
			}
			return true;
		};
        }
        else if(container.nodeName.toLowerCase() === 'main'){
           container.onsubmit = function(e) {
            if (ret.validate(e.target)) {
			data = fromPost(e.target);
				return !start(); //needs to return false to cancel default action, so success will cancel
            }
			//return true;
		};
        }
	}
	var container,
		url,
		canvas,
		data,
		loading = dummy,
		callback = dummy,
		request;

	function setContainer(value) {
		container = value;
	}

	function setUrl(value) {
		url = value;
	}

	function setCanvas(value) {
		canvas = value;
	}

	function setLoading(value) {
		loading = value;
	}

	function setCallback(value) {
		callback = value;
	}

	function start() {
		request = poloAF.SimpleXhrFactory.createXhrObject();
		if (!request || !url) {
			return false;
		} else {
			initiateRequest();
			return true;
		}
	}

	function completeRequest() {
		if (request.readyState == 4) {
			if (request.status == 200 || request.status == 304) {
				if (canvas) {
					if (request.responseText) {
                        //console.log(request.responseText);
						canvas.innerHTML = request.responseText;
					}
				}
				callback();
			}
		}
	}

	function initiateRequest() {
		loading();
		request.onreadystatechange = completeRequest;
		if (data) {
			request.open("POST", url, true);
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			request.send(data);
		} else {
			request.open("GET", url, true);
			request.send(null);
		}
		//reset url
		url = url.split('?')[0];
	}
	var ret = {
		captureData: captureData,
		validate: always(true), //override as required
		setContainer: setContainer,
		setUrl: setUrl,
		setCanvas: setCanvas,
		setLoading: setLoading,
		setCallback: setCallback
	};
	return ret;
}

/*https://stackoverflow.com/questions/19233415/how-to-make-type-number-to-positive-numbers-only for browsers that don't support the min attribute*/