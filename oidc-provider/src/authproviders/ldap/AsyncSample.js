const request = require('request');

let userDetails = {};


function printString(string, callback) {
  setTimeout(() => {
    console.log(string);
    callback();
  },
  Math.floor(Math.random() * 100) + 1);
}

function printAllWithCallback() {
  printString('A', () => {
    printString('B', () => {
      printString('C', () => {});
    });
  });
}

function initialize() {
  // Setting URL and headers for request
  const options = {
    url: 'https://api.github.com/users/narenaryan',
    headers: {
      'User-Agent': 'request',
    },
  };
    // Return new promise
  return new Promise(((resolve, reject) => {
    // Do async job
    request.get(options, (err, resp, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(body));
      }
    });
  }));
}


function getData(url) {
  // Setting URL and headers for request
  const options = {
    url,
    headers: {
      'User-Agent': 'request',
    },
  };
    // Return new promise
  return new Promise(((resolve, reject) => {
    // Do async job
    request.get(options, (err, resp, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  }));
}

const errHandler = function (err) {
  console.log(err);
};

function singlePromiseChain() {
  const initializePromise = initialize();
  initializePromise.then((result) => {
    userDetails = result;
    console.log('Initialized user details');
    // Use user details from here
    console.log(userDetails);
    return userDetails;
  }, (err) => {
    console.log(err);
  }).then((result2) => {
    // Print the code activity. Prints 110
    console.log(result2.public_gists + result2.public_repos);
  });
}

function multiplePromiseChain() {
  const userProfileURL = 'https://api.github.com/users/narenaryan';
  const dataPromise = getData(userProfileURL);
  // Get user details after that get followers from URL
  dataPromise.then(JSON.parse, errHandler)
    .then((result) => {
      userDetails = result;
      // Do one more async operation here
      const anotherPromise = getData(userDetails.followers_url).then(JSON.parse);
      return anotherPromise;
    }, errHandler)
    .then((data) => {
      console.log(data);
    }, errHandler);
}


let message = '';

const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    message += 'my';
    resolve(message);
  }, 2000);
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    message += ' first';
    resolve(message);
  }, 2000);
});

const promise3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    message += ' promise';
    resolve(message);
  }, 2000);
});

const printResult = (results) => {
  console.log('Results = ', results, 'message = ', message);
};

function multiplePromiseParallelChain() {
  // See the order of promises. Final result will be according to it
  Promise.all([promise1, promise2, promise3]).then(printResult);
  Promise.all([promise2, promise1, promise3]).then(printResult);
  Promise.all([promise3, promise2, promise1]).then(printResult);
  console.log(`${message}`);
}

function doubleAfter2Seconds(x) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(x * 2);
    }, 2000);
  });
}

function addPromise(x) {
  return new Promise((resolve) => {
    doubleAfter2Seconds(10).then((a) => {
      doubleAfter2Seconds(20).then((b) => {
        doubleAfter2Seconds(30).then((c) => {
          resolve(x + a + b + c);
        });
      });
    });
  });
}

async function addAsync(x) {
  const a = await doubleAfter2Seconds(10);
  const b = await doubleAfter2Seconds(20);
  const c = await doubleAfter2Seconds(30);
  return x + a + b + c;
}

const singleLineAsyncWait = async () => {
  const result = await doubleAfter2Seconds(10);
  return result;
};

function main() {
  console.log(singleLineAsyncWait);
  printAllWithCallback();
//   singlePromiseChain();
//   multiplePromiseChain();
  multiplePromiseParallelChain();
  addPromise(10).then((sum) => {
    console.log(sum);
  });

  addAsync(10).then((sum) => {
    console.log(sum);
  });
}
exports.main = main;
