import {readdir, rename, rmdir} from 'node:fs/promises';

export const errorPages = () => ({
    name: 'error-pages',
    hooks: {
        'astro:build:done': async ({dir}) => {
            const errorDir = new URL('error/', dir);
            const entries = await readdir(errorDir, {withFileTypes: true});

            for (const entry of entries.filter((e) => e.isDirectory())) {
                await rename(new URL(`${entry.name}/index.html`, errorDir), new URL(`${entry.name}.html`, errorDir));
                await rmdir(new URL(`${entry.name}/`, errorDir));
            }
        },
    },
});
