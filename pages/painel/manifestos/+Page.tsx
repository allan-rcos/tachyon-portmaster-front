import { ManifestScreen } from '@view/manifests/screens/ManifestScreen';
import { createManifestVM, type ManifestPageInput } from '@viewmodel/manifests/manifest-page.vm';
import type { JSX } from 'solid-js';
import { useData } from 'vike-solid/useData';

/** Único ponto de composição da rota. */
export default function Page(): JSX.Element {
  const input = useData<ManifestPageInput>();
  return <ManifestScreen vm={createManifestVM(input)} />;
}
