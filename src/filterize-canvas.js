class Pixel {
    
    constructor(r,g,b,a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    toData() {
        return [
            this.r,
            this.g,
            this.b,
            this.a,
        ];
    }

    toHex() {
        let n = (this.r << 16) + (this.g << 8) + (this.b);
        return n.toString(16);
    }
}

let Conversions = {
    toRGB(imgData) {
        let rgb = [];
        let data = imgData.data;
        for(var i=0; i < data.length; i +=4) {
            let pixel = new Pixel(data[i], data[i+1], data[i+2], data[i+3]);
            rgb.push(pixel);
        }
        return rgb;
    },
    toImgData(rgb, w, h) {
        
    }
}

class filterize {

    constructor(imgEl, preFilterFn, postFilterFn, brushSize) {
        this.imgEl = imgEl;
        this.preFilter = preFilterFn;
        this.postFilter = postFilterFn;
        this.brushSize = brushSize;
        this.mouseDown = false;

        this.canvas = document.createElement('canvas');
        this.canvas.style.cursor = 'pointer';
        this.ctx = this.canvas.getContext('2d');

        this.imgEl.onload =  (function() {
            let w = this.imgEl.width;
            let h = this.imgEl.height;
            this.canvas.width = w;
            this.canvas.height = h;

            this.ctx.drawImage(this.imgEl, 0, 0, w, h);
            let imgData = this.ctx.getImageData(0, 0, w, h);

            this.preFilter(imgData);

            
            this.canvas.onmousedown = (function(e) { this.mouseDown = true; }).bind(this);
            this.canvas.onmouseup = (function(e) { this.mouseDown = false; }).bind(this);

            this.canvas.onmousemove = (function(e) {
                if(!this.mouseDown) return;

                let x = e.offsetX;
                let y = e.offsetY;
                let h = this.brushSize / 2;
                
                let sx = (e.offsetX - h >= 0) ? e.offsetX - h : 0;
                let sy = (e.offsetY - h >= 0) ? e.offsetY - h : 0;

                let tempData = this.ctx.getImageData(sx,sy, this.brushSize, this.brushSize);
                
                let drawFn = this.createDrawFn(e);
                this.postFilter(tempData, drawFn);

            }).bind(this);
        }).bind(this);
    }

    createDrawFn(e) {
        return (function(imgData) {
            let h = this.brushSize / 2;
            let sx = (e.offsetX - h >= 0) ? e.offsetX - h : 0;
            let sy = (e.offsetY - h >= 0) ? e.offsetY - h : 0;
            this.ctx.putImageData(imgData, sx,sy);

        }).bind(this)
    }

    setPostFilter(fn) {
        this.postFilter = fn;
    }

    setBrushSize(size) {
        this.brushSize = size;
    }

    getCanvas() {
        return this.canvas;
    }
    reset() {
        let w = this.imgEl.width;
        let h = this.imgEl.height;
        this.ctx.drawImage(this.imgEl, 0, 0, w, h);
    }

};


filterize.Conversions = Conversions;
export default filterize;
