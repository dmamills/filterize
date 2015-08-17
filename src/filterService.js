import Filter from 'Filter';

let filterService = () => {

    let grayscaleFilter = new Filter('grayscale',(data) => {
        for (var i = 0; i < data.length; i += 4) {
           var avg = (data[i] + data[i +1] + data[i +2]) / 3;
           data[i] = avg;
           data[i + 1] = avg;
           data[i + 2] = avg;
        }

        return data;
    });

    let createAlterFilter = (threshold) => {
        return (data) => {
            for(var i =0; i < data.length;i += 4) {
                data[i] = data[i] + (data[i] * threshold);
                data[i+1] = data[i+1] + (data[i+1] * threshold);
                data[i+2] = data[i+2] + (data[i+2] * threshold);

                if(data[i] > 255) data[i] = 255;
                if(data[i+1] > 255) data[i+1] = 255;
                if(data[i+2] > 255) data[i+2] = 255;
            }
            return data;

        }
    }

    let createColorFilter = (n) => {
        return (data) => {
            for (var i = 0; i < data.length; i += 4) {
                data[i+n] = (data[i+n] << 2 <= 255) ? (data[i + n] << 2) : 255;
            }
            return data;
        };
    }

    let redFilter = new Filter('red', createColorFilter(0));
    let greenFilter = new Filter('green', createColorFilter(1));
    let blueFilter = new Filter('blue', createColorFilter(2));

    let brightenFilter = new Filter('brighten', createAlterFilter(0.1));
    let darkenFilter = new Filter('darken', createAlterFilter(-0.05));


    return [
        grayscaleFilter,
        redFilter,
        greenFilter,
        blueFilter,
        brightenFilter,
        darkenFilter,
    ];

}

export default filterService;
