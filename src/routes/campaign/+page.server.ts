import { campaignSchema } from '$lib/zod';
import { zod4 } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';

export async function load({url, locals, fetch}){
    const form = await superValidate(zod4(campaignSchema));
    return {
        form:form
    }
}