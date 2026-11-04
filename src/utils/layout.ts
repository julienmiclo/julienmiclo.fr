export type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';

export type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

export type Spacing = number | string;

export const alignClasses = {
	start: 'items-start',
	center: 'items-center',
	end: 'items-end',
	stretch: 'items-stretch',
	baseline: 'items-baseline',
};

export type Align = keyof typeof alignClasses;

export const justifyClasses = {
	start: 'justify-start',
	center: 'justify-center',
	end: 'justify-end',
	between: 'justify-between',
	around: 'justify-around',
	evenly: 'justify-evenly',
};

export type Justify = keyof typeof justifyClasses;

const gapClasses: Record<Breakpoint, string> = {
	base: 'gap-(--gap)',
	sm: 'sm:gap-(--gap-sm)',
	md: 'md:gap-(--gap-md)',
	lg: 'lg:gap-(--gap-lg)',
	xl: 'xl:gap-(--gap-xl)',
};

const gapXClasses: Record<Breakpoint, string> = {
	base: 'gap-x-(--gap-x)',
	sm: 'sm:gap-x-(--gap-x-sm)',
	md: 'md:gap-x-(--gap-x-md)',
	lg: 'lg:gap-x-(--gap-x-lg)',
	xl: 'xl:gap-x-(--gap-x-xl)',
};

const gapYClasses: Record<Breakpoint, string> = {
	base: 'gap-y-(--gap-y)',
	sm: 'sm:gap-y-(--gap-y-sm)',
	md: 'md:gap-y-(--gap-y-md)',
	lg: 'lg:gap-y-(--gap-y-lg)',
	xl: 'xl:gap-y-(--gap-y-xl)',
};

interface LayoutStyles {
	classes: string[];
	vars: Record<string, string>;
}

const toEntries = <T>(value: Responsive<T>) =>
	(typeof value === 'object' && value !== null
		? Object.entries(value)
		: [['base', value]]) as [Breakpoint, T][];

export const responsive = <T>(
	name: string,
	value: Responsive<T> | undefined,
	classes: Record<Breakpoint, string>,
	format: (value: T) => string,
): LayoutStyles => {
	const entries = value === undefined ? [] : toEntries(value);

	return {
		classes: entries.map(([breakpoint]) => classes[breakpoint]),
		vars: Object.fromEntries(
			entries.map(([breakpoint, item]) => [
				breakpoint === 'base' ? `--${name}` : `--${name}-${breakpoint}`,
				format(item),
			]),
		),
	};
};

export const combineStyles = (...styles: LayoutStyles[]): LayoutStyles => ({
	classes: styles.flatMap(({ classes }) => classes),
	vars: Object.assign({}, ...styles.map(({ vars }) => vars)),
});

const toSpacing = (value: Spacing) =>
	typeof value === 'number' ? `calc(var(--spacing) * ${value})` : value;

export const gapStyles = ({
	gap,
	gapX,
	gapY,
}: {
	gap?: Responsive<Spacing>;
	gapX?: Responsive<Spacing>;
	gapY?: Responsive<Spacing>;
}) =>
	combineStyles(
		responsive('gap', gap, gapClasses, toSpacing),
		responsive('gap-x', gapX, gapXClasses, toSpacing),
		responsive('gap-y', gapY, gapYClasses, toSpacing),
	);

export const mergeStyle = (
	vars: Record<string, string>,
	style?: string | Record<string, unknown> | null,
) => {
	if (Object.keys(vars).length === 0) return style ?? undefined;

	if (typeof style === 'string') {
		const declarations = Object.entries(vars).map(([name, value]) => `${name}: ${value}`);
		return [...declarations, style].join('; ');
	}

	return { ...vars, ...style };
};
