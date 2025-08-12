
export async function load({url}){
    const raw = url.searchParams.get('redirectTo');
    const redirectTo =  raw ? decodeURIComponent(raw) : '/';
    console.log(redirectTo);
    return {
        redirectTo: redirectTo
    }
}
