import taskLib = require('vsts-task-lib/task');
import request = require('request');

export function send(urli: string, bodyi: any): void {
    let requestData = {
        url: urli,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: bodyi
    };

    request(requestData, function (error: any, response: request.RequestResponse, body: any) {
        if (response.statusCode != 200) {
            if (error) {
                throw new Error(response.statusCode.toString() + ": " + error.message);
            }
            else {
                throw new Error(response.statusCode.toString() + ": " + response.request.body);
            }
        }
    });
}
