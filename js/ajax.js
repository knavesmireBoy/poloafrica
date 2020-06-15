/*jslint browser: true*/
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global _: false */
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

    /* LISTENER required on PERSISTENT ELEMENT then delegated as forward/back links are RE-CREATED by PHP TEMPLATE on pagination*/
    function fromGet(){
        var query = '',
            that = this;
        container.onclick = function(e){
            if(e.target.getAttribute("href") && that.validate(e.target)){
            query = e.target.getAttribute("href").split("?")[1];
            url += "?" + query;
            return !start();
            }
            return true;
        };
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
        console.log(url);
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
                    if(request.responseText){
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
            //reset query
            url = url.split('?')[0];

		}
	}
	var ret = {
		captureData: function() {
        if(!container){
            return true;
        }
			if (container.nodeName.toLowerCase() === "form") {
				container.onsubmit = function(){
                    data = fromPost(container);
					/*https://stackoverflow.com/questions/19233415/how-to-make-type-number-to-positive-numbers-only
					for browsers that don't support the min attribute*/
                    if(ret.validate(data)){
                        return !start(); //needs to return false to cancel default action, so success will cancel
                    }
                    return true;
				};
			} else {
				//var links = container.getElementsByTagName("a");
                //fromGet(links);
                fromGet.call(this);
				data = null;
				//links = null;
			}
		},
		validate: always(true),//override
		setContainer: setContainer,
		setUrl: setUrl,
		setCanvas: setCanvas,
		setLoading: setLoading,
		setCallback: setCallback
	};
	return ret;
}