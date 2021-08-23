import { configVars, RemoteStub } from '../stubs/stubs-config';

/**
 * Nexus Repository Manager 3
 * https://help.sonatype.com/repomanager3/rest-and-integration-api/search-api
 *
 * @param config
 */
export function nexus3Url(config: RemoteStub): URL {
  const [groupId, artifactId, version, classifier] = config.id.split(':');

  const url = new URL(configVars.endpoint, config.server || configVars.server);
  url.searchParams.append('repository', config.repository || configVars.repository);
  url.searchParams.append('group', groupId);
  url.searchParams.append('name', artifactId);
  url.searchParams.append('maven.classifier', classifier);
  url.searchParams.append('maven.extension', 'jar');

  if (version === '+' || version.toLowerCase() === 'latest') {
    url.searchParams.append('sort', 'version');
  } else {
    url.searchParams.append('version', version);
  }

  return url;
}
