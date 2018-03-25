function performanceTest (name, asynchMethod){
    const start = `${name}-start`;
    const end = `${name}-end`;
    const measure = `${name}-measure`;

    return new Promise(function(resolve, reject) {
        performance.mark(start);
        asynchMethod().then(function () {
            performance.mark(end);
            performance.measure(measure, start, end);
            
            const duration = performance.getEntriesByName(measure)[0].duration;
            resolve(duration.toFixed(2));
        });    
    });
}

function multiPerformanceTest(name, asynchMethod, times) {
    const avg = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

    return new Promise(function(resolve, reject) {
        let result;
        if (times > 0) {
            result = performanceTest(`${name}-${times}`, asynchMethod)
                .then(multiPerformanceTest.bind(null, name, asynchMethod, --times));
        } else {
            const durations = performance.getEntriesByType('measure')
                .map(d => d.duration);
            result = avg(durations).toFixed(2);
        }
        resolve(result);
    });
}
