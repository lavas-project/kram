

/**
 * 有其中一个 resolve 时，就 resolve，全都 reject 时才会 reject
 *
 * @param {Array.<Promise>} resolves promise 对象数组
 * @return {Promise} 结果
 */
export some(resolves) {
    let counter = 0;
    let max = resolves.length;

    return new Promise((resolve, reject) => {
        resolves.forEach(
            r => r.then(info => resolve(info))
                .catch(err => {
                    counter++;

                    if (counter === max) {
                        reject();
                    }
                })
        );
    });
}

/**
 * 无论所有的 promise 对象是 resolve 还是 reject，当全都有结果之后才返回 resolve
 *
 * @param {Array.<Promise>} resolves promise 对象数组
 * @return {Promise} 结果
 */
export done(resolves) {
    let counter = 0;
    let max = resolves.length;

    return new Promise(resolve => {
        resolves.forEach(
            r => r.then(info => {
                    counter++;

                    if (counter === max) {
                        resolve();
                    }
                })
                .catch(err => {
                    counter++;

                    if (counter === max) {
                        resolve();
                    }
                })
        );
    })
}
