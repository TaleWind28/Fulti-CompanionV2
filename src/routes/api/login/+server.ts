import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {login, registerUser } from '$lib/firebase';

//login
export const POST: RequestHandler = async ({request})=>{
	const {email,password} = await request.json();
	console.log(email,password);
	const loginSuccess = await login(email,password);
	if (loginSuccess && loginSuccess.user){
		const user = loginSuccess.user;
		return json({
			message:"Login effettuato con successo",
			data:user
		},
		{
			status:200
		}
	)
	}
	else {
		return json({
			message:"Something went wrong",
		},
		{
			status:400
		}
	)
	}
}

//registrazione
export const PUT: RequestHandler = async ({request})=>{
	const {username,email,password} = await request.json();
	console.log(email,password);
	const registrationSuccess = await registerUser(email,password,username);
	if (registrationSuccess && registrationSuccess.user){
		
	return json(
		{
			message:"Registrazione effettuata con successo",
			data:null
		},
		{
			status:200
		}
	)
	}else return json(
		{
			message:"Something went wrong",
		},
		{
			status:400
		}
	)
}

