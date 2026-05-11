import ResourcePage from '../common/ResourcePage.jsx';
import { resourceConfigs } from '../../data/resourceConfig.js';

export default function DecisionsPage() {
  return <ResourcePage config={resourceConfigs.decisions} />;
}
