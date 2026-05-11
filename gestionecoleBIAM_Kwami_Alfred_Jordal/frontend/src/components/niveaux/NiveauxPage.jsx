import ResourcePage from '../common/ResourcePage.jsx';
import { resourceConfigs } from '../../data/resourceConfig.js';

export default function NiveauxPage() {
  return <ResourcePage config={resourceConfigs.niveaux} />;
}
