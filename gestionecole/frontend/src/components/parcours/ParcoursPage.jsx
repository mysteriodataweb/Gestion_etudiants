import ResourcePage from '../common/ResourcePage.jsx';
import { resourceConfigs } from '../../data/resourceConfig.js';

export default function ParcoursPage() {
  return <ResourcePage config={resourceConfigs.parcours} />;
}
