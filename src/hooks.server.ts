import type { RequestEvent, ResolveOptions } from '@sveltejs/kit';
import type { MaybePromise } from '@sveltejs/kit/types/private';

export async function handle(input: {
    event: RequestEvent;
    resolve: (event: RequestEvent, opts?: ResolveOptions) => MaybePromise<Response>;
}): Promise<Response> {
    const response = await input.resolve(input.event);
    response.headers.append('X-Robots-Tag', 'noindex, nofollow');
    return response;
}
