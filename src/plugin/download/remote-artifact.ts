import { RemoteStubConfig } from '../stub-config-model';
import { debug } from '../utils/debug';
import { nexus3Url } from './nexus3-url';
import { basename, dirname, resolve } from 'path';
import { access } from 'fs/promises';
import { constants } from 'fs';
import download from 'download';
import got from 'got';

/**
 * Get remote artifact
 *
 * @param config
 * @param env
 */
export async function remoteArtifact(config: RemoteStubConfig, env: Record<string, string>): Promise<string> {
  const stubURL = nexus3Url(config, env);
  debug('stubs:remote', `Search remote stub ${stubURL.toString()}`);

  const stubRequest = await got(stubURL.toString(), { json: true });
  const stub = stubRequest.body?.items?.shift();

  if (stub) {
    const { path, downloadUrl } = stub;
    const cachePath = env.stubs_cache || 'node_modules/.cache/stubs';
    const stubPath = resolve(`${cachePath}/${path}`);

    try {
      await access(stubPath, constants.R_OK);
      debug('stubs:remote', `Stub available at ${stubPath}`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        const directory = dirname(stubPath);
        const filename = basename(stubPath);

        debug('stubs:remote', `Download remote stub ${config.id} ${downloadUrl}`);
        await download(downloadUrl, directory, { directory, filename });

        debug('stubs:remote', `Stub downloaded at ${stubPath}`);
      }
    }

    return stubPath;
  } else {
    throw new Error(`No remote stub found! ${config.id} ${stubURL.toString()}`);
  }
}
