(function() {

    var img = document.getElementById('replaceMe');
    var pre = function(imgData) {
        console.log(imgData);
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

    function createColorFilter(n) {
         return function(data) {
            for (var i = 0; i < data.length; i += 4) {
                data[i+n] = (data[i + n] << 2);
            }
            return data;
        };
    }

    convertToRed = createColorFilter(0);
    convertToGreen = createColorFilter(1);
    convertToBlue = createColorFilter(2);

    var ff = convertToRed;
    var activeColor = document.getElementsByClassName('button-primary')[0];

    function createEventListener(fn) {
        return function() {
            ff = fn;
            document.getElementsByClassName('button-primary')[0].classList.remove('button-primary');
            this.classList.add('button-primary');
        }
    }

    document.getElementById('red').addEventListener('click',createEventListener(convertToRed) )
    document.getElementById('green').addEventListener('click',createEventListener(convertToGreen) )
    document.getElementById('blue').addEventListener('click',createEventListener(convertToBlue) )
    document.getElementById('gray').addEventListener('click',createEventListener(convertToGray) )

    var post = function(imgData, drawFn) {
        imgData.data = ff(imgData.data);
        drawFn(imgData);
    };

    var f = new filterize(img, pre, post, 20);

    var c = f.getCanvas();
    document.getElementById('putCanvasHere').appendChild(c);

    document.getElementById('reset').addEventListener('click', function() {
        f.reset();
    });
    
    var brushEl = document.getElementById('brush');
    document.getElementById('brush').addEventListener('change', function() {
        f.setBrushSize(brushEl.value);
        console.log('change');

    });

}).call(this);
