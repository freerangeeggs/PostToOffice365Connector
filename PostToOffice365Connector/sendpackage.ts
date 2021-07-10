import taskLib = require('azure-pipelines-task-lib/task');
import request = require('request');

export function send(urli: string, bodyi: any): { resultCode: number, message: string } {
    let requestData = {
        url: urli,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: bodyi
    };

    const response = request(requestData, function (error: any, response: request.RequestResponse, body: any) {
        taskLib.debug(`Request Body: ${response.request.body}`);
        taskLib.debug(`Response Status Code: ${response.statusCode}`);
        taskLib.debug(`Response Body: ${response.body}`);
        taskLib.debug(`Response Headers: ${JSON.stringify(response.headers)}`);

        if (response.statusCode === 200) {
            // Calls return `1` when successful, so silly
            if (response.body !== 1) {
                taskLib.warning(response.body);
            }
        } else {
            if (error) {
                throw new Error(response.statusCode.toString() + ": " + error.message);
            }
            else {
                throw new Error(response.statusCode.toString() + ": " + response.request.body);
            }
        }
    });

    return { resultCode: response.response.statusCode, message: response.response.body as string };
}
