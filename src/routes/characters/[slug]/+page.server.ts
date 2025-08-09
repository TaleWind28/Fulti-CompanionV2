import { error } from '@sveltejs/kit';
import { posts } from '../data.js';

export function load({ params }) {
	const post = posts.find((post) => post.slug === params.slug);
    console.log(post);

	if (!post) error(404);

	return {
		post
	};
}
