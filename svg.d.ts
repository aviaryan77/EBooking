declare module '*.svg' {
	import { FC, SVGProps } from 'react';
	const content: FC<SVGProps<SVGSVGElement>, any>;
	export default content;
}
