/**
 * @file 生成二维码
 * @author mj(zoumiaojiang@gmail.com)
 */

import QRCode from 'qrcode';


export default function (content) {
    return new Promise((resolve, reject) => {
        QRCode.toDataURL(content, (err, string) => {
            if (err) {
                reject(err);
            }
            resolve(string);
        });
    });
}
