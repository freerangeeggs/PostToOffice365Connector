import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import taskLib = require('azure-pipelines-task-lib/task');

export function send(url: string, body: any, appInsights?: ApplicationInsights): void {

    const req = new Request(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body,
    });

    const startTime = Date.now();

    fetch(req)
        .then(response => {
            const duration = Date.now() - startTime;

            taskLib.debug(`Response Status Code: ${response.status}`);
            taskLib.debug(`Response Body: ${response.body}`);
            taskLib.debug(`Response Headers: ${JSON.stringify(response.headers)}`);

            // Calls return `1` when successful, so silly
            response.json()
                .then(responseBody => {
                    if (response.status === 200) {
                        if (responseBody !== 1) {
                            taskLib.warning(responseBody);
                        }

                        appInsights?.trackEvent({
                            name: 'Webhook sent',
                            properties: {
                                responseCode: response.status,
                                responseBody: responseBody,
                                duration: duration
                            }
                        });
                    } else {
                        throw new Error(response.status.toString() + ": " + responseBody);
                    }
                })
                .catch(error => {
                    throw new Error(error.message);
                });
        })
        .catch(error => {
            throw new Error(error.message);
        });
}
