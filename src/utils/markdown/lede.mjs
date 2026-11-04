// Plugin Sätteri : remplace le bloc `:::lede` … `:::` par le composant MDX <Lede>.
export const lede = {
    name: 'lede',
    containerDirective(node, ctx) {
        if (node.name !== 'lede') return;
        ctx.replaceNode(node, {type: 'mdxJsxFlowElement', name: 'Lede', attributes: [], children: node.children});
    },
};
