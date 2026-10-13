import { buildRobots } from '@/lib/metadata/feeds';
import { indexingSiteUrl } from '@/lib/metadata/site-url';

export default function robots() {
  return buildRobots(indexingSiteUrl());
}
