import type { DecompressPlugin, DecompressPluginOptions } from '@xingrz/decompress-types';
import * as fileType from 'file-type';
import decompressTar from '@xingrz/decompress-tar';
import isStream from 'is-stream';
import unbzip2Stream from 'unbzip2-stream';

export default (): DecompressPlugin<DecompressPluginOptions> => async (input, opts) => {
	const isBuffer = Buffer.isBuffer(input);
	const type = isBuffer ? await fileType.fromBuffer(input) : null;

	if (!isBuffer && !isStream(input)) {
		throw new TypeError(`Expected a Buffer or Stream, got ${typeof input}`);
	}

	if (isBuffer && (!type || type.ext !== 'bz2')) {
		return [];
	}

	const decompressor = unbzip2Stream();
	const result = decompressTar()(decompressor, opts);

	if (isBuffer) {
		decompressor.end(input);
	} else {
		input.pipe(decompressor);
	}

	return result;
};
