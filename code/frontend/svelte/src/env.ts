import {defineEnvVars} from '@sveltejs/kit/env';

// zorgt ervoor dat de env variabelen in deze versie herkenbaar zijn
export const variables = defineEnvVars({
    GATEWAY_SERVICE_API_URL: {},
});
