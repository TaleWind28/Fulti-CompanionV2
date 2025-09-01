import { campaignSchema } from '$lib/zod';
import { zod4 } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';

export const load:PageServerLoad = async ({url, locals, fetch}) => {
    const form = await superValidate(zod4(campaignSchema));
    return {
        form:form
    }
}

export const actions:Actions ={
    default: async ({request, locals, fetch}) =>{
        const form = await superValidate(request,zod4(campaignSchema));

        if(!form.valid){
            return fail(400, {form, message:'Form non valido'});
        }
        console.info("form valido");
        const id = 10
        return {
            form,
            id:id
        }
    }
}