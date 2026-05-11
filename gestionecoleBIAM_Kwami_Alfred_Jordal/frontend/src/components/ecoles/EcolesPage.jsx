import ResourcePage from '../common/ResourcePage.jsx';
import { resourceConfigs } from '../../data/resourceConfig.js';

export default function EcolesPage() {
  return <ResourcePage config={resourceConfigs.ecoles} />;
}
