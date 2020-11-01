console.log('hi');

const testParams = (req, res) => {

    return function (next) {
        console.log(next);
    }
}

const x = testParams('1a', '2a', '3a');

x('3cc');