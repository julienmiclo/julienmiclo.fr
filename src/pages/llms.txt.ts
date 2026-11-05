import type {APIRoute} from 'astro';
import content from '@/data/content.json';
import {getContact, getPosts} from '@/utils/content';

const section = (title: string, items: string[]) => [`## ${title}`, '', ...items].join('\n');

export const GET: APIRoute = async ({site}) => {
    const url = (path: string) => new URL(path, site).href;
    const posts = await getPosts();
    const {email, links} = getContact();

    const body = [
        `# ${content.meta.title}`,
        `> ${content.meta.description}`,
        section('Pages', [
            `- [Accueil](${url('/')}): présentation, expérience et capacités`,
            `- [Articles](${url('/posts/')}): liste de tous les articles`,
        ]),
        posts.length > 0 && section('Articles', posts.map(({id, data}) =>
            `- [${data.title}](${url(`/posts/${id}/`)})${data.description ? `: ${data.description}` : ''}`,
        )),
        section('Contact', [
            `- [E-mail](mailto:${email})`,
            ...links.map(({label, href}) => `- [${label}](${href})`),
        ]),
        section('Optional', [
            `- [Accessibilité](${url('/accessibilite/')}): déclaration d’accessibilité du site`,
            `- [Mentions légales](${url('/mentions-legales/')}): éditeur et hébergeur du site`,
        ]),
    ].filter(Boolean).join('\n\n');

    return new Response(`${body}\n`);
};
