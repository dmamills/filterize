(function() {

    var img = document.getElementById('replaceMe');
    var pre = function(imgData) {

    };


    function convertToGray(data) {
        for (var i = 0; i < data.length; i += 4) {
           var avg = (data[i] + data[i +1] + data[i +2]) / 3;
           data[i] = avg;
           data[i + 1] = avg;
           data[i + 2] = avg;
        }

        return data;
    }


    function alternateFilter(data) {
           var testFilter =  [
               [ 0, 0, 0],
               [ 0, 1, 0],
               [ 0, 0, 0]
           ];
        
           var factor = 1.0;
           var bias = 0.0;

    }

    function createColorFilter(n) {
         return function(data) {
            for (var i = 0; i < data.length; i += 4) {
                data[i+n] = (data[i+n] << 2 <= 255) ? (data[i + n] << 2) : 255;
            }
            return data;
        };
    }

    function createEventListener(fn) {
        return function() {
            ff = fn;
            document.getElementsByClassName('button-primary')[0].classList.remove('button-primary');
            this.classList.add('button-primary');
        }
    }

    convertToRed = createColorFilter(0);
    convertToGreen = createColorFilter(1);
    convertToBlue = createColorFilter(2);

    var ff = convertToRed;

    document.getElementById('red').addEventListener('click',createEventListener(convertToRed) )
    document.getElementById('green').addEventListener('click',createEventListener(convertToGreen) )
    document.getElementById('blue').addEventListener('click',createEventListener(convertToBlue) )
    document.getElementById('gray').addEventListener('click',createEventListener(convertToGray) )

    var post = function(imgData, drawFn) {
        imgData.data = ff(imgData.data);
        drawFn(imgData);
    };

    var f = new filterize(img, pre, post, 20);
    document.getElementById('putCanvasHere').appendChild(f.getCanvas());

    document.getElementById('reset').addEventListener('click', function() {
        f.reset();
    });
    
    var brushEl = document.getElementById('brush');
    var brushSizeEl = document.getElementById('brushSize');
    document.getElementById('brush').addEventListener('change', function() {
            
        brushSizeEl.innerHTML = brushEl.value;
        f.setBrushSize(brushEl.value);
    });


    document.getElementById('save').addEventListener('click', function() {

        var data = f.getCanvas().toDataURL();
        var formData = new FormData();
        formData.append('data', data);
        fetch('/save', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: data
            })
          }).then(function(res) { return res.json();})
          .then(function(data) {
            var tempEl = document.createElement('a');
            tempEl.href = 'http://localhost:8000/download/' + data.id;
            tempEl.click();
          });
    });

    document.getElementById('uploadForm').onsubmit = function(e) {
        e.preventDefault();
        fetch('/upload', {
            method: 'post',
            body: new FormData(this)
        }).then(function(res) {
            return res.json();
        }).then(function(data) { 
            console.log(data) 
            img.src = '/' + data.filepath;
            f = new filterize(img, pre, post, 20);
            var canvasHolder = document.getElementById('putCanvasHere');
            canvasHolder.innerHTML = '';
            canvasHolder.appendChild(f.getCanvas());

        });
    };

}).call(this);
