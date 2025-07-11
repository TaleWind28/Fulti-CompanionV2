import { goto } from "$app/navigation";
import { login, registerUser } from "$lib/firebase";
import { error, fail } from "@sveltejs/kit";

export const actions={
    async login({request}:any){
        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');
        if(!email)return fail(400, {email,invalid:true});
        if(!password)return fail(400, {password,invalid:true});
        login(email,password)
        .then(()=>goto('/'))
        .catch((error)=>{alert(error)})
    },
    async register({request}:any){
        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');
        const username = data.get('username');
        if(!email)return fail(400, {email,invalid:true});
        if(!password )return fail(400, {password,invalid:true});
        if(!username)return fail(400, {username,invalid:true});

        registerUser(email,password,username)
		.then(()=>goto('/'))
		.catch((error)=>{alert(error)});
    }
}