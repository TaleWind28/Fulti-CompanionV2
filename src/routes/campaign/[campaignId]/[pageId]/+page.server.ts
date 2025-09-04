import type { PageServerLoad } from "./$types";


export const load: PageServerLoad  = async ({url, locals, params})=> {
    return {
        pageId:params.pageId
    }
}