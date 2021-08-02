import { RemoteStubConfig } from '../stub-config-model';

/**
 * Nexus Repository Manager 3
 * https://help.sonatype.com/repomanager3/rest-and-integration-api/search-api
 * @param config
 * @param env
 */
export function nexus3Url(config: RemoteStubConfig, env: Record<string, any>): string {
  const [group, artifact, version, classifier] = config.id.split(':');
  const endpoint = env.stubs_nexus3_endpoint || 'service/rest/v1/search/assets';

  const url = new URL(endpoint, config.server || env.stubs_server);
  url.searchParams.append('repository', config.repository || env.stubs_repository);
  url.searchParams.append('group', group);
  url.searchParams.append('name', artifact);
  url.searchParams.append('maven.classifier', classifier);
  url.searchParams.append('maven.extension', 'jar');

  if (version === '+' || version.toLowerCase() === 'latest') {
    url.searchParams.append('sort', 'version');
  } else {
    url.searchParams.append('version', version);
  }

  return url.toString();
}
