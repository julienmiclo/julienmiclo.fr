import {getCollection} from 'astro:content';
import content from '@/data/content.json';

export const getPosts = async () => {
    const posts = await getCollection('posts');
    return posts
        .filter((p) => p.data.status !== 'draft')
        .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
};
export const getIcons = () => content.icons;

export const getContact = () => content.contact;
