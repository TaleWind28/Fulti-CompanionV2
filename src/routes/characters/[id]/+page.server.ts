import { error } from '@sveltejs/kit';
import { posts } from '../data.js';

export function load({ params }) {
	const character = posts.find((post) => post.slug === params.id);
    console.log(character);

	if (!character) error(404);

	return {
		character
	};
}
