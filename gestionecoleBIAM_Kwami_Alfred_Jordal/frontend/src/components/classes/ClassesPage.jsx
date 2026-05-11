import ResourcePage from '../common/ResourcePage.jsx';
import { resourceConfigs } from '../../data/resourceConfig.js';

export default function ClassesPage() {
  return <ResourcePage config={resourceConfigs.classes} />;
}
