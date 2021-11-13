declare module 'unbzip2-stream' {
	import { Transform } from 'stream';
	export default function bz2(): Transform;
}
